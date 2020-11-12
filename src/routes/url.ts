import {Router} from 'express'
import { addGuestControl, addUrlControl, delUrlControl, getUrlControl } from '../controllers/url';
import { isAuthed } from '../validation/auth';
const router = Router();

router.route('/').all(isAuthed).get(getUrlControl).post(addUrlControl).delete(delUrlControl)
router.post('/guest', addGuestControl)


export default router;