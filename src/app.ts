require("dotenv").config();
import express, { Application } from 'express';
import routes from './routes';

const app: Application = express();

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on the port: ${process.env.PORT}`);
});
