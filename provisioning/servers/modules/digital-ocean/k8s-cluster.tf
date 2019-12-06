data "digitalocean_ssh_key" "k8s_admin_ssh_key" {
  name = var.do_admin_ssh_key
}

resource "digitalocean_kubernetes_cluster" "k8s_cluster" {
  name = "home-cluster"
  region = var.k8s_cluster_region
  version = var.k8s_version

  node_pool {
    name = "worker-pool"
    node_count = var.k8s_node_count
    size = var.k8s_node_size
  }
}

locals {
  k8s_cluster = {
    master_ip_address = digitalocean_kubernetes_cluster.k8s_cluster.ipv4_address
    cluster_subnet = digitalocean_kubernetes_cluster.k8s_cluster.cluster_subnet
    service_subnet = digitalocean_kubernetes_cluster.k8s_cluster.service_subnet
    endpoint = digitalocean_kubernetes_cluster.k8s_cluster.endpoint
    token = digitalocean_kubernetes_cluster.k8s_cluster.kube_config.0.token
    ca_certificate = base64decode(digitalocean_kubernetes_cluster.k8s_cluster.kube_config.0.cluster_ca_certificate)
    kube_config = digitalocean_kubernetes_cluster.k8s_cluster.kube_config
  }
}

output "k8s_cluster" {
  value = local.k8s_cluster
}
