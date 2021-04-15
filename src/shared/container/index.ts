import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';

import IPurchaseOrdersRepository from '@modules/purchase_orders/repositories/IPurchaseOrdersRepository';
import PurchaseOrdersRepository from '@modules/purchase_orders/infra/typeorm/repositories/PurchaseOrdersRepository';

import ICheckoutsRepository from '@modules/sales/repositories/ICheckoutsRepository';
import CheckoutsRepository from '@modules/sales/infra/typeorm/repositories/CkeckoutsRepository';

import CheckoutsSalesCouponsRepository from '@modules/sales/infra/typeorm/repositories/CheckoutsSalesCouponsRepository';
import ICheckoutsSalesCouponsRepository from '@modules/sales/repositories/ICheckoutsSalesCouponsRepository';

import ICheckoutsTransactionsRepository from '@modules/sales/repositories/ICheckoutsTransactionsRepository';
import CheckoutsTransactionsRepository from '@modules/sales/infra/typeorm/repositories/CheckoutsTransactionsRepository';

import ICouponProductsRepository from '@modules/sales/repositories/ICouponProductsRepository';
import CouponsProductsRepository from '@modules/sales/infra/typeorm/repositories/CouponsProductsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ICompaniesRepository>(
  'CompaniesRepository',
  CompaniesRepository,
);

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<IPurchaseOrdersRepository>(
  'PurchaseOrdersRepository',
  PurchaseOrdersRepository,
);

container.registerSingleton<ICheckoutsRepository>(
  'CheckoutsRepository',
  CheckoutsRepository,
);

container.registerSingleton<ICheckoutsSalesCouponsRepository>(
  'CheckoutsSalesCouponsRepository',
  CheckoutsSalesCouponsRepository,
);

container.registerSingleton<ICheckoutsTransactionsRepository>(
  'CheckoutsTransactionsRepository',
  CheckoutsTransactionsRepository,
);

container.registerSingleton<ICouponProductsRepository>(
  'CouponProductRepository',
  CouponsProductsRepository,
);
