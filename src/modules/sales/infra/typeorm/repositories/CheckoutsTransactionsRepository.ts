import { getRepository, Repository } from 'typeorm';

import ICheckoutsTransactionsRepository from '@modules/sales/repositories/ICheckoutsTransactionsRepository';
import ICreateCheckoutTransactionDTO from '@modules/sales/dtos/ICreateCheckoutTransactionDTO';
import CheckoutTransaction from '../entities/CheckoutTransaction';

class CheckoutsTransactionsRepository
  implements ICheckoutsTransactionsRepository {
  private ormRepository: Repository<CheckoutTransaction>;

  constructor() {
    this.ormRepository = getRepository(CheckoutTransaction);
  }

  public async findTransaction(
    company_id: string,
    checkout_id: string,
    coupon_id: string,
    type: 'C' | 'D',
    origin: string,
    pay_type: string,
    total: number,
    sale_date: Date,
  ): Promise<CheckoutTransaction | undefined> {
    const findTransactionCoupon = await this.ormRepository.findOne({
      where: {
        company_id,
        checkout_id,
        coupon_id,
        type,
        origin,
        pay_type,
        total,
        sale_date,
      },
    });

    return findTransactionCoupon;
  }

  public async create(
    data: ICreateCheckoutTransactionDTO,
  ): Promise<CheckoutTransaction> {
    const checkoutTransaction = this.ormRepository.create(data);

    await this.ormRepository.save(checkoutTransaction);

    return checkoutTransaction;
  }

  public async save(
    checkoutTransaction: CheckoutTransaction,
  ): Promise<CheckoutTransaction> {
    return this.ormRepository.save(checkoutTransaction);
  }

  public async findById(id: string): Promise<CheckoutTransaction | undefined> {
    const findTransactionCoupon = await this.ormRepository.findOne({
      where: { id },
    });

    return findTransactionCoupon;
  }
}

export default CheckoutsTransactionsRepository;
