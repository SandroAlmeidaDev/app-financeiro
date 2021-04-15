import { Request, Response } from 'express';

import CreateOrUpdateCheckoutSaleCouponService from '@modules/sales/services/CreateOrUpdateCheckoutSaleCouponService';

import { container } from 'tsyringe';

export default class CheckoutsSalesCouponsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const saleCouponData = request.body;

    const createCheckoutSaleCoupon = container.resolve(
      CreateOrUpdateCheckoutSaleCouponService,
    );

    const saleCoupon = await createCheckoutSaleCoupon.execute(saleCouponData);

    return response.json(saleCoupon);
  }
}
