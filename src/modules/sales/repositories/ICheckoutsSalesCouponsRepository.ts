import { UpdateResult } from 'typeorm';
import CheckoutSaleCoupon from '../infra/typeorm/entities/CheckoutSaleCoupon';
import ICreateCheckoutSaleCouponDTO from '../dtos/ICreateCheckoutSaleCouponDTO';

export default interface ICheckoutSaleCouponsSalesCouponsRepository {
  create(data: ICreateCheckoutSaleCouponDTO): Promise<CheckoutSaleCoupon>;
  update(id: string, data: ICreateCheckoutSaleCouponDTO): Promise<UpdateResult>;
  findById(id: string): Promise<CheckoutSaleCoupon | undefined>;
  findByCompanyIdCheckoutCoupon(
    company_id: string,
    checkout_id: string,
    coupon: number,
    sale_date: Date,
  ): Promise<CheckoutSaleCoupon | undefined>;
}
