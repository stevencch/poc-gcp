# /**
#  * Copyright 2019 Google LLC
#  *
#  * Licensed under the Apache License, Version 2.0 (the "License");
#  * you may not use this file except in compliance with the License.
#  * You may obtain a copy of the License at
#  *
#  *      http://www.apache.org/licenses/LICENSE-2.0
#  *
#  * Unless required by applicable law or agreed to in writing, software
#  * distributed under the License is distributed on an "AS IS" BASIS,
#  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  * See the License for the specific language governing permissions and
#  * limitations under the License.
#  */
# locals {
#   network_01_name = "multi-vpc-a1-01"
#   network_02_name = "multi-vpc-a1-02"
# }

# module "network_example" {
#   source          = "./modules/multi_vpc"
#   project_id      = var.gcp_project_id
#   network_01_name = local.network_01_name
#   network_02_name = local.network_02_name
# }


# module "peering1" {
#   source        = "terraform-google-modules/network/google//modules/network-peering"
#   version       = "~> 10.0"
#   local_network = module.network_example.network_01_self_link
#   peer_network  = module.network_example.network_02_self_link # Replace with self link to VPC network "other" in quotes
# }
