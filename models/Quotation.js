import mongoose from 'mongoose'

const quotationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    teamSize: {
      type: String,
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    selectedDeliverables: {
      type: [String],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'Select at least one deliverable.',
      },
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

export default mongoose.model('Quotation', quotationSchema)
