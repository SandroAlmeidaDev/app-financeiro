import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import PurchaseOrdersProducts from '@modules/purchase_orders/infra/typeorm/entities/PurchaseOrdersProducts';

@Entity('purchase_orders')
class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(
    () => PurchaseOrdersProducts,
    purchaseOrdersProducts => purchaseOrdersProducts.PurchaseOrder,
    {
      eager: true,
      cascade: true,
    },
  )
  purchase_order_products: PurchaseOrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default PurchaseOrder;
