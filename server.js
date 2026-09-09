import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/db.js'
import quotationRoutes from './routes/quotationRoutes.js'

const app = express()
const port = process.env.PORT || 5000

// Clean allowed origins array
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean).map(url => url.replace(/\/$/, ''))

// Bulletproof CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Postman ya direct server-to-server calls ke paas origin header nahi hota
    if (!origin) return callback(null, true)
    
    // Agar origin list mein ho ya Vercel ka domain ho to allow karo
    const cleanOrigin = origin.replace(/\/$/, '')
    if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true)
    }
    
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

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