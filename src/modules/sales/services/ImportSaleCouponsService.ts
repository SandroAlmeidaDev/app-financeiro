import { inject, injectable } from 'tsyringe';

import csvParse from 'csv-parse';
import fs from 'fs';

import CheckoutSaleCoupon from '../infra/typeorm/entities/CheckoutSaleCoupon';
import ICheckoutsSalesCouponsRepository from '../repositories/ICheckoutsSalesCouponsRepository';

interface CSVSaleCoupon {
  company_id: string;
  checkout_id: string;
  operator: number;
  coupon: number;
  type: 'C' | 'D';
  origin: string;
  status?: string;
  sale_date: Date;
  time_start?: string;
  customer_id?: string;
  customer_name?: string;
  total_coupon: number;
  total_discount?: number;
  total_addition?: number;
}

@injectable()
class ImportSaleCouponsService {
  constructor(
    @inject('CheckoutsSalesCouponsRepository')
    private checkoutsSalesCouponsRepository: ICheckoutsSalesCouponsRepository,
  ) {}

  public async execute(
    filePath: string,
    companyId: string,
    checkoutId: string,
  ): Promise<CheckoutSaleCoupon[]> {
    const couponsReadStream = fs.createReadStream(filePath);

    const parses = csvParse({
      delimiter: ',',
    });

    const saleCoupons: CSVSaleCoupon[] = [];

    const parseCSV = couponsReadStream.pipe(parses);

    parseCSV.on('data', async line => {
      const [
        operator,
        coupon,
        type,
        origin,
        status,
        sale_date,
        time_start,
        customer_id,
        customer_name,
        total_coupon,
        total_discount,
        total_addition,
      ] = line.map((cell: string) => cell.trim());

      saleCoupons.push({
        company_id: companyId,
        checkout_id: checkoutId,
        operator,
        coupon,
        type,
        origin,
        status,
        sale_date,
        time_start,
        customer_id,
        customer_name,
        total_coupon,
        total_discount,
        total_addition,
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const createdSaleCoupons = await this.checkoutsSalesCouponsRepository.create(
      saleCoupons.map(coupon => ({
        company_id: coupon.company_id,
        checkout_id: coupon.checkout_id,
        operator: coupon.operator,
        coupon: coupon.coupon,
        type: coupon.type,
        origin: coupon.origin,
        status: coupon.status,
        sale_date: coupon.sale_date,
        time_start: coupon.time_start,
        customer_id: coupon.customer_id,
        customer_name: coupon.customer_name,
        total_coupon: coupon.total_coupon,
        total_discount: coupon.total_discount,
        total_addition: coupon.total_addition,
      }));

    );



    await fs.promises.unlink(filePath);

    return createdSaleCoupons;
  }
}

export default ImportSaleCouponsService;
