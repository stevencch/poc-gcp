variable "gcp_project_id" {
  type = string
}

variable "display_name" {
  type = string
}

variable "severity" {
  type = string

  validation {
    condition     = contains(["CRITICAL", "ERROR", "WARNING"], var.severity)
    error_message = "Possible values are: CRITICAL, ERROR, WARNING."
  }
}

variable "condition" {
  type = object({
    threshold = optional(object({
      filter               = string
      comparison_type      = string
      threshold_value      = number
      alignment_period     = string
      per_series_aligner   = string
      cross_series_reducer = optional(string, "REDUCE_NONE")
    }))
    mql_query     = optional(string)
    retest_period = string
  })

  validation {
    condition     = (var.condition.threshold == null && var.condition.mql_query != null) || (var.condition.threshold != null && var.condition.mql_query == null)
    error_message = "Either threshold or mql_query must be specified"
  }

  validation {
    condition     = var.condition.threshold == null ? true : contains(["COMPARISON_LT", "COMPARISON_GT"], var.condition.threshold.comparison_type)
    error_message = "Only COMPARISON_LT and COMPARISON_GT are supported currently."
  }
}

variable "notification_channels" {
  type = list(string)
}

variable "notification_subject" {
  type    = string
  default = ""
}

variable "notification_content" {
  type    = string
  default = ""
}
