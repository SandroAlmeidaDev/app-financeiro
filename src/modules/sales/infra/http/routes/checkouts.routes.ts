import { Router } from 'express';

import CheckoutsController from '../controller/CheckoutsController';

const checkoutsRouter = Router();
const checkoutsController = new CheckoutsController();

checkoutsRouter.post('/', checkoutsController.create);

export default checkoutsRouter;
