# Inkpandas

This project is a simple web application that allows writing and reading enthusiasts to read and upload their creative articles to an openly shared community of like minded people.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:
- Docker

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/nmzz209741/inkpandas
    ```
2. Navigate to the project directory:
    ```bash
    cd inkpandas
    ```
3. Check whether the docker compose file is present. Check whether backend and frontend both have their .env files. If not, create the .env files on the basis of `example.env` file descriptions. Install npm dependencies for each as:
    ```bash
    npm i
    ```
4. Run the command
   `docker compose pull`
5. Run the script:
    ```bash
    sh localDeployment.sh
    ```
6. Create the tables in the database if it's your first time:
    ```bash
    NODE_ENV=development PURGE=true node backend/scripts/createTables.js 
    ```
7. Access the web application at:
   http://localhost:5173
   Backend API: http://localhost:3000
   Database: http://dynamo-local:8000

### Running the test files

To run the test suites available in the frontend and backend, for both, run the following command in the respective directory:
    ```bash
    npm install && npm run test
    ```

### Building for Production

To create a production build, run:
```bash
npm run build
```
The production-ready files will be in the `build` directory.

## Deployment

This project is deployed to ECS. You can access it at [65.1.112.160](http://65.1.112.160)

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.