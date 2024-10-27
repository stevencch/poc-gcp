variable "name" {
  type = string
}

variable "topic" {
  type = string
}

variable "endpoint" {
  type = string
}

variable "service_account_email" {
  type = string
}

variable "ack_deadline_seconds" {
  type    = number
  default = 10
}

variable "message_retention_duration" {
  type    = string
  default = "604800s"
}

variable "retry_policy" {
  type = object({
    minimum_backoff = string
    maximum_backoff = string
  })
  default = {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}

variable "retain_acked_messages" {
  type    = bool
  default = false
}

variable "enable_message_order" {
  type    = bool
  default = false
}

variable "enable_exactly_once_delivery" {
  type    = bool
  default = false
}

variable "filter" {
  type     = string
  nullable = true
  default  = null
}

variable "gcp_project_id" {
  type    = string
  default = null
}

variable "is_deadletter_subscription" {
  type    = bool
  default = false
}

variable "dead_letter_policy" {
  type = object({
    dead_letter_topic     = string
    max_delivery_attempts = number
  })
  default = null
}

variable "add_suffix" {
  type    = bool
  default = true
}