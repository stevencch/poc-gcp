resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

locals {
  resource_type_name = var.is_deadletter_subscription ? "psdlsubsc" : "pssubsc"
  subscription_name  = "ordrfmt-${local.resource_type_name}-global-${var.name}"
}

resource "google_pubsub_subscription" "subscription" {
  name  = var.add_suffix ? "${local.subscription_name}-${random_string.suffix.result}" : local.subscription_name
  topic = var.topic

  push_config {
    push_endpoint = var.endpoint
    oidc_token {
      service_account_email = var.service_account_email
    }
  }

  message_retention_duration = var.message_retention_duration
  ack_deadline_seconds       = var.ack_deadline_seconds
  retain_acked_messages      = var.retain_acked_messages

  retry_policy {
    minimum_backoff = var.retry_policy.minimum_backoff
    maximum_backoff = var.retry_policy.maximum_backoff
  }

  expiration_policy {
    ttl = ""
  }

  enable_message_ordering      = var.enable_message_order
  enable_exactly_once_delivery = var.enable_exactly_once_delivery
  filter                       = var.filter

  dynamic "dead_letter_policy" {
    for_each = var.dead_letter_policy != null ? ["this"] : []

    content {
      dead_letter_topic     = var.dead_letter_policy.dead_letter_topic
      max_delivery_attempts = var.dead_letter_policy.max_delivery_attempts
    }
  }
}
