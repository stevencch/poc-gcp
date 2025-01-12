resource "google_monitoring_alert_policy" "alert_policy" {
  display_name = var.display_name
  project      = var.gcp_project_id
  severity     = var.severity
  combiner     = "OR"

  conditions {
    display_name = "Condition 1"

    dynamic "condition_threshold" {
      for_each = var.condition.threshold != null ? [true] : []
      content {
        filter          = var.condition.threshold.filter
        comparison      = var.condition.threshold.comparison_type
        threshold_value = var.condition.threshold.threshold_value
        duration        = var.condition.retest_period

        aggregations {
          alignment_period     = var.condition.threshold.alignment_period
          per_series_aligner   = var.condition.threshold.per_series_aligner
          cross_series_reducer = var.condition.threshold.cross_series_reducer
        }
      }
    }

    dynamic "condition_monitoring_query_language" {
      for_each = var.condition.mql_query != null ? [true] : []
      content {
        query    = var.condition.mql_query
        duration = var.condition.retest_period
      }
    }
  }

  documentation {
    mime_type = "text/markdown"
    subject   = var.notification_subject != "" ? var.notification_subject : "#${var.display_name} alert triggered"
    content   = var.notification_content != "" ? var.notification_content : <<EOT
      ${var.display_name} alert triggered on the $${resource.type} $${resource.labels.revision_name} in $${resource.project}.
      The threshold has been exceeded for over ${var.condition.retest_period}.
    EOT
  }

  notification_channels = var.notification_channels

  user_labels = {
    severity = lower(var.severity)
  }
}
