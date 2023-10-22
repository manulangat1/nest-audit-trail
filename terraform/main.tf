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

module "audit_ecs" {
  source = "./modules/ecs"

}

output "ecr_repo" {

  value = module.audit_ecs.arn-lb

}

