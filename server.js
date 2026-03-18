import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/feedback', (req, res) => {
  res.sendFile(join(__dirname, 'feedback.html'));
});

app.get('/submissions', (req, res) => {
  res.sendFile(join(__dirname, 'submissions.html'));
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, phone, faculty, subject, message, inquiryType, newsletter, anonymous, rating } = req.body;

    if (!name || !email || !faculty || !subject || !message || !inquiryType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert([{
        name,
        email,
        phone: phone || null,
        faculty,
        subject,
        message,
        inquiry_type: inquiryType,
        newsletter: newsletter || false,
        anonymous: anonymous || false,
        rating: parseInt(rating) || 7,
        ip_address: req.ip,
        user_agent: req.get('user-agent')
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save feedback' });
    }

    res.json({ success: true, id: data[0]?.id });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch submissions' });
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/submissions/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch submissions' });
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Main page: http://localhost:${PORT}`);
  console.log(`Feedback form: http://localhost:${PORT}/feedback`);
  console.log(`Submissions: http://localhost:${PORT}/submissions`);
});
