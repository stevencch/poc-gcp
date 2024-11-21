resource "google_bigquery_dataset" "dataset" {
  dataset_id                  = var.dataset_name
  friendly_name               = "test"
  description                 = "This is a test description"
  location                    = var.location
  default_table_expiration_ms = 3600000

  labels = {
    env = "default"
  }

  access {
    role          = "OWNER"
    user_by_email = var.account
  }

}

resource "google_bigquery_table" "default" {
  dataset_id = google_bigquery_dataset.dataset.dataset_id
  table_id   = var.table_name

  time_partitioning {
    type = "DAY"
  }

  labels = {
    env = "default"
  }

  schema = <<EOF
[
  {
    "name": "firstName",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "The firstName"
  },
  {
    "name": "lastName",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "The lastName"
  }
]
EOF

}

