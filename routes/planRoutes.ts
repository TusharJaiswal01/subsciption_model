import { Router } from 'express';
import { PlanController } from '../controllers/planController';

const router = Router();

router.get('/', PlanController.getAllPlans);
router.post('/', PlanController.createPlan); 

export { router as planRoutes };
