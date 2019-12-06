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
}

module "route53" {
  source = "./modules/route53"
  cluster_sub_domain_ip = module.digital-ocean.load_balancer_ip
  cluster_sub_domain_name = var.cluster_sub_domain_name
  main_domain_name = var.main_domain_name
}

