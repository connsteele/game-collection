# game-collection
Inventory application for tracking video games

## Setup
- Create a .env file in the root folder. This will need a `DATABASE_URL` variable in the form of: `postgresql://<role_name>:<role_password>@localhost:5432/<role_database_name>`
where <> is replaced with the relevant information for your psql server.

- When working locally ensure a psql server is running and you have created a database that shares the name of the `<role_database_name>`