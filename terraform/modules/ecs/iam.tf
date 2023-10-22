resource "aws_iam_role" "ecs-host-role" {
  name               = "ecs_host_role_prod"
  assume_role_policy = file("policies/ecs-role.json")
}

resource "aws_iam_role_policy" "ecs-instance-role-policy" {
  name   = "ecs_instance_role_policy"
  policy = file("policies/ecs-instance-role-policy.json")
  role   = aws_iam_role.ecs-host-role.id
}

resource "aws_iam_role" "ecs-service-role" {
  name               = "ecs_service_role_prod"
  assume_role_policy = file("policies/ecs-role.json")
}

resource "aws_iam_role_policy" "ecs-service-role-policy" {
  name   = "ecs_service_role_policy"
  policy = file("policies/ecs-service-role-policy.json")
  role   = aws_iam_role.ecs-service-role.id
}

resource "aws_iam_instance_profile" "ecs" {
  name = "ecs_instance_profile_prod"
  path = "/"
  role = aws_iam_role.ecs-host-role.name
}

resource "aws_iam_role" "ecs_task_role" {
  name = "ecs_task_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs.amazonaws.com"
        }
      }
    ]
  })
}

# Attach policies to the roles
resource "aws_iam_policy_attachment" "ecs_task_role_policy" {
  name       = "ecs_task_role_policy"
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess" # Adjust the policy as needed
  roles      = [aws_iam_role.ecs_task_role.name]
}

resource "aws_iam_policy_attachment" "ecs_execution_role_policy" {
  name       = "ecs_execution_role_policy"
  policy_arn = "arn:aws:iam::aws:policy/AmazonECS_FullAccess" # Adjust the policy as needed
  roles      = [aws_iam_role.ecs_execution_role.name]
}

