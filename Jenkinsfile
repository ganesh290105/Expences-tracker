pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ganesh290105/Expences-tracker.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Expense Tracker Project...'
            }
        }

        stage('Test') {
            steps {
                echo 'Testing Project...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying Project...'
            }
        }
    }
}
