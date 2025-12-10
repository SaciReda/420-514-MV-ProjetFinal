variable "ami_id" {
  type        = string
  description = "Amazon Machine Image Id of EC2 Instance"
  default     = "ami-0ecb62995f68bb549"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance Type"
  default     = "t3.micro"
}

resource "aws_instance" "b4ckend_immo_ec2" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.b4ckend_public_subnet.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.b4ckend_sg.id]
  key_name                    = aws_key_pair.projet_immo_key.key_name

  root_block_device {
    volume_size = 32
    volume_type = "gp3"
  }

  tags = {
    Name        = "b4ckend-EC2"
    volume_size = 64
  }

  user_data = file("${path.module}/user-data.sh")
}

output "b4ckend_immo_ec2_public_ip" {
  description = "Public IP of b4ckend EC2 Instance"
  value       = try(aws_instance.b4ckend_immo_ec2.public_ip, "")
}
