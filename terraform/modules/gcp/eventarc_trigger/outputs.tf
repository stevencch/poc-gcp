output "transport_subscription_id" {
  value = google_eventarc_trigger.trigger.transport[0].pubsub[0].subscription
}

output "transport_subscription_name" {
  value = split("/subscriptions/", google_eventarc_trigger.trigger.transport[0].pubsub[0].subscription)[1]
}
