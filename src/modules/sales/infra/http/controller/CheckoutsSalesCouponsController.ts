import { Request, Response } from 'express';
import { parseISO } from 'date-fns';

import CreateOrUpdateCheckoutSaleCouponService from '@modules/sales/services/CreateOrUpdateCheckoutSaleCouponService';

import { container } from 'tsyringe';

export default class CheckoutsSalesCouponsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      company_id,
      checkout_id,
      operator,
      coupon,
      type,
      origin,
      status,
      sale_date,
      time_start,
      customer_id,
      customer_name,
      total_coupon,
      total_discount,
      total_addition,
    } = request.body;

    const parseDateSale = parseISO(sale_date);

    const createCheckoutSaleCoupon = container.resolve(
      CreateOrUpdateCheckoutSaleCouponService,
    );

    const saleCoupon = await createCheckoutSaleCoupon.execute({
      company_id,
      checkout_id,
      operator,
      coupon,
      type,
      origin,
      status,
      sale_date: parseDateSale,
      time_start,
      customer_id,
      customer_name,
      total_coupon,
      total_discount,
      total_addition,
    });

    return response.json(saleCoupon);
  }
}
