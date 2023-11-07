pipeline { 
    agent any 

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
        }
    steps { 
        
        script {
           
            echo "${ACCESS_KEY} - ${SECRET_KEY}"
            dir("terraform") { 
                            sh "terraform init"
            sh "terraform apply --auto-approve --var accessKey=ACCESS_KEY --var secretKey=SECRET_KEY"
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