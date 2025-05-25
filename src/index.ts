import express, { Request, Response } from 'express'
import userRouter from './routes/user.route';
import planRouter from './routes/plan.route';
import chatGPTRouter from './routes/chat.route';
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 8765

app.use(express.json())
app.use(cors({
  origin: '*', 

}))

app.get('/api/ping', (req: Request, res: Response) => {
    res.status(200).json({ data: 'pong' })
})

app.use('/api/users', userRouter)
app.use('/api/plan', planRouter)
app.use('/api/chat', chatGPTRouter)

app.listen(PORT, () => {
   console.log(`Server listening on port: ${PORT}`);
    
})