import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('checkouts_transactions')
class CheckoutTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @Column()
  checkout_id: string;

  @Column()
  coupon_id?: string;

  @Column()
  operator: number;

  @Column()
  coupon: number;

  @Column()
  sale_date: Date;

  @Column()
  type: string;

  @Column()
  cancellation_status: string;

  @Column()
  origin: string;

  @Column()
  pay_type: string;

  @Column()
  total: number;

  @Column()
  order: number;

  @Column()
  parcel: number;

  @Column()
  covenant_company: number;

  @Column()
  authorization_number: string;

  @Column()
  bin_cart: string;

  @Column()
  nsu: string;

  @Column()
  card_banner: string;

  @Column()
  card_cnpj: string;

  @Column()
  note: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CheckoutTransaction;
