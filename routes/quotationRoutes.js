import { Router } from 'express'
import { createQuotation, listQuotations } from '../controllers/quotationController.js'

const router = Router()

router.post('/', createQuotation)
router.get('/', listQuotations)

export default router
