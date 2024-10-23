# Shared Resources

module "artifact_registry" {
  source         = "./modules/gcp/artifact_registry"
  gcp_project_id = var.gcp_project_id
  gcp_region     = var.gcp_region
  repository_id  = "poc-gcp-repository" /* The artifact registry name is referenced on deploy/push-docker.sh so they have to match */
}

# Vault

locals {
  vault_ordrfmt_ms = {
    mount_path = "ordrfmt_ms"
  }
}

# Environment

locals {
  is_production_env = var.environment == "staging" || var.environment == "production"
}