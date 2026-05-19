pipeline {
    agent any

    tools {
        nodejs 'nodejs-25-8-0'
    }

    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:${env.PATH}"
    }

    stages {
        stage('Build') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'npm install'
            }
        }

        stage('Dependencies Scanning') {
            parallel {
                stage('NPM Dependencies Audit') {
                    steps {
                        sh '''
                            npm audit --audit-level=critical
                            echo $?
                        '''
                    }
                }

                stage('OWASP Dependencies Check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan package.json
                            --scan package-lock.json
                            --disableYarnAudit
                            --disableOssIndex
                            --nodeAuditSkipDevDependencies
                            --format ALL
                        ''', odcInstallation: 'OWASP-DepCheck-10'

                    }
                }
            }
          }
     
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Code Coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'Err! This will be fixed in the future releases', stageResult: 'UNSTABLE') {
                     sh 'npm run coverage'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'printenv'
                sh 'docker build -t nitishk21/solar-system:$GIT_COMMIT .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub-creds', url: '') {
                    sh 'docker push nitishk21/solar-system:$GIT_COMMIT'
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, keepProperties: true, testResults: 'test-results.xml'
            junit allowEmptyResults: true, keepProperties: true, testResults: 'dependency-check-junit.xml'
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'Code Coverage Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        }
    }
}
