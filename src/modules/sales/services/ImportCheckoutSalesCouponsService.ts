import { inject, injectable } from 'tsyringe';
import { promisify } from 'util';
import { createReadStream } from 'fs';

import { pipeline } from 'stream';

import { StringStream } from 'scramjet';

import CheckoutSaleCoupon from '../infra/typeorm/entities/CheckoutSaleCoupon';
import ICheckoutsSalesCouponsRepository from '../repositories/ICheckoutsSalesCouponsRepository';

const pipelineAsync = promisify(pipeline);

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

    await pipelineAsync(checkoutSaleCouponReadStream);
  }
}

export default ImportCheckoutSalesCouponsService;
