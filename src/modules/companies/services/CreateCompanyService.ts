import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

interface IRequest {
  cnpj: number;
  company_code: number;
  state_registration: string;
  company_name: string;
  fantasy_name: string;
  adress: string;
  number: string;
  district: string;
  complement: string;
  zip_code: string;
  city: string;
  state: string;
  commercial_phone: string;
  cell_phone: string;
  email: string;
  company_type: string;
}

@injectable()
class CreateCompanyService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute(companyData: IRequest): Promise<Company> {
    const checkCompanyExists = await this.companiesRepository.findByCnpj(
      companyData.cnpj,
    );

    if (checkCompanyExists) {
      throw new AppError('This cnpj is already registered');
    }

    const newCompany = await this.companiesRepository.create(companyData);

    return newCompany;
  }
}

export default CreateCompanyService;
