resource "kubernetes_namespace" "flux" {
  metadata {
    name = "flux"
  }
}

data "helm_repository" "fluxcd" {
  name = "fluxcd"
  url = "https://charts.fluxcd.io"
}

resource "null_resource" "flux_helm_operator_crd" {
  provisioner "local-exec" {
    command = "kubectl --token=${local.k8s_cluster.token} --server=${local.k8s_cluster.endpoint} apply -f https://raw.githubusercontent.com/fluxcd/helm-operator/master/deploy/flux-helm-release-crd.yaml"
  }
}

resource "helm_release" "flux" {
  depends_on = [helm_release.nginx_ingress_controller]
  chart = "fluxcd/flux"
  name = "flux"
  namespace = kubernetes_namespace.flux.metadata.0.name
  repository = data.helm_repository.fluxcd.name

  set {
    name = "git.url"
    value = var.github_kubernetes_manifests_repository
  }

  set {
    name = "helmOperator.create"
    value = "true"
  }

  set {
    name = "prometheus.enabled"
    value = "true"
  }
}
