### Running the build
To call a script, simply run `yarn <script-name>` from the command line.

| Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Does the same as 'yarn serve'. Can be invoked with `yarn start`                                 |
| `serve`                   | Runs node on `build/server.js` which is the apps entry point                                       |
| `watch:node`              | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task         |
| `watch:ts`                | Watches `.ts` files and re-compiles when needed               |
| `tslint`                  | Runs TSLint on project files                                                                      |
