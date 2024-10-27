variable "gcp_project_id" {
  type = string
}

variable "name" {
  type = string
}

variable "message_retention_duration" {
  type    = string
  default = "null"
}

variable "protobuf_schema" {
  type = object({
    name       = string
    definition = string
    encoding   = string
  })
  default = null
}

variable "existing_protobuf_schema" {
  type = object({
    schema_id = string
    encoding  = string
  })
  default = null
}

variable "is_deadletter_topic" {
  type    = bool
  default = false
}

variable "is_payment_topic" {
  type    = bool
  default = null
}