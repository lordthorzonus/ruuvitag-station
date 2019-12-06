provider "digitalocean" {
  token = var.do_token
}

provider "helm" {
  service_account = "tiller"
  kubernetes {
    cluster_ca_certificate = local.k8s_cluster.ca_certificate
    token = local.k8s_cluster.token
    host = local .k8s_cluster.endpoint
    load_config_file = false
  }
}

provider "kubernetes" {
  host = local.k8s_cluster.endpoint
  token = local.k8s_cluster.token
  cluster_ca_certificate = local.k8s_cluster.ca_certificate
  load_config_file = false
}
