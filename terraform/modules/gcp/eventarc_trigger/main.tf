resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_project_iam_member" "trigger_sa_eventarc_eventReceiver" {
  project = var.gcp_project_id
  role    = "roles/eventarc.eventReceiver"
  member  = "serviceAccount:${var.service_account_email}"
}

resource "google_eventarc_trigger" "trigger" {
  project                 = var.gcp_project_id
  location                = var.gcp_region
  name                    = "comms-eatrigger-ause1-${var.name}-${random_string.suffix.result}"
  service_account         = var.service_account_email
  event_data_content_type = var.content_type

  matching_criteria {
    attribute = "type"
    value     = var.type
  }

  dynamic "matching_criteria" {
    for_each = var.additional_critera
    content {
      attribute = matching_criteria.value["attribute"]
      value     = matching_criteria.value["value"]
      operator  = matching_criteria.value["operator"]
    }
  }

  destination {
    workflow = var.destination.workflow

    dynamic "cloud_run_service" {
      for_each = var.destination.cloud_run_service != null ? [var.destination.cloud_run_service] : []
      content {
        region  = cloud_run_service.value.region
        service = cloud_run_service.value.service
        path    = cloud_run_service.value.path
      }
    }
  }
}
