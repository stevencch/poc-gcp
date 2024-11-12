# Pub/Sub Topics and Subscriptions

module "random_string_pubsub" {
  source = "./modules/terraform/random_string"
  count  = 22
}

# Payment

/* Service account to access pub-sub Publisher role for service account publishing to topic payment_notifications_topic */

resource "google_service_account" "pmt_notifier_service_account" {
  account_id   = "pmt-notifier-sa"
  display_name = "Payment Notifier Service Account for payment-ms"
}

resource "google_service_account_key" "pmt_notifier_service_account_key" {
  service_account_id = google_service_account.pmt_notifier_service_account.name
}

module "payment_notifications_topic" {
  source                     = "./modules/gcp/pubsub_topic"
  name                       = "notifications"
  gcp_project_id             = var.gcp_project_id
  message_retention_duration = "604800s"
  is_payment_topic           = true
}

resource "google_pubsub_topic_iam_member" "payment_notifications_publisher" {
  project = var.gcp_project_id
  topic   = module.payment_notifications_topic.name
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.pmt_notifier_service_account.email}"
}

module "orderhandler_subscription" {
  source                = "./modules/gcp/pubsub_subscription"
  name                  = "orderhandler"
  topic                 = module.payment_notifications_topic.name
  endpoint              = "${module.myapp1_cloud_run_service.uri}/api/payment/order-handler"
  service_account_email = module.myapp1_cloud_run_service.google_service_account_email
  ack_deadline_seconds  = 600
}


module "core_deadletter_topic" {
  source                     = "./modules/gcp/pubsub_topic"
  name                       = "core"
  gcp_project_id             = var.gcp_project_id
  message_retention_duration = "604800s"
  is_deadletter_topic        = true
}


module "core_deadletter_subscription" {
  source                     = "./modules/gcp/pubsub_subscription"
  name                       = "deliveryoptions"
  topic                      = module.core_deadletter_topic.name
  endpoint                   = module.error_handler_cf.function_url
  service_account_email      = module.error_handler_cf.google_service_account_email
  ack_deadline_seconds       = 10
  is_deadletter_subscription = true
  filter                     = <<EOT
    attributes.CloudPubSubDeadLetterSourceSubscription = "orderhandler"
  EOT
}



