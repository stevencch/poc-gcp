data "tfe_outputs" "common" {
  organization = "cwretail"
  workspace    = var.cwr_gcp_common_workspace
}
