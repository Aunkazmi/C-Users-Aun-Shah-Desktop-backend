import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/db.js'
import quotationRoutes from './routes/quotationRoutes.js'

const app = express()
const port = process.env.PORT || 5000

// 1. Simple & Working CORS Setup
app.use(cors())

// 2. Request Body Parser
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// API Routes
app.use('/api/quotations', quotationRoutes)

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Unhandled server error:', error)
  res.status(500).json({ message: error.message || 'Internal server error.' })
})

// Database & Server Initialization
connectDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Backend listening on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed:', error)
    process.exit(1)
  })