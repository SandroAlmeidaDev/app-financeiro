import Checkout from '../infra/typeorm/entities/Checkout';
import ICreateCheckoutDTO from '../dtos/ICreateCheckoutDTO';

export default interface ICheckoutsRepository {
  create(data: ICreateCheckoutDTO): Promise<Checkout>;
  save(checkout: Checkout): Promise<Checkout>;

  findById(id: string): Promise<Checkout | undefined>;
  findByCompanyIdNumber(
    company_id: string,
    number: number,
  ): Promise<Checkout | undefined>;
}
