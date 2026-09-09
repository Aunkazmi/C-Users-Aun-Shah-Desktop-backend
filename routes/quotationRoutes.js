import express from 'express'
import { createQuotation } from '../controllers/quotationController.js' // Apne controller ka path verify kar lein

const router = express.Router()

// Explicitly handle preflight OPTIONS for this route
router.options('/', (req, res) => {
  res.sendStatus(200)
})

router.post('/', createQuotation)

export default router