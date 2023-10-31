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
                        def jsonContent = readFile(file: 'package.json').trim() // Read the JSON content from the file
            def packageJson = jsonParse(jsonContent) // Parse the JSON content
            def packageVersion = packageJson.version
            echo "Package Version: ${packageVersion}"
            // def packageJson = readJson file: 'package.json'
            // def packageVersion = packageJson.version 
            // echo "packageVersion"
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


