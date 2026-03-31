import { Router } from 'express';
import { vendorsController } from './vendors.controller';
import { authenticate }      from '../../middleware/authenticate';
import { authorize }         from '../../middleware/authorize';
import { validate }          from '../../middleware/validate';
import { CreateVendorDto, UpdateVendorDto } from './vendors.dto';

const router = Router();

router.use(authenticate);

router.get ('/',      vendorsController.getAll);
router.get ('/:id',   vendorsController.getById);
router.post('/',      authorize('admin', 'manager'), validate(CreateVendorDto), vendorsController.create);
router.put ('/:id',   authorize('admin', 'manager'), validate(UpdateVendorDto), vendorsController.update);
router.delete('/:id', authorize('admin'),                                        vendorsController.delete);

export default router;
