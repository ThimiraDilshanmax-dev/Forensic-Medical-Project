pipeline {
    agent any

    // This block tells Jenkins to listen for GitHub webhooks (pushes)
    triggers {
        githubPush()
    }

    environment {
        // Forces Docker to use a clean, consistent name instead of the random Jenkins workspace name
        COMPOSE_PROJECT_NAME = 'forensic-medical-project'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins automatically pulls the latest code from your main branch
                checkout scm
            }
        }

        stage('Backend Build & Test') {
            steps {
                dir('backend') {
                    // Installs dependencies using the Node.js we installed on your EC2
                    sh 'npm install'
                    
                    // Runs the newly added Jest + Supertest test suite
                    sh 'npm test'
                    echo 'Backend is ready!'
                }
            }
        }

        stage('Frontend Build & Test') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    
                    // Runs the newly added Vitest + React Testing Library suite
                    sh 'npm test'
                    echo 'Frontend is ready!'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                sh '''
                    # 1. Copy the secure .env files from the server into the workspace
                    cp /var/lib/jenkins/project_secrets/backend.env backend/.env
                    cp /var/lib/jenkins/project_secrets/frontend.env frontend/.env
                    
                    # 2. Run the deployment
                    docker compose down
                    
                    # Because the .env files are now in the folders, this build step will securely pick them up
                    docker compose build --no-cache
                    docker compose up -d --remove-orphans
                '''
            }
        }

        stage('Cleanup') {
            steps {
                // This is CRITICAL. It automatically deletes old Docker images after every successful deploy
                // so your new 30GB hard drive never fills up to 100% again!
                sh 'docker image prune -af'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful! The new version is live.'
        }
        failure {
            echo '❌ Pipeline failed. Check the Jenkins logs. The previous working version is likely still running.'
        }
        always {
            // Deletes the source code from the Jenkins folder after it finishes to save disk space
            cleanWs()
        }
    }
}