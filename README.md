# IMDb

This project comprises frontend and backend components demonstrating concurrent execution.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) and npm
- [MongoDB](https://www.mongodb.com/) database

### Installation

1.  Clone the repository:

    `git clone https://github.com/anmolsonkar/IMDb.git`

2.  Install dependencies in both frontend and backend:

    `cd frontend`

    `npm install`

    ` cd ../backend`

    `npm install`

3.  Configure environment variables:

    Create a `.env` file in the backend folder with the following:

    `MONGODB_URI="your mongoDB URI"`

    `JWT_SECRET="your secure JWT secret"`

### Usage

To concurrently run frontend and backend:

`npm run start`

This command utilizes the `concurrently` package to execute:

`cd frontend && npm run dev
cd backend && npm run dev`

## Author

Anmol Sonkar

## License

This project is licensed under the MIT License.
