/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

# [START vpc_firewall_create]
resource "google_compute_firewall" "rules80" {
  project     = var.project_id # Replace this with your project ID in quotes
  name        = "${var.name}web"
  network     = var.network
  description = "Creates firewall rule targeting tagged instances"

  allow {
    protocol = "tcp"
    ports    = ["80", "8080", "1000-2000"]
  }
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "rules22" {
  project     = var.project_id # Replace this with your project ID in quotes
  name        = "${var.name}ssh"
  network     = var.network
  description = "Creates firewall rule targeting tagged instances"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = ["35.235.240.0/20"]
}
# [END vpc_firewall_create]
