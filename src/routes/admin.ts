import {Router} from 'express'
import { getInfoControl, getLogsControl, clearLogsControl } from '../controllers/admin';
import { isAuthed } from '../validation/auth';
const router = Router();

router.get('/', isAuthed, getInfoControl)
router.get('/logs', isAuthed, getLogsControl)
router.delete('/logs', isAuthed, clearLogsControl)

export default router;