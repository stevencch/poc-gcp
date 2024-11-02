module "firestore" {
  source      = "./modules/gcp/firestore"
  project     = var.gcp_project_id
  location_id = var.gcp_region
  name        = "catalogue-fsdb-ause1-core"

  index_exemption_fields = {
    "outbox" = ["event_body", "created"]
  }
}

resource "google_firestore_field" "firestore_outbox_expire_at" {
  project    = var.gcp_project_id
  database   = module.firestore.name
  collection = "outbox"
  field      = "expire_at"
  ttl_config {}
  index_config {}
}


# Define the security ruleset for Firestore
resource "google_firebaserules_ruleset" "firestore" {
  project = var.gcp_project_id
  source {
    files {
      content = "service cloud.firestore {match /databases/{database}/documents { match /{document=**} { allow read, write: if true; } } }"
      name    = "firestore.rules"
    }
  }
}

