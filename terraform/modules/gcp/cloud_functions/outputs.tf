output "google_service_account_email" {
  value = google_service_account.function_sa.email
}

output "function_url" {
  value = google_cloudfunctions2_function.function.url
}
