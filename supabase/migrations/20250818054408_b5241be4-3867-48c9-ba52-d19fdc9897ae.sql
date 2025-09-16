-- Create questions_answers table for product Q&As
CREATE TABLE public.questions_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  asked_by TEXT NOT NULL,
  answered_by TEXT,
  ask_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answer_date TIMESTAMP WITH TIME ZONE,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  question_likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for questions_answers
CREATE POLICY "Anyone can view questions and answers" 
ON public.questions_answers 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create questions" 
ON public.questions_answers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update questions and answers" 
ON public.questions_answers 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_questions_answers_updated_at
BEFORE UPDATE ON public.questions_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Q&A data
INSERT INTO public.questions_answers (product_id, question, answer, asked_by, answered_by, ask_date, answer_date, helpful_count, question_likes) VALUES
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Does this product work with iPhone 15 Pro Max?', 'Yes, this product is fully compatible with iPhone 15 Pro Max and all recent iPhone models. I''ve been using it with my 15 Pro Max for 2 months with no issues.', 'Alex Thompson', 'Seller', '2024-03-10 00:00:00+00', '2024-03-11 00:00:00+00', 24, 8),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'What''s the battery life like?', 'Battery life is excellent! I get about 8-10 hours of continuous use, and standby time is around 2-3 days depending on usage.', 'Mike Chen', 'Seller', '2024-03-08 00:00:00+00', '2024-03-09 00:00:00+00', 18, 12),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Is it waterproof or just water-resistant?', NULL, 'Emma Wilson', NULL, '2024-03-15 00:00:00+00', NULL, 0, 3),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'How long does shipping usually take?', 'Shipping typically takes 3-5 business days for standard delivery, or 1-2 days for express shipping.', 'Sarah Johnson', 'Seller', '2024-03-12 00:00:00+00', '2024-03-12 12:00:00+00', 15, 6),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Can I return this if it doesn''t work for me?', 'Yes, we offer a 30-day return policy for all products. Just make sure the item is in original condition.', 'David Rodriguez', 'Seller', '2024-03-14 00:00:00+00', '2024-03-14 15:30:00+00', 22, 9);