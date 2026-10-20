import { Router } from 'express';
import authRoutes from './auth.routes';
import levelRoutes from './level.routes';
import moduleRoutes from './module.routes';
import vocabularyRoutes from './vocabulary.routes';
import kanjiRoutes from './kanji.routes';
import grammarRoutes from './grammar.routes';
import quizRoutes from './quiz.routes';
import dictionaryRoutes from './dictionary.routes';
import progressRoutes from './progress.routes';
import flashcardRoutes from './flashcard.routes';
import gameRoutes from './game.routes';
import kanaRoutes from './kana.routes';
import gamificationRoutes from './gamification.routes';
import userRoutes from './user.routes';
import historyRoutes from './history.routes';
import testRoutes from './test.routes';
import adminRoutes from './admin.routes';
import announcementRoutes from './announcement.routes';

const router = Router();

// Phase 1 Auth
router.use('/auth', authRoutes);

// Phase 2 Content APIs
router.use('/levels', levelRoutes);
router.use('/modules', moduleRoutes);
router.use('/vocabulary', vocabularyRoutes);
router.use('/kanji', kanjiRoutes);
router.use('/grammar', grammarRoutes);
router.use('/quizzes', quizRoutes);
router.use('/dictionary', dictionaryRoutes);

// Phase 3 User Progress APIs
router.use('/progress', progressRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/games', gameRoutes);
router.use('/kana', kanaRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/users', userRoutes);

// Phase 4 Extended Features APIs
router.use('/history', historyRoutes);
router.use('/tests', testRoutes);

// Phase 5 Admin & Management APIs
router.use('/admin', adminRoutes);
router.use('/announcements', announcementRoutes);

export default router;
