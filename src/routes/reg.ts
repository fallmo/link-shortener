import {Router} from 'express'
import {redirectControl, indexControl, verifyControl} from '../controllers/reg'
const router = Router();

router.get('/:ref_id', redirectControl)
router.get('/', indexControl)
router.get('/verify/:_id/:user_id', verifyControl)



export default router;