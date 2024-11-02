resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_service_account" "cloud_run_job_sa" {
  account_id   = "cat-${var.name}-sa"
  display_name = "catalogue MS ${var.name} Service Account"
}

resource "google_project_iam_member" "cloud_run_sa_iam_binding" {
  project = var.gcp_project_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:${google_service_account.cloud_run_job_sa.email}"
}

resource "google_cloud_run_v2_job" "cloud_run_job" {
  name         = "catalogue-crj-ause1-${var.name}-${random_string.suffix.result}"
  project      = var.gcp_project_id
  location     = var.gcp_region
  launch_stage = "GA"

  template {
    task_count  = var.task_count
    parallelism = var.parallelism

    template {
      service_account       = google_service_account.cloud_run_job_sa.email
      execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
      max_retries           = var.max_retries
      timeout               = var.timeout

      containers {
        image = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${var.repository_id}/${var.image.id}:${var.image.tag}"

        resources {
          limits = var.resources_limits
        }

        env {
          name  = "NO_COLOR"
          value = "true"
        }

        env {
          name  = "SERVICE_ACCOUNT_EMAIL"
          value = google_service_account.cloud_run_job_sa.email
        }

        dynamic "env" {
          for_each = var.env_vars
          content {
            name  = env.key
            value = env.value
          }
        }

      }
    }
  }

  depends_on = [google_project_iam_member.cloud_run_sa_iam_binding]
}

resource "google_project_iam_member" "cloud_run_job_sa_roles" {
  count = length(var.required_roles)

  project = var.gcp_project_id
  role    = var.required_roles[count.index]
  member  = "serviceAccount:${google_service_account.cloud_run_job_sa.email}"
}


