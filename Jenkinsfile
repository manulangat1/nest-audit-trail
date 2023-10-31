pipeline { 
    agent any 

    stages { 
        stage("Git checkout") { 
            steps { 
                echo "Hello world"
            }
        }
        stage("Build docker image") { 
            steps { 
                sh " docker build . -t audit-image"
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