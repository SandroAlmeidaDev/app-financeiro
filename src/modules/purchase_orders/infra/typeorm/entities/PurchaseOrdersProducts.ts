import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import PurchaseOrder from '@modules/purchase_orders/infra/typeorm/entities/PurchaseOrder';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('purchase_orders_products')
class PurchaseOrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => PurchaseOrder,
    purchaseOrder => purchaseOrder.purchase_order_products,
  )
  @JoinColumn({ name: 'order_id' })
  PurchaseOrder: PurchaseOrder;

  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: string;

  @Column()
  order_id: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default PurchaseOrdersProducts;
