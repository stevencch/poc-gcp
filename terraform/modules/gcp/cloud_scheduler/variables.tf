variable "gcp_region" {
  type = string
}

variable "name" {
  type = string
}

variable "description" {
  type = string
}

variable "schedule" {
  type = string
}

variable "time_zone" {
  type = string
}

variable "http_target" {
  type = object({
    method                = string
    uri                   = string
    service_account_email = string
    body                  = optional(string)
    headers               = optional(map(string))
  })
  default = null
}

variable "pause_scheduler" {
  type    = bool
  default = false
}
