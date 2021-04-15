import { Request, Response } from 'express';

import CreateOrUpdateCheckoutTransactionService from '@modules/sales/services/CreateOrUpdateCheckoutTransactionService';

import { container } from 'tsyringe';

export default class CheckoutsTransactionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const checkoutTransaction = request.body;

    const createCheckoutTransaction = container.resolve(
      CreateOrUpdateCheckoutTransactionService,
    );

    const transaction = await createCheckoutTransaction.execute(
      checkoutTransaction,
    );

    return response.json(transaction);
  }
}
