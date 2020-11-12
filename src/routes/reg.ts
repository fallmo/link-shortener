import {Router} from 'express'
import {redirectTo} from '../controllers/reg'
const router = Router();

router.get('/:ref_id', redirectTo)



export default router;