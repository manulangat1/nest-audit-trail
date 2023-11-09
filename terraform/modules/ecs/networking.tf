resource "aws_vpc" "dev-vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    "Name" : "dev-vpc"
  }
  enable_dns_hostnames = true
}


resource "aws_subnet" "subnet-1" {

  cidr_block        = "10.0.1.0/24"
  vpc_id            = aws_vpc.dev-vpc.id
  availability_zone = "us-east-1a"

  map_public_ip_on_launch = true

}

resource "aws_subnet" "subnet-2" {

  cidr_block        = "10.0.2.0/24"
  vpc_id            = aws_vpc.dev-vpc.id
  availability_zone = "us-east-1b"

  map_public_ip_on_launch = true


}

resource "aws_subnet" "subnet-3" {

  cidr_block        = "10.0.3.0/24"
  vpc_id            = aws_vpc.dev-vpc.id
  availability_zone = "us-east-1c"

  map_public_ip_on_launch = true

}
