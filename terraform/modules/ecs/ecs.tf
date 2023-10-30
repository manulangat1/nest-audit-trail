resource "aws_ecs_cluster" "audit-cluster" {

  name = "audit-cluster"

}

resource "aws_ecs_task_definition" "audit_task_definition" {
  container_definitions = jsonencode(
    [
      {
        name = "audit-container"

        image     = "186837223139.dkr.ecr.us-east-1.amazonaws.com/audit_trail_repo"
        cpu       = 256
        memory    = 512
        essential = true
        portMappings = [
          {
            containerPort = 3000
            hostPort      = 3000
          }
        ],
        # "log 
        "logConfiguration" : {
          "logDriver" : "awslogs",
          "options" : {
            "awslogs-group" : "/ecs/audit-app",
            "awslogs-region" : "us-east-1"
            "awslogs-stream-prefix" : "audit-app-log-stream"
          }
        }
      }
    ]
  )

  family                   = "app"
  requires_compatibilities = ["FARGATE"]

  cpu          = "256"
  memory       = "512"
  network_mode = "awsvpc"

  # execution_role_arn = aws_iam_role.ecs_execution_role.arn
  # task_role_arn      = aws_iam_role.ecs_task_role.arn

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_execution_role.arn
}

# resource "aws_launch_configuration" "ecs" {
#   name                        = "audit-cluster"
#   image_id                    = lookup(var.amis, var.region)
#   instance_type               = "FARGATE"
#   security_groups             = [aws_security_group.ecs.id]
#   iam_instance_profile        = aws_iam_instance_profile.ecs.name
#   key_name                    = aws_key_pair.production.key_name
#   associate_public_ip_address = true
#   user_data                   = "#!/bin/bash\necho ECS_CLUSTER='${var.ecs_cluster_name}-cluster' > /etc/ecs/ecs.config"
# }

resource "aws_ecs_service" "audits-service" {

  name    = "audit-services"
  cluster = aws_ecs_cluster.audit-cluster.arn



  launch_type = "FARGATE"

  enable_execute_command = true

  deployment_maximum_percent = 200

  deployment_minimum_healthy_percent = 100

  desired_count = 1

  task_definition = aws_ecs_task_definition.audit_task_definition.arn
  # iam_role        = aws_iam_role.ecs-service-role.arn

  network_configuration {
    assign_public_ip = true

    security_groups = [aws_security_group.sg.id]

    subnets = [aws_subnet.subnet-1.id, aws_subnet.subnet-2.id, aws_subnet.subnet-3.id]
  }


  load_balancer {
    target_group_arn = aws_alb_target_group.audit_target_group.arn

    container_name = "audit-container"
    container_port = 3000
  }
  depends_on = [aws_alb_listener.audit_listner, ]
}
