import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', SubscriptionController.createSubscription);
router.get('/:userId', SubscriptionController.getUserSubscription);
router.put('/:userId', SubscriptionController.updateSubscription);
router.delete('/:userId', SubscriptionController.cancelSubscription);

export { router as subscriptionRoutes };
