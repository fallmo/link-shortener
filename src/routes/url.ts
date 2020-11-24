import {Router} from 'express'
import { addGuestControl, addUrlControl, delUrlControl, getUrlControl, addChromeControl, extSyncControl } from '../controllers/url';
import { isAuthed } from '../validation/auth';
const router = Router();

router.route('/').all(isAuthed).get(getUrlControl).post(addUrlControl)
router.post('/guest', addGuestControl)
router.post('/chrome', addChromeControl);
router.post('/chrome/sync', isAuthed, extSyncControl);
router.delete('/:_id', isAuthed, delUrlControl);


export default router;