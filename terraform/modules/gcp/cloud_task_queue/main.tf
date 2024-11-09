resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_cloud_tasks_queue" "default" {
  project  = var.gcp_project_id
  location = var.gcp_region
  name     = "ordrfmt-ctqueue-ause1-${var.name}-${random_string.suffix.result}"

  rate_limits {
    max_dispatches_per_second = var.max_dispatches_per_second
    max_concurrent_dispatches = var.max_concurrent_dispatches
  }

  retry_config {
    max_attempts       = var.max_attempts
    max_retry_duration = var.max_retry_duration
    min_backoff        = var.min_backoff
    max_backoff        = var.max_backoff
    max_doublings      = var.max_doublings
  }
}