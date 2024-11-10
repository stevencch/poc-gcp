variable "project" {
  type = string
}

variable "location" {
  type = string
}

variable "function_name" {
  type = string
}

variable "bucket_name" {
  type = string
}

variable "object_name" {
  type = string
}

variable "env_vars" {
  type        = map(string)
  default     = {}
  description = "Optional. Environment variables for the cloud function."
}


variable "max_instance_count" {
  type    = number
  default = 5
}

variable "max_instance_request_concurrency" {
  type    = number
  default = 1
}

variable "available_cpu" {
  type    = number
  default = null
}
