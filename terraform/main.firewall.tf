# # # module "network_firewall_1" {
# # #   source     = "./modules/basic_firewall_rule"
# # #   name       = "my-firewall-rule"
# # #   project_id = var.gcp_project_id
# # #   network    = google_compute_network.main.self_link
# # # }

# module "network_firewall_vpc3-web" {
#   source     = "./modules/basic_firewall_rule"
#   name       = "firewall-vpc3-web"
#   project_id = var.gcp_project_id
#   network    = google_compute_network.vpc-3.name
# }

# module "network_firewall_vpc3-ssh" {
#   source     = "./modules/basic_firewall_rule"
#   name       = "firewall-vpc3-ssh"
#   project_id = var.gcp_project_id
#   network    = google_compute_network.vpc-3.name
# }


# module "network_firewall_vpc4-web" {
#   source     = "./modules/basic_firewall_rule"
#   name       = "firewall-vpc4-web"
#   project_id = var.gcp_project_id
#   network    = google_compute_network.vpc-4.name
# }

# module "network_firewall_vpc4-ssh" {
#   source     = "./modules/basic_firewall_rule"
#   name       = "firewall-vpc4-ssh"
#   project_id = var.gcp_project_id
#   network    = google_compute_network.vpc-4.name
# }