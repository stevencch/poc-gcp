module "instance_simple" {
  source        = "./modules/compute_instance/simple"
  project_id    = var.gcp_project_id
  region        = "us-central1"
  zone          = "us-central1-a"
  subnetwork    = module.network_example.network_01_self_link.subnets.0.self_link
  num_instances = 1
  service_account = {
    email  = google_service_account.default.email
    scopes = ["cloud-platform"]
  }
}

module "instance_simple1" {
  source        = "./modules/compute_instance/simple"
  project_id    = var.gcp_project_id
  region        = "us-central1"
  zone          = "us-central1-a"
  subnetwork    = module.network_example.network_02_self_link.subnets.0.self_link
  num_instances = 1
  service_account = {
    email  = google_service_account.default.email
    scopes = ["cloud-platform"]
  }
}