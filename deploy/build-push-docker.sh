#!/bin/bash

# Variables
commit_id=$(git rev-parse --short HEAD)
project_id=$TF_VAR_gcp_project_id
registry="australia-southeast1-docker.pkg.dev"
repository=$GCP_ARTIFACT_REGISTRY_REPOSITORY_ID
project_images_tfvars="terraform/project_images.tfvars"

# Authenticate to docker GCP container registry
gcloud auth configure-docker australia-southeast1-docker.pkg.dev -q

# Function to push Docker images
push_cloudrun_image() {
  local image_name=$1
  local target_image="$registry/$project_id/$repository/$image_name:$commit_id"
  
  echo "Pushing $image_name to target: $target_image"
  
  docker tag "$image_name" "$target_image"
  docker push "$target_image"
}

# Function to retrieve image tags from gcp
get_latest_image_tag() {
  local image_name=$1
  local full_image_name="$registry/$project_id/$repository/$image_name"
  
  gcloud artifacts docker images list "$full_image_name" --sort-by=~createTime --limit=1 --include-tags --format='get(tags[])'
}

if [ -z "$LAST_SUCCESSFUL_COMMIT" ] || [ "$LAST_SUCCESSFUL_COMMIT" == "" ]; then
  # no succesful workflow runs; treat all projects as new
  affected_projects=$(npx nx show projects --with-target docker-build)
else
  # Identify affected cloud run projects
  affected_projects=$(npx nx show projects --affected --base $LAST_SUCCESSFUL_COMMIT --with-target docker-build)
fi

if [ -n "$affected_projects" ]; then
  echo "Affected projects: $affected_projects"
  
  if [ $GITHUB_WORKFLOW == "Deploy" ]; then
    # Build docker images for affected projects
    npx nx run-many -t docker-build -p $affected_projects
  fi
else
  echo "Affected projects: none"
fi

echo "project_images = {" > "$project_images_tfvars"

# Loop through all cloud run projects
for project in $(npx nx show projects --with-target docker-build); do
  if echo "$affected_projects" | grep -xq "$project"; then
    echo "'${project}' is affected. New docker image will be pushed with tag '$commit_id' during deploy worfklow.";
    
    if [ $GITHUB_WORKFLOW == "Deploy" ]; then
      push_cloudrun_image "$project"
    fi
    
    image_tag=$commit_id
  else
    image_tag=$(get_latest_image_tag "$project")
    echo "'${project}' is not affected. Existing docker image with tag '$image_tag' will be used.";
  fi
  
  # Update TF var file name
  echo " " \""$project"\" : { \""id"\" : \""$project"\", \""tag"\" : \""$image_tag"\" }, >> "$project_images_tfvars"
done

# Remove trailing comma
sed -i '$ s/,$//' "$project_images_tfvars"
echo "}" >> "$project_images_tfvars"
