# Women Resources

This project is a web-based platform designed to improve access to critical resources for women in Kigali, Rwanda. Built using Express.js and SQLite, the backend serves as a RESTful API to facilitate resource discovery, user registration, and data management for the frontend React and Tailwind CSS.

## Designs

The Designs of the project can be found [Figma](https://www.figma.com/design/QnS07Q1l4hlZnyoR3Lxn3W/Capstone-Ornella?node-id=5-87&t=qTA5NgOH2trhK0nS-1)

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

## Deployment

The Frontend is deployed on Vercel at this [link](https://capstone-women-kigalihub.vercel.app/) and the Backend will be deployed on Render.

## License

This project is licensed under the MIT License.
