output "instance_name" {
  description = "The name of the SQL instance"
  value       = google_sql_database_instance.instance.name
}

output "instance_connection_name" {
  description = "The connection name of the SQL instance"
  value       = google_sql_database_instance.instance.connection_name
}

output "instance_public_ip" {
  description = "The connection name of the SQL instance"
  value       = google_sql_database_instance.instance.public_ip_address
}