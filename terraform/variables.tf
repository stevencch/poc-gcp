# Internal
variable "region_suffix" {
  type = map(string)
  default = {
    "australia-southeast1" = "ause1",
    "australia-southeast2" = "ause2"
  }
}

# Base GCP Variables
variable "gcp_project_id" {
  type    = string
  default = "poc-gcp-439306"
}

variable "gcp_region" {
  type    = string
  default = "australia-southeast1"
}

# GCP functions for internal use
#variable "gcp_functions_map" {
#  type = map(object({
#    object_name           = string,
#    environment_variables = optional(map(string))
#  }))
#}

# Cloud Run
variable "project_images" {
  type = map(object({
    id  = string,
    tag = string
  }))
  default = {}
}

//Vault variables
variable "vault_address" {
  type = string
}

variable "vault_namespace" {
  type = string
}

# commercetools shared
variable "ct_api_url" {
  type = string
}

variable "ct_project_key" {
  type = string
}

variable "ct_auth_url" {
  type = string
}

# commercetools provider
variable "ct_tf_client_id" {
  type = string
}

variable "ct_tf_client_secret" {
  type = string
}

variable "ct_tf_scopes" {
  type = string
}

variable "gcp_shared_vpc_connector_id" {
  type = string
}

# environment
variable "environment" {
  type = string

  validation {
    condition     = contains(["develop", "qa", "staging", "production"], var.environment)
    error_message = "Environment must be one of 'develop', 'qa', 'staging' or 'production'"
  }
}

