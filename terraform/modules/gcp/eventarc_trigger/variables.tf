variable "gcp_project_id" {
  type = string
}

variable "gcp_region" {
  type = string
}

variable "name" {
  type = string
}

variable "service_account_email" {
  type = string
}

variable "type" {
  type = string
}

variable "content_type" {
  type    = string
  default = "application/json"
}

variable "additional_critera" {
  type = list(object({
    attribute = string
    value     = string
    operator  = optional(string)
  }))
  default = []
}

variable "destination" {
  type = object({
    cloud_run_service = optional(object({
      region  = string
      service = string
      path    = string
    }))
    workflow = optional(string)
  })

  validation {
    condition     = (var.destination.cloud_run_service == null && var.destination.workflow != null) || (var.destination.cloud_run_service != null && var.destination.workflow == null)
    error_message = "Either cloud_run_service or workflow must be specified"
  }
}
