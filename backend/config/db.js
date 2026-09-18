import mongoose from 'mongoose';

const buildConnectionOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  // In production, tlsAllowInvalidCertificates is strictly forbidden.
  // In development/test environments, default to true unless explicitly disabled
  // via ALLOW_INVALID_CERTS=false (handles environments where Node's root CA bundle
  // lacks newly issued root certificates such as Let's Encrypt Root YR).
  const allowInvalidCerts =
    !isProduction && process.env.ALLOW_INVALID_CERTS !== 'false';

  return allowInvalidCerts ? { tlsAllowInvalidCertificates: true } : {};
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, buildConnectionOptions());
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;