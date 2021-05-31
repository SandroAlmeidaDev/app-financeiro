import { Request, Response } from 'express';

import CreateOrUpdateCheckoutService from '@modules/sales/services/CreateOrUpdateCheckoutService';

import { container } from 'tsyringe';

export default class CheckoutsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { company_id, number, status } = request.body;

    const createCheckout = container.resolve(CreateOrUpdateCheckoutService);

    const checkout = await createCheckout.execute({
      company_id,
      number,
      status,
    });

    return response.json(checkout);
  }
}
