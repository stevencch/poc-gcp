module "pop_cloud_run_service" {
  source                           = "./modules/gcp/cloud_run_service"
  gcp_project_id                   = var.gcp_project_id
  gcp_region                       = var.gcp_region
  gcp_region_suffix                = var.region_suffix[var.gcp_region]
  repository_id                    = module.artifact_registry.repository_id
  name                             = "pop"
  image                            = var.project_images["pop"]
  description                      = "A containerised Node.js application to process events intended for OFMS Cloud Events Handler Service"
  ingress                          = "INGRESS_TRAFFIC_ALL"
  max_instance_request_concurrency = 80
  timeout                          = "300s"
  vault_address                    = var.vault_address
  vault_namespace                  = var.vault_namespace
  vault_mount_path                 = local.vault_ordrfmt_ms.mount_path
  vpc_connector_id                 = var.gcp_shared_vpc_connector_id
  resources_limits = {
    cpu    = "1"
    memory = "512Mi"
  }
  scaling = {
    max_instance_count = 50
    min_instance_count = 0
  }
  env_vars = {
    NO_COLOR              = "true"
    LOGGING_LEVEL         = "ERROR"
    GCP_PROJECT_ID        = var.gcp_project_id
    DRY_RUN               = local.is_production_env ? "false" : "true"
    CT_API_URL            = var.ct_api_url
    CT_AUTH_URL           = var.ct_auth_url
    CT_PROJECT_KEY        = var.ct_project_key
    GCP_LOCATION_ID       = var.gcp_region
    RETRY_TASK_QUEUE_NAME = module.ordrfmt_retry_ctqueue.name
    MAX_RETRY_LIMIT       = 5
    PAYMENT_MODIFY_TOPIC  = module.payment_global_topic.name
  }
  required_roles = [
    "roles/iam.serviceAccountUser",
    "roles/cloudtasks.enqueuer",
    "roles/pubsub.publisher"
  ]
}


module "middleware_cloud_run_service" {
  source                           = "./modules/gcp/cloud_run_service"
  gcp_project_id                   = var.gcp_project_id
  gcp_region                       = var.gcp_region
  gcp_region_suffix                = var.region_suffix[var.gcp_region]
  repository_id                    = module.artifact_registry.repository_id
  name                             = "middleware"
  image                            = var.project_images["middleware"]
  description                      = "A containerised Node.js application to process and publish on-prem events to northbound services"
  ingress                          = "INGRESS_TRAFFIC_ALL"
  max_instance_request_concurrency = 80
  timeout                          = "300s"
  vault_address                    = var.vault_address
  vault_namespace                  = var.vault_namespace
  vault_mount_path                 = local.vault_ordrfmt_ms.mount_path
  vpc_connector_id                 = var.gcp_shared_vpc_connector_id
  resources_limits = {
    cpu    = "1"
    memory = "512Mi"
  }
  scaling = {
    max_instance_count = 50
    min_instance_count = 0
  }
  env_vars = {
    NO_COLOR       = "true"
    LOGGING_LEVEL  = "VERBOSE"
    GCP_PROJECT_ID = var.gcp_project_id
    CT_API_URL     = var.ct_api_url
    CT_AUTH_URL    = var.ct_auth_url
    CT_PROJECT_KEY = var.ct_project_key
  }
  required_roles = [
    "roles/pubsub.publisher"
  ]
}

