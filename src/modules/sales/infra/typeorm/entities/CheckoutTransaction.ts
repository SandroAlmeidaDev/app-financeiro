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
  operator: number;

  @Column()
  coupon: number;

  @Column()
  type: string;

  @Column()
  order: number;

  @Column()
  parcel: number;

  @Column()
  sale_date: Date;

  @Column()
  sale_due_date?: Date;

  @Column()
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CheckoutTransaction;
