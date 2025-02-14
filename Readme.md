# Women Resources API

This project is a web-based platform designed to improve access to critical resources for women in Kigali, Rwanda. Built using Express.js and SQLite, the backend serves as a RESTful API to facilitate resource discovery, user registration, and data management for the frontend React and Tailwind CSS.

## Features

- User registration and authentication
- Resource directory with categories (healthcare, education, finance, etc.)
- Secure API endpoints for managing resources
- SQLite database for lightweight data storage

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/capstone-kigali_hub
   ```
2. Navigate into the project directory:
   ```bash
   cd capstone-kigali_hub && cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
    npm i && npm start
   ```

## API Endpoints

- `GET /resources` - Retrieve all available resources
- `POST /resources` - Add a new resource
- `POST /register` - Register a new user

## Technologies Used

- Node.js
- Express.js
- SQLite
- Body-parser
- Cors

## Contribution

Feel free to fork this repository and submit pull requests for improvements or additional features.

## License

This project is licensed under the MIT License.
