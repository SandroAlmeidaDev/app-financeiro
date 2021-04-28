import { inject, injectable } from 'tsyringe';
import { UpdateResult } from 'typeorm';

import CheckoutTransaction from '../infra/typeorm/entities/CheckoutTransaction';
import ICheckoutsTransactionsRepository from '../repositories/ICheckoutsTransactionsRepository';

interface IRequest {
  company_id: string;
  checkout_id: string;
  coupon_id: string;
  operator: number;
  coupon: number;
  type: 'C' | 'D';
  sale_date: Date;
  cancellation_status: string;
  origin: string;
  pay_type: string;
  total: number;
  order: number;
  parcel: number;
  covenant_company: number;
  authorization_number: string;
  bin_cart: string;
  nsu: string;
  card_banner: string;
  card_cnpj: string;
  note: string;
}

@injectable()
class CreateOrUpdateCheckoutTransactionService {
  constructor(
    @inject('CheckoutsTransactionsRepository')
    private checkoutsTransactionsRepository: ICheckoutsTransactionsRepository,
  ) {}

  public async execute(
    data: IRequest,
  ): Promise<CheckoutTransaction | UpdateResult> {
    const checkTransactionExists = await this.checkoutsTransactionsRepository.findTransaction(
      data.company_id,
      data.checkout_id,
      data.coupon_id,
      data.type,
      data.origin,
      data.pay_type,
      data.total,
      data.sale_date,
    );

    if (checkTransactionExists) {
      const transactionUpdated = await this.checkoutsTransactionsRepository.update(
        checkTransactionExists.id,
        data,
      );

      return transactionUpdated;
    }

    const newTransaction = await this.checkoutsTransactionsRepository.create(
      data,
    );

    return newTransaction;
  }
}

export default CreateOrUpdateCheckoutTransactionService;
