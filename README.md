# MERN-Commerce Backend Repository

This repository contains the backend code for an `MERN-Commerce` built using Node.js and Express. The backend provides a set of APIs to communicate with the client-side application. It utilizes extensive API endpoints to manage products, categories, orders, transactions, users, and coupons. Additionally, the repository includes Postman API test endpoints for easy testing and debugging.

Client for the project is [Here](https://github.com/shz-code/mern-commerce-client).

# Features

### Extensive API Endpoints:

- The backend provides a comprehensive set of API endpoints to manage various aspects of the e-commerce website, including products, categories, orders, transactions, users, and coupons.

### User Authentication:

- Users can register and log in using their email and password.
- Users can also authenticate using their Google or Facebook accounts using Passport.js.
- Authentication is managed using JSON Web Tokens (JWT).

### Payment Processing:

- SSL Commerz is used for securely processing payments on the e-commerce website.

### Environment Variables:

- In order to use the repository, you need to set the required environment variables. These variables include configuration details for the database, SSL Commerz, and other sensitive information.

### Database:

- The backend uses MongoDB as the database to store and retrieve data efficiently.

### Password Hashing:

- User passwords are securely hashed using bcrypt to protect user accounts.

### Data Validation:

- Incoming data is validated using Joi to ensure data integrity and security.

# Technologies Used

- **Node.js**: The runtime environment for the backend.
- **Express**: The web application framework used to build the API.
- **MongoDB**: The database used to store and retrieve data.
- **JSON Web Tokens (JWT)**: A secure method for transmitting information between parties as JSON objects.
- **Passport.js**: A popular authentication middleware for Node.js.
- **SSL Commerz**: A payment gateway for secure online transactions.
- **Bcrypt**: A library used for hashing passwords.
- **Joi**: A library used for data validation.

# Getting Started

To run `MERN-Commerce` locally, follow these steps:

#### Clone the repository:

```
git clone https://github.com/shz-code/mern-commerce-backend.git
```

#### Navigate to the project directory:

```
cd mern-commerce-backend
```

#### Install the dependencies:

```
npm install
```

#### Set the environment variables:

- Create a **.env** file in the project directory.
- Set the required environment variables in the .env file. Refer to the **.env.example** file provided in the repository for details.
  Start the server:

```
npm start
```

The backend server will start running on the specified port, and it will be ready to communicate with the client-side application.

# API Documentation

The repository includes Postman API test endpoints to assist in testing and debugging the API. Refer to the API documentation provided in the repository for detailed information about the available endpoints and their usage.

# Contributing

Contributions to `MERN-Commerce` backend repository are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

When contributing, please adhere to the following guidelines:

- Fork the repository and create a new branch for your feature or bug fix.
- Follow the existing coding style and conventions.
- Provide clear and detailed commit messages.
- Write tests for any new functionality and ensure existing tests pass.

# License

The e-commerce website backend repository is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use and modify the code for your own purposes.
