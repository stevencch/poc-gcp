module "my-bigquery" {
  source       = "./modules/gcp/cloud_bigquery"
  project      = var.gcp_project_id
  location     = var.gcp_region
  dataset_name = "customer"
  table_name   = "data"
  account      = module.my-nest-app_cloud_run_service.google_service_account_email
}

