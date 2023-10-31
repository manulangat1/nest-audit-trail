pipeline { 
    agent any 

    stages { 
        stage("Git checkout") { 
            steps { 
                echo "Hello world"
            }
        }
        stage("Get current version") { 
            steps { 
                script {
                                def packageJson = readJson file: 'package.json'
                def packageVersion = packageJson.version 
                echo "packageVersion"
                }
    
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