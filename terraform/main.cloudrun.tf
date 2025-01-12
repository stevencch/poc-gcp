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
  #db_ip                         = 
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
    PROJECT_ID                 = var.gcp_project_id
    DRY_RUN                    = "false"
    GCP_LOCATION_ID            = var.gcp_region
    LOCATION_ID                = var.gcp_region
    PAYMENT_NOTIFICATION_TOPIC = module.payment_notifications_topic.name
    # DB_IP                                         = google_sql_database_instance.instance.public_ip_address
    DB_PW                 = var.db_pw
    INPUT_BUCKET          = module.test_cloud_storage.name
    INPUT_FILE            = "test.csv"
    TASK_QUEUE_NAME       = module.import_retail_full_ctqueue.name
    NEW_RELIC_APP_NAME    = "poc-gcp"
    NEW_RELIC_LICENSE_KEY = "ce472b59adb8ae871a7002d9b5144966FFFFNRAL"
  }
  required_roles = [
    "roles/iam.serviceAccountUser",
    "roles/cloudtasks.enqueuer",
    "roles/pubsub.publisher",
    "roles/storage.admin",
    "roles/bigquery.admin"
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
  hpc_client_id                    = var.hpc_client_id
  hpc_client_secret                = var.hpc_client_secret
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
    #SQL_DATABASE_PRIMARY_INSTANCE_CONNECTION_NAME = module.mypg.instance_name
    #DB_IP                                         = module.mypg.instance_public_ip
    DB_PW             = var.db_pw
    DATABASE_ID       = module.firestore.name
    DEAD_LETTER_TOPIC = module.core_deadletter_topic.id
  }
  required_roles = [
    "roles/iam.serviceAccountUser",
    "roles/cloudtasks.enqueuer",
    "roles/pubsub.publisher",
    "roles/datastore.user"
  ]
}


module "myjob1_cloud_run_job" {
  source         = "./modules/gcp/cloud_run_job"
  gcp_project_id = var.gcp_project_id
  gcp_region     = var.gcp_region
  name           = "myjob1run"
  repository_id  = module.artifact_registry.repository_id
  image          = var.project_images["myjob1"]
  task_count     = 1
  max_retries    = 3
  timeout        = "600s"

  resources_limits = {
    cpu    = 1
    memory = "512Mi"
  }
  env_vars = {
    LOGGING_LEVEL                = "ERROR",
    SYNC_MODE                    = "full"
    DATA_SOURCE_STORED_PROCEDURE = "TODO"
    OLD_RECORDS_DAYS             = "2"
    BATCH_SIZE                   = "50"
    PUBSUB_MAX_MESSAGES          = "100"
    PUBSUB_MAX_MILLISECONDS      = "10"
  }
  required_roles = [
    "roles/iam.serviceAccountUser",
    "roles/pubsub.publisher",
    "roles/run.developer" # required for run.jobs.runWithOverrides
  ]
}

