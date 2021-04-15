import { getRepository, Repository, UpdateResult } from 'typeorm';

import ICheckoutsRepository from '@modules/sales/repositories/ICheckoutsRepository';
import ICreateCheckoutDTO from '@modules/sales/dtos/ICreateCheckoutDTO';
import Checkout from '../entities/Checkout';

class CheckoutsRepository implements ICheckoutsRepository {
  private ormRepository: Repository<Checkout>;

  constructor() {
    this.ormRepository = getRepository(Checkout);
  }

  public async findByCompanyIdNumber(
    company_id: string,
    number: number,
  ): Promise<Checkout | undefined> {
    const findCheckout = await this.ormRepository.findOne({
      where: {
        company_id,
        number,
      },
    });

    return findCheckout;
  }

  public async create(data: ICreateCheckoutDTO): Promise<Checkout> {
    const checkout = this.ormRepository.create(data);

    await this.ormRepository.save(checkout);

    return checkout;
  }

  public async update(
    id: string,
    data: ICreateCheckoutDTO,
  ): Promise<UpdateResult> {
    const checkout = await this.ormRepository.update(id, data);

    return checkout;
  }

  public async findById(id: string): Promise<Checkout | undefined> {
    const findCheckout = await this.ormRepository.findOne({
      where: { id },
    });

    return findCheckout;
  }
}

export default CheckoutsRepository;
