variable "project" {
  type = string
}

variable "location_id" {
  type = string
}

variable "name" {
  type = string
}

variable "index_exemption_fields" {
  type        = map(list(string))
  default     = {}
  description = "Optional. Fields in the database that are exempted from indexing"
}
