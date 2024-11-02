resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_cloud_scheduler_job" "job" {
  name        = "catalogue-scheduler-ause1-${var.name}-${random_string.suffix.result}"
  region      = var.gcp_region
  description = var.description
  schedule    = var.schedule
  time_zone   = var.time_zone
  paused      = var.pause_scheduler

  dynamic "http_target" {
    for_each = var.http_target != null ? ["this"] : []

    content {
      http_method = var.http_target.method
      uri         = var.http_target.uri
      body        = var.http_target.body
      headers     = var.http_target.headers
      oauth_token {
        service_account_email = var.http_target.service_account_email
      }
    }
  }
}
