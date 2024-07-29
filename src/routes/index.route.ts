import { Express } from 'express';
import userRoute from './user.route';
import feudRoute from './feuds.route';
import profileRoute from './profile.route';

const startPoint = "/api/v1";

const routes = (app: Express): void => {
    app.use(`${startPoint}/user`, userRoute);
    app.use(`${startPoint}/feuds`, feudRoute);
    app.use(`${startPoint}/profile`, profileRoute);
}

export default routes;