import express from 'express';

import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { attachSequelize } from './middleware/db';
import Cors from './middleware/cors'
import CorsStar from './middleware/corsStar';
import IRoute from './types/IRoute';
import DeleteUserRouter from './routes/deleteUser';
import EditUserRouter from './routes/editUser';
import GetUserRouter from './routes/getUser';
import CreateUserRouter from './routes/createUser';

const appCfg = {
  port: parseInt(process.env.EXPRESS_PORT) || 50000,
  hostname: process.env.EXPRESS_HOST ?? '127.0.0.1',
};

const app = express();

// Attach any middleware
app.use(Cors);
app.use(CorsStar);
app.use(express.json());
app.use(attachSequelize);


// Read all entries from the "routes" directory. Filter out any entry that is not a file.
const _ROUTES_ROOT = resolve(join(__dirname, './routes/'));
const queue = readdirSync(_ROUTES_ROOT)
  .map(entry => join(_ROUTES_ROOT, entry))
  .filter(isFile);


// For each item in the queue, inject it as an API route.
app.use('/delete-user', DeleteUserRouter);
app.use('/edit-user', EditUserRouter);  
app.use('/get-user', GetUserRouter);
app.use('/create-user', CreateUserRouter);

queue.forEach(entry => {
  try {
    const required = require(entry);
    if (required?.default) {
      const { route, router }: IRoute = required.default;
      app.use(route, router());

      console.log('Injected route "%s"', route);
    } else {
      console.error('Invalid route: "%s". No `default` key defined.', entry);
    }
  } catch (e) {
    console.error('Failed to inject route on entry "%s".', entry, e);
  }
});


app.listen(appCfg.port, appCfg.hostname, () => {
  console.log(`Listening on http://${appCfg.hostname}:${appCfg.port}/`);
});

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch (ignored) {
    return false;
  }
}
