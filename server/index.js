import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: 'supabase' });
});

// Example placeholder route
app.get('/api/example', (_req, res) => {
  res.json({ message: 'API is working with Supabase backend' });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log('Using Supabase as database - no MongoDB connection needed');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});