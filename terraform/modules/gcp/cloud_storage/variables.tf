variable "project" {
  type = string
}

variable "region_id" {
  type = string
}

variable "bucket_name" {
  description = "Bucket name without suffix."
  type        = string
}

variable "lifecycle_rules" {
  description = "Bucket lifecycle rule."
  type = map(object({
    action = object({
      type          = string
      storage_class = optional(string)
    })
    condition = object({
      age                        = optional(number)
      created_before             = optional(string)
      custom_time_before         = optional(string)
      days_since_custom_time     = optional(number)
      days_since_noncurrent_time = optional(number)
      matches_prefix             = optional(list(string))
      matches_storage_class      = optional(list(string))
      matches_suffix             = optional(list(string))
      noncurrent_time_before     = optional(string)
      num_newer_versions         = optional(number)
      with_state                 = optional(string)
    })
  }))
  default  = {}
  nullable = false
  validation {
    condition = alltrue([
      for k, v in var.lifecycle_rules : v.action != null && v.condition != null
    ])
    error_message = "Lifecycle rules action and condition cannot be null."
  }
  validation {
    condition = alltrue([
      for k, v in var.lifecycle_rules : contains(
        ["Delete", "SetStorageClass", "AbortIncompleteMultipartUpload"],
        v.action.type
      )
    ])
    error_message = "Lifecycle rules action type has unsupported value."
  }
  validation {
    condition = alltrue([
      for k, v in var.lifecycle_rules :
      v.action.type != "SetStorageClass"
      ||
      v.action.storage_class != null
    ])
    error_message = "Lifecycle rules with action type SetStorageClass require a storage class."
  }
}

variable "public_access_prevention" {
  description = "Prevents public access to a bucket."
  type        = string
  default     = null
}