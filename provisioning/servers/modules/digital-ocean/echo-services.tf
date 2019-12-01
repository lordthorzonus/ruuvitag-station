resource "kubernetes_deployment" "echo1_deployment" {
  metadata {
    name = "echo1"
  }
  spec {
    selector {
      match_labels = {
        app = "echo1"
      }
    }
    template {
      metadata {
        labels = {
          app = "echo1"
        }
      }
      spec {
        container {
          name = "echo1"
          image = "hashicorp/http-echo"
          args = ["-text=echo2"]
          port {
            container_port = 5678
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "echo1_service" {
  metadata {
    name = "echo1"
  }
  spec {
    port {
      port = 80
      target_port = 5678
    }
    selector = {
      app = "echo1"
    }
  }
}

resource "kubernetes_ingress" "echo1_ingress" {
  metadata {
    name = "echo-ingress"
  }
  spec {
    rule {
      host = var.grafana_domain_name
      http {
        path {
          backend {
            service_name = "echo1"
            service_port = 80
          }
        }
      }
    }
  }
}
