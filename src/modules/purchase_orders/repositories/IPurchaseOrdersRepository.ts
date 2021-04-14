import PurchaseOrder from '../infra/typeorm/entities/PurchaseOrder';

import ICreatePurchaseOrderDTO from '../dtos/ICreatePurchaseOrderDTO';

export default interface IPurchaseOrdersRepository {
  create(data: ICreatePurchaseOrderDTO): Promise<PurchaseOrder>;
  findById(id: string): Promise<PurchaseOrder | undefined>;
}
