import { Request, Response } from 'express';
import { parseISO } from 'date-fns';

import CreateOrUpdateCheckoutTransactionService from '@modules/sales/services/CreateOrUpdateCheckoutTransactionService';

import { container } from 'tsyringe';

export default class CheckoutsTransactionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { sale_date, ...data } = request.body;

    const parseDateSale = parseISO(sale_date);

    const createCheckoutTransaction = container.resolve(
      CreateOrUpdateCheckoutTransactionService,
    );

    const transaction = await createCheckoutTransaction.execute({
      sale_date: parseDateSale,
      ...data,
    });

    return response.json(transaction);
  }
}
