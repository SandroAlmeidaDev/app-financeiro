import { getRepository, Repository } from 'typeorm';

import ICheckoutsSalesCouponsRepository from '@modules/sales/repositories/ICheckoutsSalesCouponsRepository';
import ICreateCheckoutSaleCouponDTO from '@modules/sales/dtos/ICreateCheckoutSaleCouponDTO';
import CheckoutSaleCoupon from '../entities/CheckoutSaleCoupon';

interface ImportCSVResponse {
  message: string;
  rows_inserted: number;
}

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
    sale_date: Date,
  ): Promise<CheckoutSaleCoupon | undefined> {
    const findSaleCoupon = this.ormRepository.findOne({
      where: {
        company_id,
        checkout_id,
        coupon,
        sale_date,
      },
    });

    return findSaleCoupon;
  }

  public async create(
    data: ICreateCheckoutSaleCouponDTO,
  ): Promise<CheckoutSaleCoupon> {
    const checkoutSaleCoupon = this.ormRepository.create(data);

    await this.ormRepository.save(checkoutSaleCoupon);

    return checkoutSaleCoupon;
  }

  public async save(
    checkoutSaleCoupon: CheckoutSaleCoupon,
  ): Promise<CheckoutSaleCoupon> {
    return this.ormRepository.save(checkoutSaleCoupon);
  }

  public async importCSV(
    file_path: string,
    company_id: string,
    checkout_id: string,
  ): Promise<ImportCSVResponse | CheckoutSaleCoupon> {
    const checkoutSaleCoupon = this.ormRepository.create({
      file_path,
      company_id,
      checkout_id,
    });

    return checkoutSaleCoupon;
  }

  public async findById(id: string): Promise<CheckoutSaleCoupon | undefined> {
    const findSaleCoupon = await this.ormRepository.findOne({ where: { id } });

    return findSaleCoupon;
  }
}

export default CheckoutsSalesCouponsRepository;
