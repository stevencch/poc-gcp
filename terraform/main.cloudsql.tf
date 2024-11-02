# module "mypg" {
#   source         = "./modules/gcp/cloud_sql_instance"
#   gcp_project_id = var.gcp_project_id
#   gcp_region     = var.gcp_region
#   db_pw          = var.db_pw
# }

# module "shipping_core_cloud_sql_database" {
#   source   = "./modules/gcp/cloud_sql_database"
#   instance = module.mypg.instance_name
# }
