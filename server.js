import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/db.js'
import quotationRoutes from './routes/quotationRoutes.js'

const app = express()
const port = process.env.PORT || 5000
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  frontendUrl,
  frontendUrl.startsWith('http') ? frontendUrl : `https://${frontendUrl}`,
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Origin is not allowed by CORS'))
  },
}))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/quotations', quotationRoutes)

app.use((error, req, res, next) => {
  console.error('Unhandled server error:', error)
  res.status(500).json({ message: 'Internal server error.' })
})

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
