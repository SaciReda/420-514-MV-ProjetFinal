resource "aws_internet_gateway" "b4ckend_internet_gw" {
  vpc_id = aws_vpc.b4ckend_vpc.id

  tags = {
    Name = "b4ckend-INTERNET-GW"
  }
}
