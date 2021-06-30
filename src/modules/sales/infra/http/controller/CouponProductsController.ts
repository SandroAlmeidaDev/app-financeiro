import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateOrUpdateCouponProductService from '@modules/sales/services/CreateOrUpdateCouponProductService';

export default class CouponProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      company_id,
      checkout_id,
      coupon_id,
      operator,
      coupon,
      erp_product_id,
      bar_code,
      quantity,
      unit_price,
      discount,
      total_price,
      hour,
      sale_date,
      erp_offer_id,
      cancellation_type,
      order,
      erp_customer_id,
      erp_seller_id,
      erp_department_id,
      aliquot_icms,
      normal_price,
      type_price,
      type_taxation,
      model_doc,
      motive_discount,
      serie_nf,
      erp_promo_id,
      erp_order_id,
      bc_pis,
      bc_cofins,
    } = request.body;

    const createCouponProduct = container.resolve(
      CreateOrUpdateCouponProductService,
    );

    const parseDateSale = parseISO(sale_date);

    const couponProduct = await createCouponProduct.execute({
      company_id,
      checkout_id,
      coupon_id,
      operator,
      coupon,
      erp_product_id,
      bar_code,
      quantity,
      unit_price,
      discount,
      total_price,
      hour,
      sale_date: parseDateSale,
      erp_offer_id,
      cancellation_type,
      order,
      erp_customer_id,
      erp_seller_id,
      erp_department_id,
      aliquot_icms,
      normal_price,
      type_price,
      type_taxation,
      model_doc,
      motive_discount,
      serie_nf,
      erp_promo_id,
      erp_order_id,
      bc_pis,
      bc_cofins,
    });

    return response.json(couponProduct);
  }
}
