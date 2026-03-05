pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ganesh290105/Expences-tracker.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
            }
        }

        stage('Build Project') {
            steps {
                echo 'Building Expense Tracker Project...'
            }
        }

        stage('Test Application') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deploying application...'
            }
        }

    }
}
