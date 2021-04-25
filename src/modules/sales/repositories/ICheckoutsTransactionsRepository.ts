import { UpdateResult } from 'typeorm';
import CheckoutTransaction from '../infra/typeorm/entities/CheckoutTransaction';
import ICreateCheckoutTransactionDTO from '../dtos/ICreateCheckoutTransactionDTO';

export default interface ICheckoutsTransactionsRepository {
  create(data: ICreateCheckoutTransactionDTO): Promise<CheckoutTransaction>;
  update(
    id: string,
    data: ICreateCheckoutTransactionDTO,
  ): Promise<UpdateResult>;
  findById(id: string): Promise<CheckoutTransaction | undefined>;
  findTransaction(
    company_id: string,
    checkout_id: string,
    coupon_id: string,
    data: Date,
  ): Promise<CheckoutTransaction | undefined>;
}
