import {Router} from 'express'
import { addUrlControl, delUrlControl, getUrlControl } from '../controllers/url';
import { isAuthed } from '../validation/auth';
const router = Router();

router.route('/').all(isAuthed).get(getUrlControl).post(addUrlControl).delete(delUrlControl)


export default router;