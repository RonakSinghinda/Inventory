import { Router } from 'express';
import { stockController } from './stock.controller';
import { authenticate }    from '../../middleware/authenticate';
import { authorize }       from '../../middleware/authorize';
import { validate }        from '../../middleware/validate';
import { StockUpdateDto }  from './stock.dto';

const router = Router();

router.use(authenticate);

router.post('/update',  authorize('admin', 'manager'), validate(StockUpdateDto), stockController.update);
router.get ('/history',                                                           stockController.getHistory);

export default router;
