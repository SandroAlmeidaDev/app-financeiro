import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('checkouts_sales_coupons')
class CheckoutSaleCoupons {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @Column()
  checkout_id: string;

  @Column()
  operator: number;

  @Column()
  coupon: number;

  @Column()
  status?: string;

  @Column()
  type: 'C' | 'D';

  @Column()
  origin: string;

  @Column()
  sale_date: Date;

  @Column()
  time_start?: string;

  @Column()
  customer_id?: string;

  @Column()
  customer_cpf?: string;

  @Column()
  customer_name?: string;

  @Column()
  total_coupon: number;

  @Column()
  total_discount?: number;

  @Column()
  total_addition?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CheckoutSaleCoupons;
