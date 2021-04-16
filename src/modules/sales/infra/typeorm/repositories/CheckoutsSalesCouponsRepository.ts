import { getRepository, Repository, UpdateResult } from 'typeorm';

import ICheckoutsSalesCouponsRepository from '@modules/sales/repositories/ICheckoutsSalesCouponsRepository';
import ICreateCheckoutSaleCouponDTO from '@modules/sales/dtos/ICreateCheckoutSaleCouponDTO';
import CheckoutSaleCoupon from '../entities/CheckoutSaleCoupon';

class CheckoutsSalesCouponsRepository
  implements ICheckoutsSalesCouponsRepository {
  private ormRepository: Repository<CheckoutSaleCoupon>;

  constructor() {
    this.ormRepository = getRepository(CheckoutSaleCoupon);
  }

  public async findByCompanyIdCheckoutCoupon(
    company_id: string,
    checkout_id: string,
    coupon: number,
  ): Promise<CheckoutSaleCoupon | undefined> {
    const findSaleCoupon = this.ormRepository.findOne({
      where: {
        company_id,
        checkout_id,
        coupon,
      },
    });

    return findSaleCoupon;
  }

  public async create(
    checkoutData: ICreateCheckoutSaleCouponDTO,
  ): Promise<CheckoutSaleCoupon> {
    const checkout = this.ormRepository.create(checkoutData);

    await this.ormRepository.save(checkout);

    return checkout;
  }

  public async update(
    id: string,
    data: ICreateCheckoutSaleCouponDTO,
  ): Promise<UpdateResult> {
    const checkout = await this.ormRepository.update(id, data);

    return checkout;
  }

  public async findById(id: string): Promise<CheckoutSaleCoupon | undefined> {
    const findSaleCoupon = await this.ormRepository.findOne({ where: { id } });

    return findSaleCoupon;
  }
}

export default CheckoutsSalesCouponsRepository;
