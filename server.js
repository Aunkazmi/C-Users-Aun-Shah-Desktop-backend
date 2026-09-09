import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/db.js'
import quotationRoutes from './routes/quotationRoutes.js'

const app = express()
const port = process.env.PORT || 5000

// Allowed origins list
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean).map(url => url.replace(/\/$/, '')) // Remove trailing slashes

const corsOptions = {
  origin: (origin, callback) => {
    // Postman / Mobile apps / Same-origin Requests send no 'origin'
    if (!origin) return callback(null, true)

    const normalizedOrigin = origin.replace(/\/$/, '')
    
    // Check exact match or Vercel preview deployment match (*.vercel.app)
    const isAllowed = allowedOrigins.includes(normalizedOrigin) || 
                      /\.vercel\.app$/.test(normalizedOrigin)

    if (isAllowed) {
      return callback(null, true)
    }

    console.error(`CORS Blocked Origin: ${origin}`)
    return callback(new Error('Origin is not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

// Apply CORS Middleware
app.use(cors(corsOptions))
app.options('*', cors(corsOptions)) // Enable pre-flight for all routes

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