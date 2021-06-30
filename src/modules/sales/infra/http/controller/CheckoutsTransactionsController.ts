import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateOrUpdateCheckoutTransactionService from '@modules/sales/services/CreateOrUpdateCheckoutTransactionService';

export default class CheckoutsTransactionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      company_id,
      checkout_id,
      coupon_id,
      operator,
      coupon,
      type,
      sale_date,
      cancellation_status,
      origin,
      pay_type,
      total,
      order,
      parcel,
      covenant_company,
      authorization_number,
      bin_cart,
      nsu,
      card_banner,
      card_cnpj,
      note,
    } = request.body;

    const parseDateSale = parseISO(sale_date);

    const createCheckoutTransaction = container.resolve(
      CreateOrUpdateCheckoutTransactionService,
    );

    const transaction = await createCheckoutTransaction.execute({
      company_id,
      checkout_id,
      coupon_id,
      operator,
      coupon,
      type,
      sale_date: parseDateSale,
      cancellation_status,
      origin,
      pay_type,
      total,
      order,
      parcel,
      covenant_company,
      authorization_number,
      bin_cart,
      nsu,
      card_banner,
      card_cnpj,
      note,
    });

    return response.json(transaction);
  }
}
