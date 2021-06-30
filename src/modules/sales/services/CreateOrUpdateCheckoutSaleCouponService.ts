import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import CheckoutSaleCoupon from '../infra/typeorm/entities/CheckoutSaleCoupon';
import ICheckoutsSalesCouponsRepository from '../repositories/ICheckoutsSalesCouponsRepository';

interface IRequest {
  company_id: string;
  checkout_id: string;
  operator: number;
  coupon: number;
  type: 'C' | 'D';
  origin: string;
  status?: string;
  sale_date: Date;
  time_start?: string;
  customer_id?: string;
  customer_name?: string;
  total_coupon: number;
  total_discount?: number;
  total_addition?: number;
}

@injectable()
class CreateOrUpdateCheckoutSaleCouponService {
  constructor(
    @inject('CheckoutsSalesCouponsRepository')
    private checkoutsSalesCouponsRepository: ICheckoutsSalesCouponsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    company_id,
    checkout_id,
    operator,
    coupon,
    type,
    origin,
    status,
    sale_date,
    time_start,
    customer_id,
    customer_name,
    total_coupon,
    total_discount,
    total_addition,
  }: IRequest): Promise<CheckoutSaleCoupon> {
    let checkoutSaleCoupon = null;

    try {
      checkoutSaleCoupon = await this.checkoutsSalesCouponsRepository.findByCompanyIdCheckoutCoupon(
        company_id,
        checkout_id,
        coupon,
        sale_date,
      );
    } catch (error) {
      throw new AppError('There was an error getting coupon');
    }

    if (!checkoutSaleCoupon) {
      let CreateCheckoutSaleCoupon = null;

      try {
        CreateCheckoutSaleCoupon = await this.checkoutsSalesCouponsRepository.create(
          {
            company_id,
            checkout_id,
            operator,
            coupon,
            type,
            origin,
            status,
            sale_date,
            time_start,
            customer_id,
            customer_name,
            total_coupon,
            total_discount,
            total_addition,
          },
        );
      } catch (error) {
        throw new AppError('There was an error creating a new coupon.');
      }

      return CreateCheckoutSaleCoupon;
    }

    checkoutSaleCoupon.company_id = company_id;
    checkoutSaleCoupon.checkout_id = checkout_id;
    checkoutSaleCoupon.operator = operator;
    checkoutSaleCoupon.coupon = coupon;
    checkoutSaleCoupon.type = type;
    checkoutSaleCoupon.origin = origin;
    checkoutSaleCoupon.status = status;
    checkoutSaleCoupon.sale_date = sale_date;
    checkoutSaleCoupon.time_start = time_start;
    checkoutSaleCoupon.customer_id = customer_id;
    checkoutSaleCoupon.customer_name = customer_name;
    checkoutSaleCoupon.total_coupon = total_coupon;
    checkoutSaleCoupon.total_discount = total_discount;
    checkoutSaleCoupon.total_addition = total_addition;

    return this.checkoutsSalesCouponsRepository.save(checkoutSaleCoupon);
  }
}

export default CreateOrUpdateCheckoutSaleCouponService;
