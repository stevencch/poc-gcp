resource "google_service_account" "function_sa" {
  account_id   = "common-${var.function_name}-gcf-sa"
  display_name = "cwr-gcp-common ${var.function_name} Service Account"
}

resource "google_project_iam_member" "function_sa_iam_binding" {
  project = var.project
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:${google_service_account.function_sa.email}"
}

data "archive_file" "default" {
  type        = "zip"
  output_path = "${var.code_path}/deploy/${var.object_name}.zip"
  source_dir  = "${var.code_path}/dist/apps/${var.object_name}/"
}

resource "google_storage_bucket_object" "function_zip" {
  name   = "${var.object_name}-${data.archive_file.default.output_md5}.zip"
  bucket = var.bucket_name
  source = data.archive_file.default.output_path
}

resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_cloudfunctions2_function" "function" {
  name     = "common-cf-ause1-${var.function_name}-${random_string.suffix.result}"
  location = var.location
  project  = var.project

  build_config {
    runtime     = "nodejs20"
    entry_point = "handler"

    source {
      storage_source {
        bucket = var.bucket_name
        object = google_storage_bucket_object.function_zip.name
      }
    }
  }

  service_config {
    min_instance_count               = 0
    max_instance_count               = var.max_instance_count
    available_memory                 = "256M"
    timeout_seconds                  = 60
    service_account_email            = google_service_account.function_sa.email
    max_instance_request_concurrency = var.max_instance_request_concurrency
    available_cpu                    = var.available_cpu

    environment_variables = merge(var.env_vars, {
      SERVICE_ACCOUNT_EMAIL = google_service_account.function_sa.email
      }
    )
  }

  depends_on = [google_service_account.function_sa]
}

resource "google_cloud_run_service_iam_member" "invoker" {
  project  = var.project
  location = google_cloudfunctions2_function.function.location
  service  = google_cloudfunctions2_function.function.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.function_sa.email}"
}

# Vault

resource "google_service_account_key" "function_run_sa_key" {
  service_account_id = google_service_account.function_sa.name
  count              = 1
}


