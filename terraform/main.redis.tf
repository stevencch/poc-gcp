module "shared_redis" {
    source             = "./modules/gcp/memory_store"
    memory_size_gb     = 5
    replica_count      = 2
    gcp_vpc_network_id = data.google_compute_network.vpc_network.id
  
    service_name  = "common"
    region_suffix = var.region_suffix[var.gcp_region]
    // More info: Invalidating cloudfront through redis
    description = "web-be"
  }