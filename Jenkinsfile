pipeline {
    agent any

    tools {
        nodejs 'nodejs-25-8-0'
    }

    stages {
        stage('Build') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'npm install'
            }
        }

        stage('NPM Dependencies Audit') {
            steps {
                sh 'npm audit --audit-level=critical'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'test-results.xml'
                }
            }
        }
    }
}
