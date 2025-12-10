resource "aws_vpc" "b4ckend_vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = "b4ckend-VPC"
  }
}

variable "vpc_cidr" {
  type        = string
  description = "VPC Address Group"
  default     = "10.0.0.0/16"
}
