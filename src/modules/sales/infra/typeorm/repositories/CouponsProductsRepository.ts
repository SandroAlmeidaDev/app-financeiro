import { getRepository, Repository, UpdateResult } from 'typeorm';

import ICreateCouponProductDTO from '@modules/sales/dtos/ICreateCouponProductDTO';
import ICouponProductsRepository from '@modules/sales/repositories/ICouponProductsRepository';
import CouponProduct from '../entities/CouponProduct';

class CouponsProductsRepository implements ICouponProductsRepository {
  private ormRepository: Repository<CouponProduct>;

  constructor() {
    this.ormRepository = getRepository(CouponProduct);
  }

  public async findCouponProducts(
    company_id: string,
    checkout_id: string,
    coupon_id: string,
    erp_product_id: number,
    bar_code: number,
    order: number,
    operator: number,
    sale_date: Date,
  ): Promise<CouponProduct | undefined> {
    const findCoupon = await this.ormRepository.findOne({
      where: {
        company_id,
        checkout_id,
        coupon_id,
        erp_product_id,
        bar_code,
        order,
        operator,
        sale_date,
      },
    });

    return findCoupon;
  }

  public async create(data: ICreateCouponProductDTO): Promise<CouponProduct> {
    const couponProducts = this.ormRepository.create(data);

    await this.ormRepository.save(couponProducts);

    return couponProducts;
  }

  public async update(
    id: string,
    data: ICreateCouponProductDTO,
  ): Promise<UpdateResult> {
    const couponProducts = await this.ormRepository.update(id, data);

    return couponProducts;
  }

  public async findById(id: string): Promise<CouponProduct | undefined> {
    const findCoupon = await this.ormRepository.findOne({ where: { id } });

    return findCoupon;
  }
}

export default CouponsProductsRepository;
