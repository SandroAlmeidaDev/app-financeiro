import { inject, injectable } from 'tsyringe';
import { createReadStream } from 'fs';
import csvParse from 'csv-parse';
import { StringStream } from 'scramjet';

import CheckoutSaleCoupon from '../infra/typeorm/entities/CheckoutSaleCoupon';
import ICheckoutsSalesCouponsRepository from '../repositories/ICheckoutsSalesCouponsRepository';

interface IRequest {
  file_path: string;
  company_id: string;
  checkout_id: string;
}

interface ImportCSVResponse {
  message: string;
  rows_inserted: number;
}

@injectable()
class ImportCheckoutSalesCouponsService {
  constructor(
    @inject('CheckoutsSalesCouponsRepository')
    private checkoutsSalesCouponsRepository: ICheckoutsSalesCouponsRepository,
  ) {}

  public async execute({
    file_path,
    company_id,
    checkout_id,
  }: IRequest): Promise<ImportCSVResponse | CheckoutSaleCoupon> {
    const checkoutSaleCouponReadStream = createReadStream(file_path);

    const parseCSV = checkoutSaleCouponReadStream
      .pipe(new StringStream('utf-8'))
      .CSVParse({
        delimiter: ',',
        newline: '\n',
        escapeChar: '"',
        quoteChar: '"',
      });

    console.log(parseCSV);

    return parseCSV;
  }
}

export default ImportCheckoutSalesCouponsService;
