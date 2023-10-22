











resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.dev-vpc.id
}

resource "aws_route_table" "route-table" {

  vpc_id = aws_vpc.dev-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.igw.id
  }

}
resource "aws_route_table_association" "route-1" {

  route_table_id = aws_route_table.route-table.id

  subnet_id = aws_subnet.subnet-1.id

}

resource "aws_route_table_association" "route-2" {

  route_table_id = aws_route_table.route-table.id

  subnet_id = aws_subnet.subnet-2.id

}

resource "aws_route_table_association" "route-3" {

  route_table_id = aws_route_table.route-table.id

  subnet_id = aws_subnet.subnet-3.id

}


resource "aws_eip" "eip" {

  # vpc                       = true
  associate_with_private_ip = "10.0.0.5"
  depends_on                = [aws_internet_gateway.igw]

}


# resource "aws_nat_gateway" "nat-gw" {
#   allocation_id = aws_eip.elastic-ip-for-nat-gw.id
#   subnet_id     = aws_subnet.public-subnet-1.id
#   depends_on    = [aws_eip.elastic-ip-for-nat-gw]
# }
# resource "aws_route" "nat-gw-route" {
#   route_table_id         = aws_route_table.private-route-table.id
#   nat_gateway_id         = aws_nat_gateway.nat-gw.id
#   destination_cidr_block = "0.0.0.0/0"
# }

resource "aws_security_group" "ecs_sg" {


  name        = "ecs_sg"
  description = "Allow inbound access from the ALB only"

  vpc_id = aws_vpc.dev-vpc.id
  # ingress {

  # }
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.sg.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_lb" "audit-lb" {

  name = "Audit-LB"

  load_balancer_type = "application"

  internal = false

  security_groups = [aws_security_group.sg.id]

  subnets = [aws_subnet.subnet-1.id, aws_subnet.subnet-3.id]

}


resource "aws_alb_target_group" "audit_target_group" {

  name = "audit-target-group"

  port = 3000

  protocol = "HTTP"

  vpc_id = aws_vpc.dev-vpc.id

  health_check {
    path                = "/api/healthcheck"
    port                = "traffic-port"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 2
    interval            = 5
    matcher             = "200"
  }
}

resource "aws_alb_listener" "audit_listner" {

  load_balancer_arn = aws_lb.audit-lb.arn

  port     = 3000
  protocol = "HTTP"

  depends_on = [aws_alb_target_group.audit_target_group]

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.audit_target_group.arn
  }

}
