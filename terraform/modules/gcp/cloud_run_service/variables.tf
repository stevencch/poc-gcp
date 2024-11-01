variable "gcp_project_id" {
  type = string
}

variable "gcp_region" {
  type = string
}

variable "gcp_region_suffix" {
  type = string
}

variable "name" {
  type = string
}

variable "repository_id" {
  type = string
}

variable "description" {
  type = string
}

variable "image" {
  type = object({
    id  = string,
    tag = string
  })
}

variable "ingress" {
  type = string
}

variable "max_instance_request_concurrency" {
  type = number
}

variable "timeout" {
  type = string
}

variable "scaling" {
  type = object({
    min_instance_count = number
    max_instance_count = number
  })
}

variable "resources_limits" {
  type = object({
    cpu    = string
    memory = string
  })
}

variable "env_vars" {
  type        = map(string)
  default     = {}
  description = "Optional. Environment variables to set in the container."
}

variable "vault_address" {
  type = string
}

variable "vault_namespace" {
  type = string
}

variable "vault_mount_path" {
  type    = string
  default = ""
}

variable "required_roles" {
  type        = list(string)
  default     = []
  description = "Optional. Roles required by the cloud run service"
}

variable "vpc_connector_id" {
  type    = string
  default = null
}

variable "hpc_client_id" {
  type    = string
  default = ""
}

variable "hpc_client_secret" {
  type    = string
  default = ""
}

variable "db_ip" {
  type    = string
  default = ""
}

variable "db_pw" {
  type    = string
  default = ""
}

