resource "random_string" "resource_id" {
  length  = 4
  upper   = false
  special = false
}

resource "google_redis_instance" "cache" {
  name                    = "${var.service_name}-redis-${var.region_suffix}-${var.description}-${random_string.resource_id.result}"
  memory_size_gb          = var.memory_size_gb
  replica_count           = var.replica_count
  tier                    = "STANDARD_HA"
  transit_encryption_mode = "SERVER_AUTHENTICATION"
  read_replicas_mode      = "READ_REPLICAS_ENABLED"

  authorized_network = var.gcp_vpc_network_id
  connect_mode       = "PRIVATE_SERVICE_ACCESS"

  lifecycle {
    prevent_destroy = false
  }
}
