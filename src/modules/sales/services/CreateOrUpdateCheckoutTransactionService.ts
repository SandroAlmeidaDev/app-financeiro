import { inject, injectable } from 'tsyringe';
import { UpdateResult } from 'typeorm';

import CheckoutTransaction from '../infra/typeorm/entities/CheckoutTransaction';
import ICheckoutsTransactionsRepository from '../repositories/ICheckoutsTransactionsRepository';

interface IRequest {
  company_id: string;
  checkout_id: string;
  operator: number;
  coupon: number;
  type: string;
  order: number;
  parcel: number;
  sale_date: Date;
  sale_due_date: Date;
  total: number;
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
      data.coupon,
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
