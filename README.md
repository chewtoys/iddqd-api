# Pre-reqs
To build and run this app locally you will need a few things:
- Install [Node.js](https://nodejs.org/en/)
- Install [PostgreSQL](https://www.postgresql.org/)
- Install [Redis](https://redis.io/)
- Install [Yarn](https://yarnpkg.com/en/)

# Getting started
- Clone the repository
```
git clone git@github.com:Anoma1y/iddqd-api.git .
```
- Install dependencies
```
yarn install
```
- Configure PostgreSQL
```bash
todo
```
- Configure Redis
```bash
todo
```
- Running a project for development
```
yarn watch:ts
```
and in a separate terminal we run
```
yarn watch:node
```
- Build and run the project
```
yarn build
yarn start
```

### Running the build
To call a script, simply run `yarn <script-name>` from the command line.

| Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Does the same as 'yarn serve'. Can be invoked with `yarn start`                                 |
| `serve`                   | Runs node on `build/server.js` which is the apps entry point                                       |
| `watch:node`              | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task         |
| `watch:ts`                | Watches `.ts` files and re-compiles when needed               |
| `tslint`                  | Runs TSLint on project files                                                                      |
| `prettier:base`  | Runs Prettier on project files|
| `prettier:all`  | Runs Prettier on project files with file extension: `.js`, `.jsx`, `.ts`, `.tsx`, `.json` |
| `prettier:ts`  | Runs Prettier on project files with file extension: `.ts`, `.tsx` |
| `prettier:js`  | Runs Prettier on project files with file extension: `.js`, `.jsx` |
| `prettier:json` | Runs Prettier on project files with file extension: `.json` |

### Sequelize command

| Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| db:migrate                       | Run pending migrations|
| db:migrate:schema:timestamps:add | Update migration table to have timestamps|
| db:migrate:status                | List the status of all migrations|
| db:migrate:undo                  | Reverts a migration|
| db:migrate:undo:all              | Revert all migrations ran|
| db:seed                          | Run specified seeder|
| db:seed:undo                     | Deletes data from the database|
| db:seed:all                      | Run every seeder|
| db:seed:undo:all                 | Deletes data from the database|
| db:create                        | Create database specified by configuration|
| db:drop                          | Drop database specified by configuration|
| init                             | Initializes project|
| init:config                      | Initializes configuration|
| init:migrations                  | Initializes migrations|
| init:models                      | Initializes models|
| init:seeders                     | Initializes seeders|
| migration:generate               | Generates a new migration file|
| model:generate                   | Generates a model and its migration|
| seed:generate                    | Generates a new seed file          |
