output "arn-lb" {
  value = aws_ecr_repository.repo.repository_url
}
