variable "gcp_project_id" {
  type = string
}

variable "gcp_region" {
  type = string
}

variable "name" {
  type = string
}

variable "description" {
  type = string
}

variable "service_account_email" {
  type    = string
  default = null
  validation {
    condition     = var.vault_vars == null || (var.vault_vars != null && var.service_account_email == null)
    error_message = "When `vault_vars` is set, `service_account_email` must not be provided."
  }
}

variable "source_contents" {
  type = string
}

variable "env_vars" {
  type        = map(string)
  default     = {}
  description = "Optional. Environment variables to set in the workflow."
}

variable "vault_vars" {
  type = object({
    vault_base_url   = string
    vault_namespace  = string
    vault_mount_path = string
  })
  default = null
}

variable "required_roles" {
  type        = list(string)
  default     = []
  description = "Optional. Roles required by the workflow"
}
