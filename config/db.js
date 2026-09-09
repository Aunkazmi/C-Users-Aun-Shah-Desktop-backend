import mongoose from 'mongoose'

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    console.warn('MONGODB_URI is not configured. Running without database persistence.')
    return
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}
