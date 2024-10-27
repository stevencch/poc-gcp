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

variable "gcp_mssql_pw" {
  type    = string
  default = "4f5a6f94-e214-480d-8288-e19ecbc9b85a"
}

variable "project_images" {
  type = map(object({
    id  = string,
    tag = string
  }))
  default = {}
}