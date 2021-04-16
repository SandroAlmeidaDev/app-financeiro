import { inject, injectable } from 'tsyringe';
import { UpdateResult } from 'typeorm';

import CheckoutSaleCoupon from '../infra/typeorm/entities/CheckoutSaleCoupon';
import ICheckoutsSalesCouponsRepository from '../repositories/ICheckoutsSalesCouponsRepository';

interface IRequest {
  company_id: string;
  checkout_id: string;
  operator: number;
  coupon: number;
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
  ) {}

  public async execute(
    data: IRequest,
  ): Promise<CheckoutSaleCoupon | UpdateResult> {
    const checkCouponExists = await this.checkoutsSalesCouponsRepository.findByCompanyIdCheckoutCoupon(
      data.company_id,
      data.checkout_id,
      data.coupon,
    );

    if (checkCouponExists) {
      const saleCouponUpdated = await this.checkoutsSalesCouponsRepository.update(
        checkCouponExists.id,
        data,
      );

      return saleCouponUpdated;
    }

    const checkoutSaleCoupon = await this.checkoutsSalesCouponsRepository.create(
      data,
    );

    return checkoutSaleCoupon;
  }
}

export default CreateOrUpdateCheckoutSaleCouponService;
