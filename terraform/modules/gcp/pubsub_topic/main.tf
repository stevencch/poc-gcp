resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

locals {
  resource_type_name   = var.is_deadletter_topic ? "psdltopic" : "pstopic"
  resource_domain_name = var.is_payment_topic == true ? "payment" : var.is_payment_topic == false ? "middleware" : "ordrfmt"
}

resource "google_pubsub_schema" "protobuf_schema" {
  count      = var.protobuf_schema != null ? 1 : 0
  name       = "ordrfmt-psschema-global-${var.protobuf_schema.name}-${substr(md5(var.protobuf_schema.definition), 0, 4)}-${random_string.suffix.result}"
  type       = "PROTOCOL_BUFFER"
  definition = var.protobuf_schema.definition
  project    = var.gcp_project_id
}

resource "google_pubsub_topic" "topic" {
  project                    = var.gcp_project_id
  name                       = "${local.resource_domain_name}-${local.resource_type_name}-global-${var.name}-${random_string.suffix.result}"
  message_retention_duration = var.message_retention_duration

  dynamic "schema_settings" {
    for_each = var.protobuf_schema != null ? ["this"] : []
    content {
      schema   = google_pubsub_schema.protobuf_schema[0].id
      encoding = var.protobuf_schema.encoding
    }
  }

  dynamic "schema_settings" {
    for_each = var.existing_protobuf_schema != null ? ["this"] : []
    content {
      schema   = var.existing_protobuf_schema.schema_id
      encoding = var.existing_protobuf_schema.encoding
    }
  }
}
