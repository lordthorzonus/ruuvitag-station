resource "kubernetes_namespace" "flux" {
  metadata {
    name = "flux"
  }
}

data "helm_repository" "fluxcd" {
  name = "fluxcd"
  url = "https://charts.fluxcd.io"
}

locals {
  helm_release_crd_file = "https://raw.githubusercontent.com/fluxcd/flux/helm-0.10.1/deploy-helm/flux-helm-release-crd.yaml"
}

resource "null_resource" "flux_helm_operator_crd" {
  triggers = {
    crd_file = local.helm_release_crd_file
  }

  provisioner "local-exec" {
    command = "echo \"${local.k8s_cluster.ca_certificate}\" > ca-certificate.pem"
  }
  provisioner "local-exec" {
    command = "kubectl --token=${local.k8s_cluster.token} --server=${local.k8s_cluster.endpoint} apply -f ${local.helm_release_crd_file}"
  }
}

resource "helm_release" "flux" {
  depends_on = [helm_release.nginx_ingress_controller, null_resource.flux_helm_operator_crd]
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
