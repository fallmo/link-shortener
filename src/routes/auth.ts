import {Router} from 'express'
import { loginControl, registerControl, userControl, logoutControl, refreshControl, resendControl } from '../controllers/auth';
import { isAuthed } from '../validation/auth';

const router = Router()

router.post('/login', loginControl)
router.post('/register', registerControl)
router.post('/resend', resendControl)
router.get('/logout', logoutControl)
router.get('/refresh', refreshControl)
router.get('/user', isAuthed, userControl)


export default router;