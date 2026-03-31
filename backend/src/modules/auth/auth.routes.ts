import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate }   from '../../middleware/authenticate';
import { validate }       from '../../middleware/validate';
import { LoginDto, RegisterDto } from './auth.dto';

const router = Router();

router.post('/login',    validate(LoginDto),    authController.login);
router.post('/register', validate(RegisterDto), authController.register);
router.get ('/me',       authenticate,          authController.me);

export default router;
