# EDJX DevOps Exercise

## Task

Create a CI/CD pipeline to deploy this application to DigitalOcean Kubernetes.

## Requirements

Other than the requirements shown below, any tools or processes can be used.

- Only the DigitalOcean Cloud can be used.
- All Components should be runing in kubernetes.
- The design should be scalable, redundant and secure
- The Web UI should be accessible on the internet using SSL

## Application Details

The application is a basic 3 tier application with the following components:

- Web Based UI
- Rest API
- PostgreSQL Database

The configuration is stored in environment variables and can be loaded via a `.env` file.  The defaults are stored in the `.env.example` files.

## Database Configuration

The schema will automatically be created the first time the API is started and successfully connects to the database.  The Database has to be created first using the command below:

```CREATE DATABASE postgres;```

![alt text](https://github.com/edjx/exercises/blob/main/moviemaster.png?raw=true "Movie Master Application")
