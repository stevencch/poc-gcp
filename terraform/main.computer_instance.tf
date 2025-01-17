
resource "google_service_account" "computer" {
  account_id   = "my-sa-1"
  display_name = "Custom SA for VM Instance"
}
module "instance_simple" {
  source          = "./modules/compute_instance/simple"
  project_id      = var.gcp_project_id
  region          = "us-central1"
  subnetwork      = google_compute_subnetwork.main.self_link
  num_instances   = 4
  service_account = google_service_account.computer.email
}