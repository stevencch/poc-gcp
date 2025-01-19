# module "errors_db" {
#   source      = "./modules/gcp/firestore"
#   project     = var.gcp_project_id
#   location_id = var.gcp_region
#   name        = "common-fsdb-ause1-errors"
# }

# resource "google_firestore_field" "firestore_errors_expires_at" {
#   project    = var.gcp_project_id
#   database   = module.errors_db.name
#   collection = "dead_letter_messages"
#   field      = "expires_at"
#   ttl_config {}
# }

# resource "google_firestore_index" "source_subscription_id_created" {
#   project    = var.gcp_project_id
#   database   = module.errors_db.name
#   collection = "dead_letter_messages"

#   fields {
#     field_path = "source_subscription_id"
#     order      = "ASCENDING"
#   }

#   fields {
#     field_path = "created"
#     order      = "ASCENDING"
#   }
# }

# module "shared_bucket" {
#   source      = "./modules/gcp/cloud_storage"
#   project     = var.gcp_project_id
#   region_id   = var.gcp_region
#   bucket_name = "common-storage-ause1-cf"
# }

# module "error_handler_cf" {
#   source                           = "./modules/gcp/cloud_functions"
#   project                          = var.gcp_project_id
#   location                         = var.gcp_region
#   bucket_name                      = module.shared_bucket.name
#   function_name                    = "errorhandler"
#   object_name                      = "error-handler"
#   max_instance_request_concurrency = 10
#   available_cpu                    = 1
#   code_path                        = var.code_path

#   env_vars = {
#     NO_COLOR      = "true"
#     LOGGING_LEVEL = "ERROR"
#     PROJECT_ID    = var.gcp_project_id
#     DATABASE_ID   = module.errors_db.name
#   }
# }

# Give errorhandler access to the errors db
resource "google_project_iam_member" "datastore_role" {
  project = var.gcp_project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${module.error_handler_cf.google_service_account_email}"
  condition {
    title       = "access_errors_db"
    description = "Allow access only to the errors db"
    expression  = "resource.name==\"${module.errors_db.id}\""
  }
}




