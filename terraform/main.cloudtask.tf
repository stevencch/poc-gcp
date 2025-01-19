# # Cloud Tasks

# module "import_retail_full_ctqueue" {
#   source                    = "./modules/gcp/cloud_task_queue"
#   gcp_project_id            = var.gcp_project_id
#   gcp_region                = var.gcp_region
#   name                      = "notifications"
#   max_dispatches_per_second = 2.5
#   max_attempts              = 10
# }