output "google_service_account_email" {
  value = google_service_account.cloud_run_sa.email
}

output "uri" {
  value = google_cloud_run_v2_service.cloud_run_service.uri
}

output "name" {
  value = google_cloud_run_v2_service.cloud_run_service.name
}
