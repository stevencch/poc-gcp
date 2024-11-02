variable "gcp_project_id" {
  type = string
}

variable "gcp_region" {
  type = string
}

variable "name" {
  type = string
}

variable "repository_id" {
  type = string
}

variable "image" {
  type = object({
    id  = string,
    tag = string
  })
}

variable "task_count" {
  type    = number
  default = 1
}

variable "parallelism" {
  type    = number
  default = 0
}

variable "max_retries" {
  type = number
}

variable "timeout" {
  type = string
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

variable "required_roles" {
  type        = list(string)
  default     = []
  description = "Optional. Roles required by the cloud run job"
}
