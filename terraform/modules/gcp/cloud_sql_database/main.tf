resource "google_sql_database" "defaultPG" {
  name     = "shipping-ms"
  instance = var.instance
}