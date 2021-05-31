import CheckoutSaleCoupon from '../infra/typeorm/entities/CheckoutSaleCoupon';
import ICreateCheckoutSaleCouponDTO from '../dtos/ICreateCheckoutSaleCouponDTO';

interface ImportCSVResponse {
  message: string;
  rows_inserted: number;
}

export default interface ICheckoutsSalesCouponsRepository {
  create(data: ICreateCheckoutSaleCouponDTO): Promise<CheckoutSaleCoupon>;
  save(checkoutSaleCoupon: CheckoutSaleCoupon): Promise<CheckoutSaleCoupon>;
  importCSV(
    file_path: string,
    company_id: string,
    checkout_id: string,
  ): Promise<ImportCSVResponse | CheckoutSaleCoupon>;
  findById(id: string): Promise<CheckoutSaleCoupon | undefined>;
  findByCompanyIdCheckoutCoupon(
    company_id: string,
    checkout_id: string,
    coupon: number,
    sale_date: Date,
  ): Promise<CheckoutSaleCoupon | undefined>;
}
