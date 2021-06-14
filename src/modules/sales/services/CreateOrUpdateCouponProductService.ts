import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import CouponProduct from '../infra/typeorm/entities/CouponProduct';
import ICouponProductsRepository from '../repositories/ICouponProductsRepository';

interface IRequest {
  company_id: string;
  checkout_id: string;
  coupon_id: string;
  operator: number;
  coupon: number;
  erp_product_id: number;
  bar_code: number;
  quantity: number;
  unit_price: number;
  discount?: number;
  total_price: number;
  hour: string;
  sale_date: Date;
  erp_offer_id?: string;
  cancellation_type: string;
  order: number;
  erp_customer_id?: number;
  erp_seller_id?: number;
  erp_department_id: number;
  aliquot_icms?: number;
  normal_price: number;
  type_price?: number;
  type_taxation: string;
  model_doc: string;
  motive_discount?: string;
  serie_nf: string;
  erp_promo_id?: string;
  erp_order_id?: string;
  bc_pis: number;
  bc_cofins: number;
}

@injectable()
class CreateOrUpdateCouponProductService {
  constructor(
    @inject('CouponsProductsRepository')
    private couponsProductsRepository: ICouponProductsRepository,
  ) {}

  public async execute({
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
  }: IRequest): Promise<CouponProduct> {
    let checkoutCouponProducts = null;

    try {
      checkoutCouponProducts = await this.couponsProductsRepository.findCouponProducts(
        company_id,
        checkout_id,
        coupon_id,
        erp_product_id,
        bar_code,
        order,
        operator,
        sale_date,
      );
    } catch (error) {
      throw new AppError('There was an error searching for coupon products.');
    }

    if (!checkoutCouponProducts) {
      let createCheckCouponProducts = null;

      try {
        createCheckCouponProducts = await this.couponsProductsRepository.create(
          {
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
          },
        );
      } catch (error) {
        throw new AppError('There was an error creating the coupon products.');
      }

      return createCheckCouponProducts;
    }

    checkoutCouponProducts.company_id = company_id;
    checkoutCouponProducts.checkout_id = checkout_id;
    checkoutCouponProducts.coupon_id = coupon_id;
    checkoutCouponProducts.operator = operator;
    checkoutCouponProducts.coupon = coupon;
    checkoutCouponProducts.erp_product_id = erp_product_id;
    checkoutCouponProducts.bar_code = bar_code;
    checkoutCouponProducts.quantity = quantity;
    checkoutCouponProducts.unit_price = unit_price;
    checkoutCouponProducts.discount = discount;
    checkoutCouponProducts.total_price = total_price;
    checkoutCouponProducts.hour = hour;
    checkoutCouponProducts.sale_date = sale_date;
    checkoutCouponProducts.erp_offer_id = erp_offer_id;
    checkoutCouponProducts.cancellation_type = cancellation_type;
    checkoutCouponProducts.order = order;
    checkoutCouponProducts.erp_customer_id = erp_customer_id;
    checkoutCouponProducts.erp_seller_id = erp_seller_id;
    checkoutCouponProducts.erp_department_id = erp_department_id;
    checkoutCouponProducts.aliquot_icms = aliquot_icms;
    checkoutCouponProducts.normal_price = normal_price;
    checkoutCouponProducts.type_price = type_price;
    checkoutCouponProducts.type_taxation = type_taxation;
    checkoutCouponProducts.model_doc = model_doc;
    checkoutCouponProducts.motive_discount = motive_discount;
    checkoutCouponProducts.serie_nf = serie_nf;
    checkoutCouponProducts.erp_promo_id = erp_promo_id;
    checkoutCouponProducts.erp_order_id = erp_order_id;
    checkoutCouponProducts.bc_pis = bc_pis;
    checkoutCouponProducts.bc_cofins = bc_cofins;

    return this.couponsProductsRepository.save(checkoutCouponProducts);
  }
}

export default CreateOrUpdateCouponProductService;
