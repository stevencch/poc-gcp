module "network_firewall_1" {
  source     = "./modules/basic_firewall_rule"
  project_id = var.gcp_project_id
  network    = google_compute_network.main.self_link
}