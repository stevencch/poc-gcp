output "google_service_account_email" {
  value = google_service_account.cloud_run_job_sa.email
}

output "job_name" {
  value = google_cloud_run_v2_job.cloud_run_job.name
}
