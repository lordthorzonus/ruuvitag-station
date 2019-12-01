terraform {
  backend "s3" {
    region = "eu-north-1"
    encrypt = true
  }
}

provider "aws" {
  region = "eu-north-1"
}

module "digital-ocean" {
  source = "./modules/digital-ocean"
  do_token = var.do_token
  grafana_domain_name = var.grafana_domain_name
}

module "route53" {
  source = "./modules/route53"
  grafana_domain_ip = module.digital-ocean.load_balancer_ip
  grafana_domain_name = var.grafana_domain_name
  rabbitmq_domain_ip = module.digital-ocean.load_balancer_ip
  rabbitmq_domain_name = var.rabbitmq_domain_name
}

