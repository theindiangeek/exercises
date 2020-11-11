provider "digitalocean" {
  token = var.token
}

resource "digitalocean_kubernetes_cluster" "test" {
  name   = var.clustername
  region = var.region
  # Grab the latest version slug from `doctl kubernetes options versions`
  #version = "1.19.3-do.2"
  version = var.k8sversion

  node_pool {
    name       = "worker-pool"
    #size       = "s-2vcpu-2gb"
    size       = var.size
    node_count = var.nodecount
  }
}

variable "token" {}
variable "clustername" {}
variable "region" {}
variable "k8sversion" {}
variable "size" {} 
variable "nodecount" {}
