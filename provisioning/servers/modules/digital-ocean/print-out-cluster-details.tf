resource "null_resource" "print_cluster_details_to_local_file_system" {
  provisioner "local-exec" {
    command = "echo \"--- \n ${jsonencode(local.k8s_cluster)} \n\" >> cluster-details"
  }

  provisioner "local-exec" {
    command = "echo \"--- \n ${local.load_balancer_ip} \n \" >> cluster-details"
  }
}
