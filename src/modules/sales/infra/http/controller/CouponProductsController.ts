import { Request, Response } from 'express';

import CreateOrUpdateCouponProductService from '@modules/sales/services/CreateOrUpdateCouponProductService';

import { container } from 'tsyringe';

export default class CouponProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const couponProductData = request.body;

    const createCouponProduct = container.resolve(
      CreateOrUpdateCouponProductService,
    );

    const couponProduct = await createCouponProduct.execute(couponProductData);

    return response.json(couponProduct);
  }
}
