resource "google_artifact_registry_repository" "repository" {
  location      = var.gcp_region
  repository_id = var.repository_id
  description   = "Docker repository for Cloud Run - ${var.repository_id}"
  format        = "docker"

  cleanup_policy_dry_run = false
  cleanup_policies {
    id     = "keep-minimum-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 5
    }
  }
}
