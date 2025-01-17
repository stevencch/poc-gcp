module "instance_simple" {
  source        = "./modules/compute_instance/simple"
  project_id    = var.gcp_project_id
  region        = "us-central1"
  zone          = "us-central1-a"
  subnetwork    = google_compute_subnetwork.main.self_link
  num_instances = 1
  service_account = {
    email  = google_service_account.default.email
    scopes = ["cloud-platform"]
  }
}