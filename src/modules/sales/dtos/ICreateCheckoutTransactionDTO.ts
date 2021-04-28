export default interface ICreateCheckoutTransactionDTO {
  company_id: string;
  checkout_id: string;
  coupon_id: string;
  operator: number;
  coupon: number;
  sale_date: Date;
  type: 'C' | 'D';
  cancellation_status: string;
  origin: string;
  pay_type: string;
  order: number;
  parcel: number;
  covenant_company: number;
  authorization_number: string;
  bin_cart: string;
  nsu: string;
  card_banner: string;
  card_cnpj: string;
  note: string;
  total: number;
}
