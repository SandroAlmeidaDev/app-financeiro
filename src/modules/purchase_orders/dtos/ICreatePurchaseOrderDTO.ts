import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

export default interface ICreatePurchaseOrderDTO {
  customer: Customer;
  products: IProduct[];
}
