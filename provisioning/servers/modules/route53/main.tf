data "aws_route53_zone" "main_domain" {
  name = var.main_domain_name
}

resource "aws_route53_record" "cluster_sub_domain_a_record" {
  zone_id = data.aws_route53_zone.main_domain.zone_id
  name    = var.cluster_sub_domain_name
  type    = "A"
  ttl     = "300"

  records = [var.cluster_sub_domain_ip]
}
