import { Router } from 'express';
import { categoriesController } from './categories.controller';
import { authenticate }         from '../../middleware/authenticate';
import { authorize }            from '../../middleware/authorize';
import { validate }             from '../../middleware/validate';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

const router = Router();

router.use(authenticate);

router.get ('/',      categoriesController.getAll);
router.get ('/:id',   categoriesController.getById);
router.post('/',      authorize('admin', 'manager'), validate(CreateCategoryDto), categoriesController.create);
router.put ('/:id',   authorize('admin', 'manager'), validate(UpdateCategoryDto), categoriesController.update);
router.delete('/:id', authorize('admin'),                                          categoriesController.delete);

export default router;
