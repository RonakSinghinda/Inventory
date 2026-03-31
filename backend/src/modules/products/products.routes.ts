import { Router } from 'express';
import { productsController } from './products.controller';
import { authenticate }       from '../../middleware/authenticate';
import { authorize }          from '../../middleware/authorize';
import { validate }           from '../../middleware/validate';
import { CreateProductDto, UpdateProductDto } from './products.dto';

const router = Router();

router.use(authenticate);

router.get ('/',     productsController.getAll);
router.get ('/:id',  productsController.getById);
router.post('/',     authorize('admin', 'manager'), validate(CreateProductDto), productsController.create);
router.put ('/:id',  authorize('admin', 'manager'), validate(UpdateProductDto), productsController.update);
router.delete('/:id',authorize('admin'),                                        productsController.delete);

export default router;
