export default interface ICreateCheckoutSaleCouponDTO {
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
