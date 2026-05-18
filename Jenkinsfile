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

                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])

                        junit allowEmptyResults: true, keepProperties: true, testResults: 'dependency-check-junit.xml'
                    }
                }
            }
          }

        stage('Test') {
            steps {
                sh 'npm test'

                junit allowEmptyResults: true, keepProperties: true, testResults: 'test-results.xml'
            }
        }

        stage('Code Coverage) {
                sh 'npm run coverage
            }
    }
}
