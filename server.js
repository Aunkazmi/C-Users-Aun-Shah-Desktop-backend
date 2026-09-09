import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000

// Pure open CORS configuration
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Handlers for /api/quotations directly inline
app.options('/api/quotations', (req, res) => {
  res.sendStatus(200)
})

app.post('/api/quotations', (req, res) => {
  console.log('Form data received:', req.body)
  res.status(201).json({ success: true, message: 'Direct quotation route working!' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running directly on port ${port}`)
})