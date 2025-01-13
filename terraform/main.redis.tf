module "shared_redis" {
  source         = "./modules/gcp/memory_store"
  memory_size_gb = 1
}