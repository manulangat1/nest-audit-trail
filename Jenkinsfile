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
            def packageJson = readJSON file: 'package.json'
            def packageVersion = packageJson.version 
            echo "${packageVersion}"
            env.IMAGE_TAG = "${packageVersion}-${BUILD_NUMBER}"
        }
    }
}
        stage("Build docker image") { 
            steps { 
                sh " docker build . -t audit-image"
                sh " docker tag audit-image audit-image:${IMAGE_TAGS}"
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