resource "aws_route53_zone" "grafana" {
  name = var.grafana_domain_name
}

resource "aws_route53_record" "grafana-a-record" {
  zone_id = aws_route53_zone.grafana.zone_id
  name    = var.grafana_domain_name
  type    = "A"
  ttl     = "300"

  records = [var.grafana_domain_ip]
}

resource "aws_route53_zone" "rabbitmq" {
  name = var.rabbitmq_domain_name
}

resource "aws_route53_record" "rabbitmq-a-record" {
  zone_id = aws_route53_zone.rabbitmq.zone_id
  name    = var.rabbitmq_domain_name
  type    = "A"
  ttl     = "300"

  records = [var.rabbitmq_domain_ip]
}