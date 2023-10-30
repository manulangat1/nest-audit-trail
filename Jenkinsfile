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
     }
}