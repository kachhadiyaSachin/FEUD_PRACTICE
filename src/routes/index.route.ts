import { Express } from 'express';
import userRoute from './user.route';

const startPoint = "/api/v1";

const routes = (app: Express): void => {
    app.use(`${startPoint}/user`, userRoute);
}

export default routes;