# README.md

# Backend for Women Resources

This project is the server-side implementation for the Women Resources application. It provides a RESTful API to manage resources and user data for women in Kigali, Rwanda.

## Features

- User registration and authentication
- Resource management (create, read, update, delete)
- Middleware for error handling and authentication
- Database interaction through models

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/capstone-kigali_backend
   ```
2. Navigate into the project directory:
   ```bash
   cd capstone-kigali_backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Copy the `.env.example` to `.env` and fill in the required values.

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /register` - Register a new user
- `POST /login` - Authenticate a user
- `GET /resources` - Retrieve all resources
- `POST /resources` - Add a new resource
- `PUT /resources/:id` - Update a resource
- `DELETE /resources/:id` - Delete a resource

## Technologies Used

- Node.js
- Express.js
- MongoDB (or your chosen database)
- JWT for authentication

## License

This project is licensed under the MIT License.