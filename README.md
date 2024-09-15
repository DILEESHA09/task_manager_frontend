This README file provides a simple step-by-step guide for setting up and running the React project.
Steps to Set Up and Run the React Project
1. Clone the Repository
Clone the repository to your local machine:

bash
git clone https://github.com/DILEESHA09/task_manager_frontend.git
cd task_manager_react
2. Install Dependencies
Run the following command to install all required dependencies from package.json:

bash
npm install
Tailwind CSS is already configured in the project. Make sure that the configuration is properly set up in the following files:
3. Tailwind CSS Configuration 
tailwind.config.js: This file contains the Tailwind configuration.
index.css: Tailwind directives should be included in this file to apply the styles.
@tailwind base;
@tailwind components;
@tailwind utilities;
4. Start the Development Server
To start the React development server, run:
npm start
This will start the server and open the project in your default browser at http://localhost:3000/
