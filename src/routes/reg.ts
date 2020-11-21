import {Router} from 'express'
import {redirectControl, indexControl, verifyControl, notFoundControl} from '../controllers/reg'
const router = Router();

router.get('/:ref_id', redirectControl)
router.get('/', indexControl)
router.get('/verify/:_id', verifyControl)
router.get('*', notFoundControl)



export default router;