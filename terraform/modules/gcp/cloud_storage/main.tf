resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_storage_bucket" "bucket" {
  name                     = "${var.bucket_name}-${random_string.suffix.result}"
  location                 = var.region_id
  project                  = var.project
  public_access_prevention = var.public_access_prevention

  dynamic "lifecycle_rule" {
    for_each = var.lifecycle_rules
    iterator = rule
    content {
      action {
        type          = rule.value.action.type
        storage_class = rule.value.action.storage_class
      }
      condition {
        age                        = rule.value.condition.age
        created_before             = rule.value.condition.created_before
        custom_time_before         = rule.value.condition.custom_time_before
        days_since_custom_time     = rule.value.condition.days_since_custom_time
        days_since_noncurrent_time = rule.value.condition.days_since_noncurrent_time
        matches_prefix             = rule.value.condition.matches_prefix
        matches_storage_class      = rule.value.condition.matches_storage_class
        matches_suffix             = rule.value.condition.matches_suffix
        noncurrent_time_before     = rule.value.condition.noncurrent_time_before
        num_newer_versions         = rule.value.condition.num_newer_versions
        with_state                 = rule.value.condition.with_state
      }
    }
  }
}
