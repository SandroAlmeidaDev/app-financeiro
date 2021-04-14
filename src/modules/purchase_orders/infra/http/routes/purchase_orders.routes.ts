import { Router } from 'express';

import PurchaseOrdersController from '../controller/PurchaseOrdersController';

const purchaseOrdersRouter = Router();
const purchaseOrdersController = new PurchaseOrdersController();

purchaseOrdersRouter.post('/', purchaseOrdersController.create);
purchaseOrdersRouter.get('/:id', purchaseOrdersController.show);

export default purchaseOrdersRouter;
