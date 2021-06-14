import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

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

  public async execute({
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
  }: IRequest): Promise<CheckoutTransaction> {
    let checkoutTransaction = null;

    try {
      checkoutTransaction = await this.checkoutsTransactionsRepository.findTransaction(
        company_id,
        checkout_id,
        coupon_id,
        type,
        origin,
        pay_type,
        total,
        sale_date,
      );
    } catch (error) {
      throw new AppError(
        'There was an error searching for coupon transactions.',
      );
    }

    if (!checkoutTransaction) {
      let createCheckoutTransaction = null;

      try {
        createCheckoutTransaction = await this.checkoutsTransactionsRepository.create(
          {
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
          },
        );
      } catch (error) {
        throw new AppError('There was an error creating coupon transactions.');
      }

      return createCheckoutTransaction;
    }

    checkoutTransaction.company_id = company_id;
    checkoutTransaction.checkout_id = checkout_id;
    checkoutTransaction.coupon_id = coupon_id;
    checkoutTransaction.operator = operator;
    checkoutTransaction.coupon = coupon;
    checkoutTransaction.type = type;
    checkoutTransaction.sale_date = sale_date;
    checkoutTransaction.cancellation_status = cancellation_status;
    checkoutTransaction.origin = origin;
    checkoutTransaction.pay_type = pay_type;
    checkoutTransaction.total = total;
    checkoutTransaction.order = order;
    checkoutTransaction.parcel = parcel;
    checkoutTransaction.covenant_company = covenant_company;
    checkoutTransaction.authorization_number = authorization_number;
    checkoutTransaction.bin_cart = bin_cart;
    checkoutTransaction.nsu = nsu;
    checkoutTransaction.card_banner = card_banner;
    checkoutTransaction.card_cnpj = card_cnpj;
    checkoutTransaction.note = note;

    return this.checkoutsTransactionsRepository.save(checkoutTransaction);
  }
}

export default CreateOrUpdateCheckoutTransactionService;
