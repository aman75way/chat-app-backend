# Chat App

  

## Overview

  

The **75 Chat App** is a real-time chat application built using the **PERN** stack (PostgreSQL, Express.js, React, Node.js). It utilizes **Socket.IO** for real-time messaging and **Prisma** for seamless database management. The app allows users to send messages in real time, manage user profiles, and create private conversations. Additionally, the app supports user authentication with **JWT** tokens.

  

## Features

  

-  **User Authentication**: Users can sign up and log in securely with JWT-based authentication.

-  **Real-Time Messaging**: Built with **Socket.IO**, the app enables users to send and receive messages instantly.

-  **User Profiles**: Users can manage their profile information such as full name and email.

-  **Private Conversations**: The app supports private one-on-one messaging between users.

-  **API Documentation**: The app comes with Swagger UI for easy API documentation and interaction.

-  **Prisma ORM**: Used to manage database models and migrations.

  

## Technologies Used

  

-  **Backend**: Express.js, Socket.IO

-  **Database**: PostgreSQL with Prisma ORM

-  **Authentication**: JWT (JSON Web Tokens)

-  **Real-Time Communication**: Socket.IO

-  **Documentation**: Swagger UI

-  **Containerization**: Docker (Optional for PostgreSQL setup)

  

---

  

## How to Run the Project

  

### Prerequisites

  

-  **Node.js** (v16 or higher)

-  **Docker** (for optional database containerization)

-  **Docker Compose** (for multi-container management)

-  **PostgreSQL** (If not using Docker for DB)

  

### 1. Clone the Repository

  

```bash

git  clone  https://github.com/aman75way/chat-app-backend

cd  chat-app-backend

  

```

  

### 2. Install Dependencies

  

Install backend dependencies:

  

```bash

npm  install

OR

pnpm install

```


  

### 3. Docker Setup (Optional)

  

If you want to run PostgreSQL via Docker, use the following:

  

```bash

docker-compose  up  -d

  

```

  

This command will start a PostgreSQL container with the database accessible on `localhost:5430`.

  

### 4. Set Up Environment Variables

  

Create a `.env` file at the root of the project and add the following:

  

NOTE : One `.env` is already provided for unhassled runnning of `dev` server

  

```bash

JWT_SECRET=<your-secret-key>

DATABASE_URL=postgresql://postgres:admin@localhost:5430/chatdb?schema=public

PORT=5000

  

```

  

### 5. Prisma Database Setup

  

Run the following Prisma commands to set up the database and generate client:

  

```bash

npx  prisma  migrate  dev

npx  prisma  generate

  

```

  

### 6. Running the Application

  

-  **Development**: To start the app in development mode with hot reloading:

  

```bash

npm  run  dev

  

```

  

-  **Production**: To build the app for production and run it:

  

```bash

npm  run  build

npm  start

  

```

  

### 7. Accessing the Application

  

Once the app is running, you can access:

  

-  **Backend API**: `http://localhost:5000`

-  **Swagger API Documentation**: `http://localhost:5000/api-docs` (for exploring and interacting with the API)

  

----------

  

## Swagger UI API Documentation

  

You can access the API documentation through Swagger UI at:

  

```

http://localhost:5000/api-docs

```

  

  

----------

  

## License

  

This project is licensed under the ISC License.

  

## Acknowledgements

  

-  **Socket.IO**: Real-time messaging library.

-  **Prisma ORM**: Database management tool.

-  **PostgreSQL**: Database service.

-  **JWT**: Secure authentication.

-  **Docker**: Containerization of the database.

  

# File Structure Overview

```markdown

.
├── app
│   ├── common
│   │   ├── dto
│   │   │   └── base.dto.ts
│   │   ├── helpers
│   │   │   └── catch-error.helper.ts
│   │   ├── middlewares
│   │   │   └── auth.middleware.ts
│   │   └── services
│   │   │   ├── database.service.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── socket.service.ts
│   │   │   └── token.service.ts
│   ├── message
│   │   ├── message.controller.ts
│   │   ├── message.dto.ts
│   │   ├── message.routes.ts
│   │   └── message.service.ts
│   ├── user
│   │   ├── user.controller.ts
│   │   ├── user.dto.ts
│   │   ├── user.routes.ts
│   │   ├── user.service.ts
│   │   └── user.validation.ts
│   └── routes.ts
├── prisma
│   ├── migrations
│   └── schema.prisma
├── .env
├── package.json
├── package-lock.json
├── docker-compose.yml
├── Entity-Relationship-Diagram.png
├── tsconfig.json
├── swagger.json
├── data.json
└── index.ts

  
  ```

## Explanation of Key Folders and Files

  

-  **app/**: Contains all backend application logic (user authentication, messaging services, etc.).

-  **common/**: Reusable services, middlewares, and helper functions.

-  **message/**: Handling of message-related functionality.

-  **user/**: User authentication, user routes, and validation logic.

-  **dist/**: The compiled output of TypeScript code.

-  **prisma/**: Prisma schema and migration files for the database.

-  **swagger.json**: Swagger API documentation.

-  **docker-compose.yml**: Used for setting up PostgreSQL in a containerized environment.

-  **index.ts**: Main entry point for the application.

## NOTE

1. Group Chat Features can be implemented