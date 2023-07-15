````markdown
# Cab Management

The application we build for the hackathon aims to address the pain areas in managing drivers and cabs for a cab management system. This application's intended end users/customers could be cab service providers, fleet managers, or any organization that deals with managing a fleet of drivers and cabs.

## Getting Started

These instructions will guide you on setting up and running the Node.js server using Docker.

### Prerequisites

- Docker and Docker Compose should be installed on the developer machine.
- Git should be installed for cloning the repository.

### Installation

1. Clone the project repository from GitHub:
   ```shell
   git clone <repository_url>
   ```
````

2. Navigate to the project root directory:

   ```shell
   cd <project_directory>
   ```

3. Create a `.env` file in the project root directory (if not already present) and define the necessary environment variables. For example, you can set the MongoDB URL as an environment variable in the `.env` file:

   ```
   MONGODB_URL=mongodb://mongodb_host:27017/db_name
   JWT_SECRET=<secret_key>
   ```

4. For the production environment, run the following command to build and start the containers:

   ```shell
   docker-compose -f docker-compose.prod.yml up -d
   ```

   This command will build the Docker image based on the Dockerfile and start the production containers in detached mode.

5. For the development environment, run the following command to build and start the containers:

   ```shell
   docker-compose -f docker-compose.dev.yml up
   ```

   This command will build the Docker image based on the Dockerfile and start the development containers. The logs will be displayed in the console.

6. Access the application by opening a web browser and entering the appropriate URL or localhost address (depending on the port configuration in the Docker Compose file).

7. During development, make changes to the source code. The changes will be automatically detected and the application will be reloaded thanks to the volume mounting specified in the Docker Compose file.

8. To stop the containers, use the following command:
   ```shell
   docker-compose -f docker-compose.prod.yml down
   ```
   or
   ```shell
   docker-compose -f docker-compose.dev.yml down
   ```
   This command will stop and remove the containers.

These instructions now include the step to clone the project repository from GitHub before proceeding with the Docker setup. Make sure to replace `<repository_url>` with the actual URL of your project repository.
