terraform {
  backend "s3" {
    bucket = "blog-cms-test"
    key    = "audit-blog/terraform.tfstate"

    region = "us-east-1"

  }
}

provider "aws" {
  # access_key = ""
  # secret_key = " "
  region = "us-east-1"

}

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

resource "aws_security_group" "sg" {

  name = "sg"

  vpc_id = aws_vpc.dev-vpc.id


  ingress {
    description = "https"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {
    description = "https"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {
    description = "http"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  egress {
    # description = "https"
    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = ["0.0.0.0/0"]

  }


}

resource "aws_ecr_repository" "repo" {

  name = "audit_trail_repo"

  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

}


resource "aws_ecs_cluster" "audit-cluster" {

  name = "audit-cluster"

}

resource "aws_ecs_service" "audits-service" {

  name    = "audit-services"
  cluster = aws_ecs_cluster.audit-cluster.arn

  launch_type = "FARGATE"

  enable_execute_command = true

  deployment_maximum_percent = 200

  deployment_minimum_healthy_percent = 100

  desired_count = 1

  task_definition = aws_ecs_task_definition.audit_task_definition.id

  network_configuration {
    assign_public_ip = true

    security_groups = [aws_security_group.sg.id]

    subnets = [aws_subnet.subnet-1.id, aws_subnet.subnet-2.id, aws_subnet.subnet-3.id]
  }

}


resource "aws_ecs_task_definition" "audit_task_definition" {

  container_definitions = jsonencode(
    [
      {
        name = "app"

        image     = "186837223139.dkr.ecr.us-east-1.amazonaws.com/audit_trail_repo"
        cpu       = 256
        memory    = 512
        essential = true
        portMappings = [
          {
            containerPort = 80
            hostPort      = 80
          }
        ]
      }
    ]
  )

  family                   = "app"
  requires_compatibilities = ["FARGATE"]

  cpu          = "256"
  memory       = "512"
  network_mode = "awsvpc"

  task_role_arn      = "arn:aws:iam::186837223139:role/task_execution_1"
  execution_role_arn = "arn:aws:iam::186837223139:role/task_execution_1"

}
