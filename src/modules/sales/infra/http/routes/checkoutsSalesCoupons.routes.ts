import { Router } from 'express';

import CheckoutsSalesCouponsController from '../controller/CheckoutsSalesCouponsController';

const checkoutsSalesCouponsRouter = Router();
const checkoutsSalesCouponsController = new CheckoutsSalesCouponsController();

checkoutsSalesCouponsRouter.post('/', checkoutsSalesCouponsController.create);

export default checkoutsSalesCouponsRouter;
