# # module "network_firewall_1" {
# #   source     = "./modules/basic_firewall_rule"
# #   name       = "my-firewall-rule"
# #   project_id = var.gcp_project_id
# #   network    = google_compute_network.main.self_link
# # }

# module "network_firewall_vpc1" {
#   source     = "./modules/basic_firewall_rule"
#   name       = "firewall-vpc1"
#   project_id = var.gcp_project_id
#   network    = module.network_example.network_01_name
# }

# module "network_firewall_vpc2" {
#   source     = "./modules/basic_firewall_rule"
#   name       = "firewall-vpc2"
#   project_id = var.gcp_project_id
#   network    = module.network_example.network_02_name
# }