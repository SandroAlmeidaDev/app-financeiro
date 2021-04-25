export default interface ICreateCheckoutTransactionDTO {
  company_id: string;
  checkout_id: string;
  operator: number;
  coupon_id: string;
  type: 'C' | 'D';
  origin: string;
  pay_type: string;
  order: number;
  parcel: number;
  sale_date: Date;
  sale_due_date?: Date;
  total: number;
}
