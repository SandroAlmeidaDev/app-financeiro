import { Router } from 'express';

import CouponProductsController from '../controller/CouponProductsController';

const couponsProductsRouter = Router();
const couponProductsController = new CouponProductsController();

couponsProductsRouter.post('/', couponProductsController.create);

export default couponsProductsRouter;
