variable "do_token" {}
variable "k8s_node_count" {
  default = 2
}
variable "do_admin_ssh_key" {
  default = "admin_key"
}

variable "k8s_node_size" {
  default = "s-1vcpu-2gb"
}

variable "k8s_cluster_region" {
  default = "fra1"
}

variable "k8s_version" {
  default = "1.16.2-do.0"
}

variable "github_kubernetes_manifests_repository" {
  default = "git@github.com:lordthorzonus/ruuvitag-station-k8s.git"
}
