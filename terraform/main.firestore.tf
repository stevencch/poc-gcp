# module "firestore" {
#   source      = "./modules/gcp/firestore"
#   project     = var.gcp_project_id
#   location_id = var.gcp_region
#   name        = "catalogue-fsdb-ause1-core"

#   index_exemption_fields = {
#     "outbox" = ["event_body"]
#   }
# }

# resource "google_firestore_field" "firestore_outbox_expire_at" {
#   project    = var.gcp_project_id
#   database   = module.firestore.name
#   collection = "outbox"
#   field      = "expire_at"
#   ttl_config {}
#   index_config {}
# }


# resource "google_firebaserules_ruleset" "firestore" {
#   project = var.gcp_project_id

#   source {
#     files {
#       name    = "firestore.rules"
#       content = <<EOF
#       service cloud.firestore {
#         match /databases/{database}/documents {
#           match /{document=**} {
#             allow read, write: if true;
#           }
#         }
#       }
#       EOF
#     }
#   }
# }


# resource "google_firebaserules_release" "primary" {
#   name         = "cloud.firestore/database"
#   ruleset_name = "projects/${var.gcp_project_id}/rulesets/${google_firebaserules_ruleset.firestore.name}"
#   project      = var.gcp_project_id

#   lifecycle {
#     replace_triggered_by = [
#       google_firebaserules_ruleset.firestore
#     ]
#   }
# }
