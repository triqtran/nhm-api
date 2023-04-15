import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.send("Root route is working");
});

export default app;