module "import_redrive_workflow" {
  source                = "./modules/gcp/workflow"
  gcp_project_id        = var.gcp_project_id
  gcp_region            = var.gcp_region
  name                  = "test_poc_gcp"
  description           = "Workflow to re-drive failed import messages from the shared dead-letter database."
  service_account_email = google_service_account.workflows.email
  source_contents       = file("${path.root}/workflows/test.tftpl")
}