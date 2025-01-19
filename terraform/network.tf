/**
 * Copyright 2018 Google LLC
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

resource "random_string" "suffix" {
  length  = 4
  special = "false"
  upper   = "false"
}

resource "google_compute_network" "vpc-3" {
  project                 = var.gcp_project_id
  name                    = "cft-vm-vpc-3"
  auto_create_subnetworks = "false"
}

resource "google_compute_subnetwork" "vpc-3-app" {
  project       = var.gcp_project_id
  region        = "us-east1"
  name          = "cft-vm-vpc-3-app"
  ip_cidr_range = "10.0.3.0/24"
  network       = google_compute_network.vpc-3.self_link
}


resource "google_compute_network" "vpc-4" {
  project                 = var.gcp_project_id
  name                    = "cft-vm-vpc-4"
  auto_create_subnetworks = "false"
}

resource "google_compute_subnetwork" "vpc-4-app" {
  project       = var.gcp_project_id
  region        = "us-east1"
  name          = "cft-vm-vpc-4-app"
  ip_cidr_range = "10.0.4.0/24"
  network       = google_compute_network.vpc-4.self_link
}


module "peering2" {
  source        = "terraform-google-modules/network/google//modules/network-peering"
  version       = "~> 10.0"
  local_network = google_compute_network.vpc-3.self_link
  peer_network  = google_compute_network.vpc-4.self_link # Replace with self link to VPC network "other" in quotes
}