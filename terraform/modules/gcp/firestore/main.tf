resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "google_firestore_database" "database" {
  project     = var.project
  name        = "${var.name}-${random_string.suffix.result}"
  location_id = var.location_id
  type        = "FIRESTORE_NATIVE"
}

resource "google_firestore_field" "index_exemption" {
  for_each = { for idx, item in flatten([
    for collection, fields in var.index_exemption_fields : [
      for field in fields : {
        collection = collection
        field      = field
      }
    ]
  ]) : "${item.collection}-${item.field}" => item }

  project    = var.project
  database   = google_firestore_database.database.name
  collection = each.value.collection
  field      = each.value.field

  // Disable all indexes for the field.
  index_config {}
}


