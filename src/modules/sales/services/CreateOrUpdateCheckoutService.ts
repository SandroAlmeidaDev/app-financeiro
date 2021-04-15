import { inject, injectable } from 'tsyringe';

import { UpdateResult } from 'typeorm';
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

  public async execute(data: IRequest): Promise<Checkout | UpdateResult> {
    const checkCheckoutExists = await this.checkoutsRepository.findByCompanyIdNumber(
      data.company_id,
      data.number,
    );

    if (checkCheckoutExists) {
      const checkoutUpdated = await this.checkoutsRepository.update(
        checkCheckoutExists.id,
        data,
      );

      return checkoutUpdated;
    }

    const newCheckout = await this.checkoutsRepository.create(data);

    return newCheckout;
  }
}

export default CreateOrUpdateCheckoutService;
