module "comms_outbox_trigger" {
  source                = "./modules/gcp/eventarc_trigger"
  gcp_project_id        = var.gcp_project_id
  gcp_region            = var.gcp_region
  name                  = "outbox"
  service_account_email = module.myapp1_cloud_run_service.google_service_account_email
  type                  = "google.cloud.firestore.document.v1.created"
  # For direct events from Cloud Firestore, this must be application/protobuf and the event data is a byte array.
  # https://cloud.google.com/eventarc/docs/run/route-trigger-cloud-firestore
  content_type = "application/protobuf"
  additional_critera = [
    {
      attribute = "database"
      value     = module.firestore.name
    },
    {
      attribute = "document"
      value     = "outbox/{id}"
      operator  = "match-path-pattern"
    }
  ]
  destination = {
    cloud_run_service = {
      region  = var.gcp_region
      service = module.myapp1_cloud_run_service.name
      path    = "/api/payment/handler"
    }
  }
}