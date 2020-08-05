import express from 'express';
import ClassController from './controllers/ClassesController';
import ConnectionsControllers from './controllers/ConnectionsControllers';

const routes = express.Router();
const classesControllers = new ClassController();
const connectionsControllers = new ConnectionsControllers();

routes.get('/classes', classesControllers.index);
routes.post('/classes', classesControllers.create);

routes.get('/connections', connectionsControllers.index);
routes.post('/connections', connectionsControllers.create);

export default routes;