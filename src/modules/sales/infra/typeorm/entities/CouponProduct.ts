import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('coupons_products')
@Index(
  [
    'company_id',
    'checkout_id',
    'coupon_id',
    'operator',
    'bar_code',
    'erp_product_id',
    'coupon',
    'sale_date',
    'order',
  ],
  {
    unique: true,
  },
)
class CouponProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @Column()
  checkout_id: string;

  @Column()
  coupon_id: string;

  @Column()
  operator: number;

  @Column()
  coupon: number;

  @Column()
  erp_product_id: number;

  @Column()
  bar_code: number;

  @Column()
  quantity: number;

  @Column()
  unit_price: number;

  @Column()
  discount?: number;

  @Column()
  total_price: number;

  @Column()
  hour: string;

  @Column()
  sale_date: Date;

  @Column()
  erp_offer_id?: string;

  @Column()
  cancellation_type: string;

  @Column()
  order?: number;

  @Column()
  erp_customer_id?: number;

  @Column()
  erp_seller_id?: number;

  @Column()
  erp_department_id: number;

  @Column()
  aliquot_icms?: number;

  @Column()
  normal_price: number;

  @Column()
  type_price?: number;

  @Column()
  type_taxation: string;

  @Column()
  model_doc: string;

  @Column()
  motive_discount?: string;

  @Column()
  serie_nf: string;

  @Column()
  erp_promo_id?: string;

  @Column()
  erp_order_id?: string;

  @Column()
  bc_pis: number;

  @Column()
  bc_cofins: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CouponProduct;
