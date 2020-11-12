import {Router} from 'express'
import {redirectControl, indexControl} from '../controllers/reg'
const router = Router();

router.get('/:ref_id', redirectControl)
router.get('/', indexControl)



export default router;