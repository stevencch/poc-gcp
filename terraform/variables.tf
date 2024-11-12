# Base GCP Variables
variable "region_suffix" {
  type = map(string)
  default = {
    "australia-southeast1" = "ause1",
    "australia-southeast2" = "ause2"
  }
}
variable "gcp_project_id" {
  type    = string
  default = "poc-gcp-439306"
}

variable "gcp_region" {
  type    = string
  default = "australia-southeast1"
}

variable "db_pw" {
  type    = string
  default = "4f5a6f94-e214-480d-8288-e19ecbc9b85a"
}

variable "hpc_client_id" {
  type    = string
  default = ""
}

variable "hpc_client_secret" {
  type    = string
  default = ""
}

variable "project_images" {
  type = map(object({
    id  = string,
    tag = string
  }))
  default = {}
}


variable "cwr_gcp_common_workspace" {
  type = string
}

variable "code_path" {
  type = string
}

variable "orderhandler_subscription_name" {
  type    = string
  default = ""
}
