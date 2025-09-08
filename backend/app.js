import express from 'express'
import dotenv from 'dotenv'
import { connect } from 'mongoose'
import connectDB from './config/db.js'
import authRouter from './routes/authRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoute.js'
import { app, server } from './socket/socket.js'

dotenv.config()


const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'https://realtime-chat-app-echo-88sd.onrender.com',
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

server.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`)
})

app.get('/', (req,res) => {
    res.send('Hello World!')
})

