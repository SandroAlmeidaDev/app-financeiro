import CheckoutTransaction from '../infra/typeorm/entities/CheckoutTransaction';
import ICreateCheckoutTransactionDTO from '../dtos/ICreateCheckoutTransactionDTO';

export default interface ICheckoutsTransactionsRepository {
  create(data: ICreateCheckoutTransactionDTO): Promise<CheckoutTransaction>;
  save(checkoutTransaction: CheckoutTransaction): Promise<CheckoutTransaction>;
  findById(id: string): Promise<CheckoutTransaction | undefined>;
  findTransaction(
    company_id: string,
    checkout_id: string,
    coupon_id: string,
    type: 'C' | 'D',
    origin: string,
    pay_type: string,
    total: number,
    sale_date: Date,
  ): Promise<CheckoutTransaction | undefined>;
}
