resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_service_account" "workflow_sa" {
  account_id   = "inv-${var.name}-sa"
  display_name = "Inventory MS ${var.name} Service Account"
  count        = var.vault_vars != null ? 1 : 0
}

locals {
  service_account_email = var.vault_vars != null ? one(google_service_account.workflow_sa[*].email) : var.service_account_email
}

resource "google_project_iam_member" "workflow_sa_workflow_invoker" {
  project = var.gcp_project_id
  role    = "roles/workflows.invoker"
  member  = "serviceAccount:${local.service_account_email}"
}

resource "google_project_iam_member" "workflow_sa_roles" {
  count = length(var.required_roles)

  project = var.gcp_project_id
  role    = var.required_roles[count.index]
  member  = "serviceAccount:${local.service_account_email}"
}

resource "google_workflows_workflow" "workflow" {
  project         = var.gcp_project_id
  region          = var.gcp_region
  name            = "inventory-wf-ause1-${var.name}-${random_string.suffix.result}"
  description     = var.description
  service_account = local.service_account_email
  call_log_level  = "LOG_ERRORS_ONLY"
  source_contents = var.vault_vars != null ? join("\n", [
    var.source_contents,
    templatefile("${path.root}/templates/vault_subworkflow.tftpl",
      {
        vault_base_url        = var.vault_vars.vault_base_url
        vault_namespace       = var.vault_vars.vault_namespace
        vault_mount_point     = one(vault_gcp_auth_backend.workflow_auth_backend[*].path)
        vault_role            = one(vault_gcp_auth_backend_role.vault_workflow_role[*].role)
        vault_secret_path     = "${var.vault_vars.vault_mount_path}/data/${var.name}"
        service_account_email = local.service_account_email
      }
    )
  ]) : var.source_contents
  user_env_vars = var.env_vars
}

resource "google_service_account_key" "workflow_sa_key" {
  service_account_id = one(google_service_account.workflow_sa[*].name)
  count              = var.vault_vars != null ? 1 : 0
}

resource "vault_gcp_auth_backend" "workflow_auth_backend" {
  path        = "inventory-ms-${var.name}"
  credentials = base64decode(one(google_service_account_key.workflow_sa_key[*].private_key))
  count       = var.vault_vars != null ? 1 : 0
}

resource "vault_gcp_auth_backend_role" "vault_workflow_role" {
  backend                 = one(vault_gcp_auth_backend.workflow_auth_backend[*].path)
  role                    = "inventory-ms-${var.name}-role"
  type                    = "iam"
  bound_service_accounts  = [local.service_account_email]
  bound_projects          = [var.gcp_project_id]
  token_policies          = ["inventory-ms-${var.name}-policy"]
  token_no_default_policy = true
  add_group_aliases       = true
  count                   = var.vault_vars != null ? 1 : 0
}

resource "vault_policy" "vault_workflow_policy" {
  name = "inventory-ms-${var.name}-policy"

  policy = <<EOT
    path "${var.vault_vars.vault_mount_path}/data/${var.name}" {
      capabilities = ["read", "list"]
    }
  EOT

  count = var.vault_vars != null ? 1 : 0
}
