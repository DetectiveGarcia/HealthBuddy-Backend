import express from 'express';
import { generateTrainingPlan, generateDietPlan } from '../controllers/chat.controller';
import { checkAuth } from '../middleware/auth.middleware';


const chatGPTRouter = express.Router();

chatGPTRouter.post('/training', checkAuth, generateTrainingPlan);
chatGPTRouter.post('/diet',checkAuth, generateDietPlan);


export default chatGPTRouter