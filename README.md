# NC-News API Backend Project

This API provides access to various news articles, allowing them to be sorted and filtered using queries. It is designed to serve as the backend for creating NC News websites.

## Getting Started

To explore the hosted version of the API, visit:

[NC-News API](https://nc-news-x69l.onrender.com/api)

Note that the initial message will be `{"msg":"path not found"}` because the base path is invalid. To access the API, append `/api` to the URL, which will return a JSON object listing all available endpoints and their descriptions.

For local development and testing, follow the instructions below.

## Prerequisites

Ensure the following dependencies are installed globally on your machine:

| Dependency | Version |
| ---------- | ------- |
| PostgreSQL | 10.8    |
| Node.js    | v17.2.0 |
| NPM        | 8.1.4   |

## Cloning and Installing

Fork the project to your GitHub profile, then clone the repository. In your terminal, navigate to the desired directory and run:

$ git clone https://github.com/<your-github-username>/be-nc-news

Navigate to the project directory and install all dependencies:

$ npm install

This will install the following dependencies:

express
cors
jest
jest-extended
jest-sorted
supertest
dotenv
pg
pg-format
husky
Database Setup
To set up the databases, run:

bash
Copy code
$ npm run setup-dbs
$ npm run seed
Create two .env files for database connections:

.env.test: PGDATABASE=nc_news_test
.env.development: PGDATABASE=nc_news
Ensure these files are listed in .gitignore.

After setting up, you can query the test database:

$ psql
\c nc_news_test
nc_news_test=# SELECT \* FROM articles;
To exit, type \q.

Exploring and Testing
Feel free to explore the repository and make changes. To run the full test suite, use:

bash
Copy code
$ npm test
Thank you, and enjoy working with the repository!

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

```

```
