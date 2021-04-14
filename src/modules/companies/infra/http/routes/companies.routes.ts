import { Router } from 'express';

import CompaniesController from '../controller/CompaniesController';

const companiesRouter = Router();
const companiesController = new CompaniesController();

companiesRouter.post('/', companiesController.create);

export default companiesRouter;
