import { Request, Response } from 'express';

import CreateOrUpdateCheckoutService from '@modules/sales/services/CreateOrUpdateCheckoutService';

import { container } from 'tsyringe';

export default class CheckoutsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const checkoutData = request.body;

    const createCheckout = container.resolve(CreateOrUpdateCheckoutService);

    const checkout = await createCheckout.execute(checkoutData);

    return response.json(checkout);
  }
}
