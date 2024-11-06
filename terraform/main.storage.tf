# Cloud Storage
module "test_cloud_storage" {
  source      = "./modules/gcp/cloud_storage"
  project     = var.gcp_project_id
  region_id   = var.gcp_region
  bucket_name = "inventory-storage-ause1-retaildelta"


  lifecycle_rules = {
    delete_rule = {
      action = {
        type = "Delete"
      }
      condition = {
        age = 1
      }
    }
  }
}

resource "google_storage_bucket_iam_member" "delta_adapter_delta_bucket_iam" {
  bucket = module.test_cloud_storage.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${module.my-nest-app_cloud_run_service.google_service_account_email}"
}

