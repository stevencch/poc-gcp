terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.15.0"
    }


    vault = {
      source  = "hashicorp/vault"
      version = "4.2.0"
    }

  }

}

provider "google" {
  impersonate_service_account = "terraform-gcp@poc-gcp-439306.iam.gserviceaccount.com"
  project                     = var.gcp_project_id
  region                      = var.gcp_region
}

