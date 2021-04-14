import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreatePurchaseOrderService from '@modules/purchase_orders/services/CreatePurchaseOrderService';
import FindPurchaseOrderService from '@modules/purchase_orders/services/FindPurchaseOrderService';

export default class PurchaseOrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findPurchaseOrder = container.resolve(FindPurchaseOrderService);

    const order = await findPurchaseOrder.execute({
      id,
    });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createPurchaseOrder = container.resolve(CreatePurchaseOrderService);

    const purchaseOrder = await createPurchaseOrder.execute({
      customer_id,
      products,
    });

    return response.json(purchaseOrder);
  }
}
