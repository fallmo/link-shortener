import {Router} from 'express'
import { addGuestControl, addUrlControl, delUrlControl, getUrlControl } from '../controllers/url';
import { isAuthed } from '../validation/auth';
const router = Router();

router.route('/').all(isAuthed).get(getUrlControl).post(addUrlControl)
router.post('/guest', addGuestControl)
router.delete('/:_id', isAuthed, delUrlControl);


export default router;