import { Router } from 'express';

import CheckoutsTransactionsController from '../controller/CheckoutsTransactionsController';

const checkoutsTransactionsRouter = Router();
const checkoutsTransactionsController = new CheckoutsTransactionsController();

checkoutsTransactionsRouter.post('/', checkoutsTransactionsController.create);

export default checkoutsTransactionsRouter;
