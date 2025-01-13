resource "random_string" "resource_id" {
  length  = 4
  upper   = false
  special = false
}

resource "google_redis_instance" "cache" {
  name           = "memory-cache"
  memory_size_gb = var.memory_size_gb

  lifecycle {
    prevent_destroy = false
  }
}
