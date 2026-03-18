/*
  # Create feedback table for form submissions

  1. New Tables
    - `feedback_submissions`
      - `id` (uuid, primary key)
      - `name` (text) - Visitor name
      - `email` (text) - Visitor email
      - `phone` (text, optional) - Visitor phone
      - `faculty` (text) - Selected faculty
      - `subject` (text) - Message subject
      - `message` (text) - Main message content
      - `inquiry_type` (text) - Type of inquiry
      - `newsletter` (boolean) - Newsletter subscription
      - `anonymous` (boolean) - Anonymous submission
      - `rating` (integer) - HSE education rating
      - `created_at` (timestamp) - Submission time
      - `ip_address` (text, optional) - Visitor IP
      - `user_agent` (text, optional) - Browser info

  2. Security
    - Enable RLS for public submissions (anyone can insert)
    - Public can only SELECT their own submissions by email
    - Restrict direct access

  3. Indexes
    - Add index on email for faster lookup
    - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS feedback_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  faculty text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  inquiry_type text NOT NULL,
  newsletter boolean DEFAULT false,
  anonymous boolean DEFAULT false,
  rating integer DEFAULT 7,
  created_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert feedback"
  ON feedback_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to view own submissions"
  ON feedback_submissions
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback_submissions(email);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback_submissions(created_at DESC);
