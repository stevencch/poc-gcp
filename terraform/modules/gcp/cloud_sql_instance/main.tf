# See versions at https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database_instance#database_version
resource "google_sql_database_instance" "instance" {
  name             = "my-pg-instance"
  region           = var.gcp_region
  database_version = "POSTGRES_9_6"
  root_password    = var.db_pw

  settings {
    tier = "db-custom-2-13312"
    ip_configuration {
      authorized_networks {
        name  = "Allow Cloud Run"
        value = "0.0.0.0/0" # Allow all IPs (for testing; restrict in production)
      }
      ipv4_enabled = true
    }
  }

  deletion_protection = "false"
}