# module "myjob1_cloud_schedule" {
#   source          = "./modules/gcp/cloud_scheduler"
#   gcp_region      = var.gcp_region
#   name            = "myjob1schedule"
#   description     = "Scheduler to run PIMS adapter delta job"
#   schedule        = "* * * * *"
#   time_zone       = "Australia/Melbourne"
#   pause_scheduler = true
#   http_target = {
#     method                = "POST"
#     uri                   = "https://run.googleapis.com/v2/projects/${var.gcp_project_id}/locations/${var.gcp_region}/jobs/${module.myjob1_cloud_run_job.job_name}:run"
#     service_account_email = module.myjob1_cloud_run_job.google_service_account_email
#     headers = {
#       "Content-Type" = "application/json"
#     }
#     body = base64encode(jsonencode({
#       overrides = {
#         containerOverrides = [{
#           env = [
#             { name = "SYNC_MODE", value = "delta" },
#             { name = "DELTA_SYNC_PERIOD_MINUTES", value = "30" }
#           ]
#         }]
#       }
#     }))
#   }
# }
