import { Request, Response } from 'express';
import { parseISO } from 'date-fns';

import CreateOrUpdateCouponProductService from '@modules/sales/services/CreateOrUpdateCouponProductService';

import { container } from 'tsyringe';

export default class CouponProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { sale_date, ...data } = request.body;

    const createCouponProduct = container.resolve(
      CreateOrUpdateCouponProductService,
    );

    const parseDateSale = parseISO(sale_date);

    const couponProduct = await createCouponProduct.execute({
      sale_date: parseDateSale,
      ...data,
    });

    return response.json(couponProduct);
  }
}
