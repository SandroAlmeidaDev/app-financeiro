import { Request, Response } from 'express';
import { parseISO } from 'date-fns';

import CreateOrUpdateCheckoutSaleCouponService from '@modules/sales/services/CreateOrUpdateCheckoutSaleCouponService';

import { container } from 'tsyringe';

export default class CheckoutsSalesCouponsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { sale_date, ...data } = request.body;

    const parseDateSale = parseISO(sale_date);

    const createCheckoutSaleCoupon = container.resolve(
      CreateOrUpdateCheckoutSaleCouponService,
    );

    const saleCoupon = await createCheckoutSaleCoupon.execute({
      sale_date: parseDateSale,
      ...data,
    });

    return response.json(saleCoupon);
  }
}
