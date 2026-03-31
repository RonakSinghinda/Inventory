import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate }    from '../../middleware/authenticate';
import { authorize }       from '../../middleware/authorize';
import { validate }        from '../../middleware/validate';
import { CreateUserDto, UpdateUserDto } from './users.dto';

const router = Router();

router.use(authenticate, authorize('admin')); // all user management is admin-only

router.get ('/',      usersController.getAll);
router.get ('/:id',   usersController.getById);
router.post('/',      validate(CreateUserDto), usersController.create);
router.put ('/:id',   validate(UpdateUserDto), usersController.update);
router.delete('/:id', usersController.delete);

export default router;
