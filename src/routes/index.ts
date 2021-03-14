import { Router } from 'express';
import categoriesReuter from './categories.routes';

import transactionsRouter from './transactions.routes';

const routes = Router();

routes.use('/transactions', transactionsRouter);
routes.use('/categories', categoriesReuter);

export default routes;
