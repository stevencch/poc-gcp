variable "gcp_project_id" {
  type = string
}

variable "gcp_region" {
  type = string
}

variable "name" {
  type = string
}

variable "max_dispatches_per_second" {
  type    = number
  default = null
}

variable "max_concurrent_dispatches" {
  type    = number
  default = null
}

variable "max_attempts" {
  type    = number
  default = null
}

variable "max_retry_duration" {
  type    = string
  default = null
}

variable "min_backoff" {
  type    = string
  default = null
}

variable "max_backoff" {
  type    = string
  default = null
}

variable "max_doublings" {
  type    = number
  default = null
}