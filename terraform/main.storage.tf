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

