import { Router } from 'express';
import { progressController } from '../controllers/progress.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { updateProgressSchema } from '../validators/user.validator';
import { readStudySchema, writeStudySchema, readStudyProgress, writeStudyProgress } from '../services/studyProgress.service';
import { sendSuccess } from '../utils/response';

const router = Router();

router.use(authenticate); // All progress routes require authentication

router.get('/module/:moduleId/study', validate(readStudySchema), async (req, res, next) => {
  try { sendSuccess(res, await readStudyProgress(req.user!.id, Number(req.params.moduleId))); }
  catch (error) { next(error); }
});
router.patch('/module/:moduleId/study', validate(writeStudySchema), async (req, res, next) => {
  try { sendSuccess(res, await writeStudyProgress(req.user!.id, Number(req.params.moduleId), req.body)); }
  catch (error) { next(error); }
});

router.get('/me', progressController.getMyProgress);
router.get('/review-items', progressController.getReviewItems);
router.post('/module', validate(updateProgressSchema), progressController.updateModuleProgress);

export default router;
