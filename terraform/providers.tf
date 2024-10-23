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

  cloud {

    organization = "example-org-3dd56e"

    workspaces {
      name = "demo-app-sa1-dev"
    }
  }

}

provider "google" {
  project                     = var.gcp_project_id
  region                      = var.gcp_region
}


