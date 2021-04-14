import { getRepository, Repository } from 'typeorm';

import IPurchaseOrdersRepository from '@modules/purchase_orders/repositories/IPurchaseOrdersRepository';
import ICreatePurchaseOrderDTO from '@modules/purchase_orders/dtos/ICreatePurchaseOrderDTO';
import PurchaseOrder from '../entities/PurchaseOrder';

class PurchaseOrdersRepository implements IPurchaseOrdersRepository {
  private ormRepository: Repository<PurchaseOrder>;

  constructor() {
    this.ormRepository = getRepository(PurchaseOrder);
  }

  public async create({
    customer,
    products,
  }: ICreatePurchaseOrderDTO): Promise<PurchaseOrder> {
    const purchaseOrder = this.ormRepository.create({
      customer,
      purchase_order_products: products,
    });

    await this.ormRepository.save(purchaseOrder);

    return purchaseOrder;
  }

  public async findById(id: string): Promise<PurchaseOrder | undefined> {
    const findPurchaseOrder = await this.ormRepository.findOne(id);

    return findPurchaseOrder;
  }
}

export default PurchaseOrdersRepository;
