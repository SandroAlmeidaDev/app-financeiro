import { Request, Response } from 'express';

import CreateCompanyService from '@modules/companies/services/CreateCompanyService';

import { container } from 'tsyringe';

export default class CompaniesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const companyData = request.body;

    const createCompany = container.resolve(CreateCompanyService);

    const company = await createCompany.execute(companyData);

    return response.json(company);
  }
}
