resource "kubernetes_service_account" "tiller_service_account" {
  metadata {
    name = "tiller"
    namespace = "kube-system"
  }
}

resource "kubernetes_cluster_role_binding" "tiller_cluster_role_binding" {
  depends_on = [kubernetes_service_account.tiller_service_account]
  metadata {
    name = "tiller"
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind = "ClusterRole"
    name = "cluster-admin"
  }
  subject {
    kind = "ServiceAccount"
    name = "tiller"
    namespace = "kube-system"
  }
}

resource "helm_release" "nginx_ingress_controller" {
  depends_on = [kubernetes_cluster_role_binding.tiller_cluster_role_binding]
  name = "ingress"
  chart = "stable/nginx-ingress"

  set {
    name = "controller.metrics.enabled"
    value = "true"
  }

  set {
    name = "controller.metrics.enabled"
    value = "true"
  }

  set {
    name = "controller.metrics.serviceMonitor.enabled"
    value = "true"
  }


}

data "kubernetes_service" "nginx_ingress_controller" {
  depends_on = [helm_release.nginx_ingress_controller]

  metadata {
    name = "${helm_release.nginx_ingress_controller.metadata[0].name}-nginx-ingress-controller"
    namespace = helm_release.nginx_ingress_controller.metadata[0].namespace
  }
}

locals {
  load_balancer_ip = data.kubernetes_service.nginx_ingress_controller.load_balancer_ingress.0.ip
}

output "load_balancer_ip" {
  value = local.load_balancer_ip
}