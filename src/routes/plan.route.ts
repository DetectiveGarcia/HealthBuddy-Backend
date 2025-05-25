import { Router } from "express";
import { storeDietPlan, storeTrainingPlan, getMySchedules, getScheduleById } from "../controllers/plan.controller";
import { checkAuth } from "../middleware/auth.middleware";

const planRouter = Router();

planRouter.post('/store-diet-plan', checkAuth, storeDietPlan);
planRouter.post('/store-training-plan', checkAuth, storeTrainingPlan);
planRouter.get('/me/schedules', checkAuth, getMySchedules);
planRouter.get('/me/:id', checkAuth, getScheduleById);


export default planRouter