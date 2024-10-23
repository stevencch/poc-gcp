resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_service_account" "cloud_run_sa" {
  account_id   = "ordrfmt-${var.name}-sa"
  display_name = "Ordrfmt MS ${var.name} Service Account"
}

resource "google_project_iam_member" "cloud_run_sa_iam_binding" {
  project = var.gcp_project_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_cloud_run_v2_service" "cloud_run_service" {
  name         = "ordrfmt-cr-${var.gcp_region_suffix}-${var.name}-${random_string.suffix.result}"
  project      = var.gcp_project_id
  location     = var.gcp_region
  ingress      = var.ingress
  launch_stage = "GA"
  description  = "A containerised Node.js application to send notifications to customers via Email or SMS"
  template {
    service_account                  = google_service_account.cloud_run_sa.email
    timeout                          = var.timeout
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"
    max_instance_request_concurrency = var.max_instance_request_concurrency

    containers {
      image = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${var.repository_id}/${var.image.id}:${var.image.tag}"
      resources {
        limits = var.resources_limits
      }

      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }

      env {
        name  = "VAULT_MOUNT_POINT"
        value = one(vault_gcp_auth_backend.cloud_run_auth_backend).path
      }

      env {
        name  = "VAULT_ROLE_NAME"
        value = one(vault_gcp_auth_backend_role.vault_cloud_run_role).role
      }

      env {
        name  = "SERVICE_ACCOUNT_EMAIL"
        value = google_service_account.cloud_run_sa.email
      }

      env {
        name  = "VAULT_ENDPOINT"
        value = var.vault_address
      }

      env {
        name  = "VAULT_NAMESPACE"
        value = var.vault_namespace
      }

      env {
        name  = "VAULT_PATH"
        value = "${var.vault_mount_path}/data/${var.name}"
      }

      env {
        # TODO: Update mock value 
        name  = "SUBSCRIPTION_HANDLER_OUTBOUND_TOPIC"
        value = "test-value"
      }
    }

    dynamic "vpc_access" {
      for_each = var.vpc_connector_id != null ? ["this"] : []
      content {
        connector = var.vpc_connector_id
        egress    = "ALL_TRAFFIC"
      }
    }

    scaling {
      max_instance_count = var.scaling.max_instance_count
      min_instance_count = var.scaling.min_instance_count
    }
  }
}

resource "google_cloud_run_service_iam_binding" "default" {
  location = google_cloud_run_v2_service.cloud_run_service.location
  service  = google_cloud_run_v2_service.cloud_run_service.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

resource "google_project_iam_member" "cloud_run_service_sa_roles" {
  count = length(var.required_roles)

  project = var.gcp_project_id
  role    = var.required_roles[count.index]
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Vault

resource "google_service_account_key" "cloud_run_sa_key" {
  service_account_id = google_service_account.cloud_run_sa.name
  count              = var.vault_mount_path != "" ? 1 : 0
}

resource "vault_gcp_auth_backend" "cloud_run_auth_backend" {
  path        = "ordrfmt-ms-${var.name}"
  credentials = base64decode(one(google_service_account_key.cloud_run_sa_key).private_key)
  count       = var.vault_mount_path != "" ? 1 : 0
}

resource "vault_gcp_auth_backend_role" "vault_cloud_run_role" {
  backend                 = one(vault_gcp_auth_backend.cloud_run_auth_backend).path
  role                    = "ordrfmt-ms-${var.name}-role"
  type                    = "iam"
  bound_service_accounts  = [google_service_account.cloud_run_sa.email]
  bound_projects          = [var.gcp_project_id]
  token_policies          = ["ordrfmt-ms-${var.name}-policy"]
  token_no_default_policy = true
  add_group_aliases       = true
  count                   = var.vault_mount_path != "" ? 1 : 0
}

resource "vault_policy" "vault_cloud_run_policy" {
  name = "ordrfmt-ms-${var.name}-policy"

  policy = <<EOT
    path "${var.vault_mount_path}/data/${var.name}" {
      capabilities = ["read", "list"]
    }
  EOT

  count = var.vault_mount_path != "" ? 1 : 0
}