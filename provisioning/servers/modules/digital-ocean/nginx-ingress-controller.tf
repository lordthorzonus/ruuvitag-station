data "helm_repository" "nginx_stable" {
  name = "nginx-stable"
  url = "https://helm.nginx.com/stable"
}

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
  chart = "nginx-ingress"
  name = "nginx-ingress-controller"
  repository = data.helm_repository.nginx_stable.metadata.0.name
  version = "0.3.8"

  set {
    name = "prometheus.create"
    value = "true"
  }
}

data "kubernetes_service" "nginx_ingress_controller" {
  depends_on = [helm_release.nginx_ingress_controller]

  metadata {
    name      = "${helm_release.nginx_ingress_controller.metadata[0].name}-nginx-ingress"
    namespace = helm_release.nginx_ingress_controller.metadata[0].namespace
  }
}

output "load_balancer_ip" {
  value = data.kubernetes_service.nginx_ingress_controller.load_balancer_ingress.0.ip
}