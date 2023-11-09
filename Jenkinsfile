pipeline { 
    agent any 
    environment {
                    AWS_ACCESS_KEY_ID = credentials( 'AWS_ACCESS_KEY')
            AWS_SECRET_ACCESS_KEY = credentials( 'AWS_ACCESS_KEY')
    }
    stages { 
        stage("Git checkout") { 
            steps { 
                echo "Hello world"
            }
        }
        stage("Clean docker images before"){
            steps{ 
                echo "deleting in branch ${env.BRANCH_NAME} and build number ${env.BUILD_NUMBER}"
                sh "docker system prune -a -f --volumes"
            }
        }
        stage("Get current version") { 
    steps { 
        script {
            def packageJson = readJSON file: 'package.json'
            def packageVersion = packageJson.version 
            echo "${packageVersion}"
            env.IMAGE_TAG = "${packageVersion}-${BUILD_NUMBER}"
        }
    }
}

stage("Provinsion ecs cluster") {
    environment { 
            ACCESS_KEY = credentials( 'AWS_ACCESS_KEY')
            SECRET_KEY = credentials( 'AWS_ACCESS_KEY')
            TF_VAR_access_key= "${ACCESS_KEY}"
            TF_VAR_secret_key= "${SECRET_KEY}"
            TF_VAR_accessKey= "${ACCESS_KEY}"
            TF_VAR_secretKey= "${SECRET_KEY}"
        }
    steps { 
        
        script {
           
            echo "${ACCESS_KEY} - ${SECRET_KEY}"
            dir("terraform") { 
                // withCredentails ( { })
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding', 
                    credentialsId: "aws_credentials", 
                    accessKeyVariable:"AWS_ACCESS_KEY_ID" , 
                    secretKeyVariable:"AWS_SECRET_KEY"
                ]]) {
                    sh "terraform init -var access_key=${ACCESS_KEY}  -var secret_key=${SECRET_KEY}"
                                
                }
                
                            // sh "terraform init --var access_key=${ACCESS_KEY} --var secret_key=${SECRET_KEY}"
            // sh "terraform apply --auto-approve --var access_key=${ACCESS_KEY} --var secret_key=${SECRET_KEY}"
            // ECR_URL = sh(
            //     script: "terraform output ecr_repo" , 
            //     returnStdOut: true
            // ).trim()
            // echo "ECR_URL"
            }

        }
    }
}
        stage("Build docker image") { 
            steps { 
                sh " docker build . -t audit-image"
                sh " docker tag audit-image:latest audit-image:${IMAGE_TAG}"
                sh "docker images"
            }
        }
        stage("Clean docker images"){
            steps{ 
                echo "deleting in branch ${env.BRANCH_NAME} and build number ${env.BUILD_NUMBER}"
                sh "docker system prune -a -f --volumes"
            }
        }
     }
}