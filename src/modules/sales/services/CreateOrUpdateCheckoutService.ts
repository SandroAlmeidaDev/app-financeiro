import AppError from '@shared/errors/AppError';
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
    let checkout = null;

    try {
      checkout = await this.checkoutsRepository.findByCompanyIdNumber(
        company_id,
        number,
      );
    } catch (error) {
      throw new AppError('There was an error fetching checkout.');
    }

    if (!checkout) {
      let createCheckout = null;

      try {
        createCheckout = await this.checkoutsRepository.create({
          company_id,
          number,
          status,
        });
      } catch (error) {
        throw new AppError('There was an error creating checkout.');
      }

      return createCheckout;
    }

    checkout.company_id = company_id;
    checkout.number = number;
    checkout.status = status;

    return this.checkoutsRepository.save(checkout);
  }
}

export default CreateOrUpdateCheckoutService;
