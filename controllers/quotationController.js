import Quotation from '../models/Quotation.js'
import { sendQuotationConfirmation } from '../config/mailer.js'

export async function createQuotation(req, res) {
  try {
    const quotation = await Quotation.create(req.body)
    let emailSent = false

    try {
      emailSent = await sendQuotationConfirmation(quotation)
    } catch (emailError) {
      console.error('Quotation email error:', emailError)
    }

    res.status(201).json({
      message: 'Quotation request received.',
      quotation,
      emailSent,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Please provide all required quotation details.',
        errors: Object.values(error.errors).map((item) => item.message),
      })
    }

    console.error('Create quotation error:', error)
    return res.status(500).json({ message: 'Unable to save quotation request.' })
  }
}

export async function listQuotations(req, res) {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 })
    return res.json({ quotations })
  } catch (error) {
    console.error('List quotations error:', error)
    return res.status(500).json({ message: 'Unable to load quotation requests.' })
  }
}
