# What is this project?
This is a skill assessment system allowing users to assess their skills by answering multiple-choice questions in numerous fields of knowledge. Users should also be able to propose their own questions which are then reviewed by experts in the corresponding knowledge area. Users are also able to do various other things such as reviewing their own performance, making friends with other people, viewing friends’ performance, viewing leaderboards containing the best players in each knowledge area, and updating profiles, including avatars. Admins can perform privileged tasks such as managing subjects and users.


# Client
Navigate to the client folder.
```bash
cd client
```

## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install dependencies.

```bash
yarn
```

## Run

```bash
yarn dev
```

# Server
Navigate to the server folder.
```bash
cd server
```

## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install dependencies.

```bash
yarn
```

For database, we use PostgreSQL. Firstly, restore the database using the SQL dump file in the databases folder (you can refer to this [online tutorial](https://www.postgresqltutorial.com/postgresql-restore-database/)). Secondly, start PostgreSQL server on your machine. Then, modify the ```DATABASE_URL``` variable in the ```environments/.env.dev``` to match your PostgreSQL server config.




## Run

```bash
yarn dev
```

# License
[MIT](https://choosealicense.com/licenses/mit/)