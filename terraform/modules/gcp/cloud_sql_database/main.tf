resource "google_sql_database" "instance" {
  name     = "shipping-ms"
  instance = var.instance
}