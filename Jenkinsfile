pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/Users/s0s0qhm/.rd/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH" // Docker CLI path
        DOCKER_IMAGE = "sri1711/spring-boot-demo:${BUILD_NUMBER}"
        SONAR_URL = "http://127.0.0.1:9000"
        GIT_REPO_NAME = "SpringBootDemoApplication"
        GIT_USER_NAME = "sri1711"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "Checked out source code"'
            }
        }

        stage('Build with Maven') {
            steps {
                sh '''
                    mvn clean install
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
                    sh '''
                        mvn sonar:sonar -Dsonar.login=$SONAR_AUTH_TOKEN -Dsonar.host.url=${SONAR_URL}
                    '''
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        docker build -t ${DOCKER_IMAGE} .
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}
                    '''
                }
            }
        }

        stage('Update Deployment YAML') {
            steps {
                withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                        git config user.email "sriviveknathsr@gmail.com"
                        git config user.name "SRIVIVEKNATH S R"
                        sed -i '' "s/replaceImageTag/${BUILD_NUMBER}/g" deployment-manifests/deployment.yml
                        git add deployment-manifests/deployment.yml
                        git commit -m "Update deployment image to version ${BUILD_NUMBER}"
                        git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
                    '''
                }
            }
        }

    }

    post {
        always {
            echo "Pipeline finished. Cleaning up..."
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs."
        }
    }
}