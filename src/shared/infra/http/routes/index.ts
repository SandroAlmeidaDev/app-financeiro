import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

import companiesRouter from '@modules/companies/infra/http/routes/companies.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import purchaseOrdersRouter from '@modules/purchase_orders/infra/http/routes/purchase_orders.routes';

import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

routes.use('/customers', customersRouter);
routes.use('/orders', ordersRouter);

routes.use('/companies', companiesRouter);
routes.use('/products', productsRouter);
routes.use('/purchases_orders', purchaseOrdersRouter);

export default routes;
