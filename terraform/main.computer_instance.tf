# module "instance_simple" {
#   source        = "./modules/compute_instance/simple"
#   project_id    = var.gcp_project_id
#   region        = "us-central1"
#   zone          = "us-central1-a"
#   hostname      = "simple-a"
#   subnetwork    = module.network_example.network_01_subnets.0
#   num_instances = 1
#   service_account = {
#     email  = google_service_account.default.email
#     scopes = ["cloud-platform"]
#   }
#   tags = ["web"]
# }

# module "instance_simple1" {
#   source        = "./modules/compute_instance/simple"
#   project_id    = var.gcp_project_id
#   region        = "us-central1"
#   zone          = "us-central1-a"
#   hostname      = "simple-b"
#   subnetwork    = module.network_example.network_02_subnets.0
#   num_instances = 1
#   service_account = {
#     email  = google_service_account.default.email
#     scopes = ["cloud-platform"]
#   }
#   tags = ["web"]
# }

