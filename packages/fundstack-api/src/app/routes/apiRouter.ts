import express from 'express';
const router = express.Router({mergeParams: true});
import {getFunds} from '../controllers/fundsController';

router.get('/funds', getFunds);

export default router;