module "my-nest-app_cloud_run_service" {
  source            = "./modules/gcp/cloud_run_service"
  gcp_project_id    = var.gcp_project_id
  gcp_region        = var.gcp_region
  gcp_region_suffix = var.region_suffix[var.gcp_region]
  repository_id     = module.artifact_registry.repository_id
  name              = "my-nest-app"
  # image = {
  #   id  = "my-nest-app",
  #   tag = "90092cc"
  # }
  image                            = var.project_images["my-nest-app"]
  description                      = "A containerised Node.js application to process events intended for OFMS Cloud Events Handler Service"
  ingress                          = "INGRESS_TRAFFIC_ALL"
  max_instance_request_concurrency = 80
  timeout                          = "300s"
  vault_address                    = ""
  vault_namespace                  = ""
  vault_mount_path                 = ""
  vpc_connector_id                 = ""
  hpc_client_id                    = var.hpc_client_id
  hpc_client_secret                = var.hpc_client_secret
  #mssql_ip                         = google_sql_database_instance.instance.public_ip_address
  resources_limits = {
    cpu    = "1"
    memory = "512Mi"
  }
  scaling = {
    max_instance_count = 2
    min_instance_count = 0
  }
  env_vars = {
    NO_COLOR                   = "true"
    LOGGING_LEVEL              = "ERROR"
    GCP_PROJECT_ID             = var.gcp_project_id
    DRY_RUN                    = "false"
    GCP_LOCATION_ID            = var.gcp_region
    PAYMENT_NOTIFICATION_TOPIC = module.payment_notifications_topic.name
  }
  required_roles = [
    "roles/iam.serviceAccountUser",
    "roles/cloudtasks.enqueuer",
    "roles/pubsub.publisher"
  ]
}


module "myapp1_cloud_run_service" {
  source            = "./modules/gcp/cloud_run_service"
  gcp_project_id    = var.gcp_project_id
  gcp_region        = var.gcp_region
  gcp_region_suffix = var.region_suffix[var.gcp_region]
  repository_id     = module.artifact_registry.repository_id
  name              = "myapp1"
  # image = {
  #   id  = "my-nest-app",
  #   tag = "90092cc"
  # }
  image                            = var.project_images["myapp1"]
  description                      = "A containerised Node.js application to process events intended for OFMS Cloud Events Handler Service"
  ingress                          = "INGRESS_TRAFFIC_ALL"
  max_instance_request_concurrency = 80
  timeout                          = "300s"
  vault_address                    = ""
  vault_namespace                  = ""
  vault_mount_path                 = ""
  vpc_connector_id                 = ""
  resources_limits = {
    cpu    = "1"
    memory = "512Mi"
  }
  scaling = {
    max_instance_count = 2
    min_instance_count = 0
  }
  env_vars = {
    NO_COLOR        = "true"
    LOGGING_LEVEL   = "ERROR"
    GCP_PROJECT_ID  = var.gcp_project_id
    DRY_RUN         = "false"
    GCP_LOCATION_ID = var.gcp_region
  }
}
