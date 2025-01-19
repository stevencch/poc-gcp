# resource "google_monitoring_notification_channel" "notification_channel_email" {
#   for_each = toset(split(",", var.monitoring_notification_emails_csv))

#   display_name = each.key
#   type         = "email"
#   labels = {
#     email_address = each.key
#   }
# }


# locals {
#   notification_channel_names = concat(
#     values(google_monitoring_notification_channel.notification_channel_email)[*].name
#   )
# }

# module "my-nest-app_request_latency_alert" {
#   source         = "./modules/gcp/monitoring_alert"
#   gcp_project_id = var.gcp_project_id
#   display_name   = "${module.my-nest-app_cloud_run_service.name} - Median request latency > 200ms over 1 minutes"
#   severity       = "WARNING"
#   condition = {
#     threshold = {
#       filter               = <<EOT
#         resource.type = "cloud_run_revision" AND
#         resource.label.service_name = "${module.my-nest-app_cloud_run_service.name}" AND
#         metric.type = "run.googleapis.com/request_latencies"
#       EOT
#       comparison_type      = "COMPARISON_GT"
#       threshold_value      = 200 # ms
#       alignment_period     = "60s"
#       per_series_aligner   = "ALIGN_DELTA"
#       cross_series_reducer = "REDUCE_PERCENTILE_50"
#     }
#     retest_period = "60s"
#   }
#   notification_channels = local.notification_channel_names
# }