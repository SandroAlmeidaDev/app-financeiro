import { inject, injectable } from 'tsyringe';

import Checkout from '../infra/typeorm/entities/Checkout';
import ICheckoutsRepository from '../repositories/ICheckoutsRepository';

interface IRequest {
  company_id: string;
  number: number;
  status: string;
}

@injectable()
class CreateOrUpdateCheckoutService {
  constructor(
    @inject('CheckoutsRepository')
    private checkoutsRepository: ICheckoutsRepository,
  ) {}

  public async execute({
    company_id,
    number,
    status,
  }: IRequest): Promise<Checkout> {
    const checkout = await this.checkoutsRepository.findByCompanyIdNumber(
      company_id,
      number,
    );

    if (!checkout) {
      const createCheckout = await this.checkoutsRepository.create({
        company_id,
        number,
        status,
      });

      return createCheckout;
    }

    checkout.company_id = company_id;
    checkout.number = number;
    checkout.status = status;

    return this.checkoutsRepository.save(checkout);
  }
}

export default CreateOrUpdateCheckoutService;
