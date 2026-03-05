pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Step 1: Cloning GitHub Repository'
                git branch: 'main', url: 'https://github.com/ganesh290105/Expences-tracker.git'
            }
        }

        stage('Build Project') {
            steps {
                echo 'Step 2: Building Expense Tracker'
            }
        }

        stage('Test Project') {
            steps {
                echo 'Step 3: Testing Application'
            }
        }

        stage('Deploy Project') {
            steps {
                echo 'Step 4: Deploying Application'
            }
        }

    }
}
