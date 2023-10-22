resource "aws_cloudwatch_log_group" "audit_logs_group" {

  name = "/ecs/audit-app"

  retention_in_days = 30


}

resource "aws_cloudwatch_log_stream" "audit_log_streams" {

  name = "audit-app-log-stream"

  log_group_name = aws_cloudwatch_log_group.audit_logs_group.name
}
