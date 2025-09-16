-- Update Q&A data with more realistic names and seller verification
UPDATE public.questions_answers 
SET 
  asked_by = CASE 
    WHEN id = (SELECT id FROM questions_answers WHERE question LIKE 'Does this product work with iPhone%' LIMIT 1) THEN 'Jean-Baptiste Moïse'
    WHEN id = (SELECT id FROM questions_answers WHERE question LIKE 'What''s the battery life%' LIMIT 1) THEN 'Marie-Claire Augustin'
    WHEN id = (SELECT id FROM questions_answers WHERE question LIKE 'Is it waterproof%' LIMIT 1) THEN 'Frantz Desmarais'
    WHEN id = (SELECT id FROM questions_answers WHERE question LIKE 'How long does shipping%' LIMIT 1) THEN 'Stephanie Joseph'
    WHEN id = (SELECT id FROM questions_answers WHERE question LIKE 'Can I return this%' LIMIT 1) THEN 'Ricardo Jean-Louis'
    ELSE asked_by
  END,
  answered_by = CASE 
    WHEN answer IS NOT NULL THEN 'Mima'
    ELSE answered_by
  END
WHERE product_id = '3e9c277d-4cdd-44a5-8c04-9f66dccd52df';

-- Insert a few more realistic Q&A entries
INSERT INTO public.questions_answers (product_id, question, answer, asked_by, answered_by, ask_date, answer_date, helpful_count, question_likes) VALUES
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Est-ce que ce produit fonctionne vraiment pour faire pousser la barbe?', 'Oui, absolument! L''huile BABLI contient des ingrédients naturels comme l''huile de ricin et de jojoba qui stimulent vraiment la croissance. Vous devriez voir des résultats après 2-3 semaines d''utilisation régulière.', 'Pierre-Louis Delva', 'Mima', '2024-03-16 10:30:00+00', '2024-03-16 14:20:00+00', 31, 14),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Combien de temps dure une bouteille?', 'Une bouteille de 50ml dure environ 2-3 mois avec une utilisation quotidienne. Quelques gouttes suffisent à chaque application.', 'Widelyne Beauvoir', 'Mima', '2024-03-17 08:15:00+00', '2024-03-17 11:45:00+00', 19, 8),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Y a-t-il des effets secondaires?', NULL, 'James Casimir', NULL, '2024-03-18 16:20:00+00', NULL, 0, 5),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Puis-je utiliser ce produit sur une peau sensible?', 'Oui, notre formule est 100% naturelle et convient aux peaux sensibles. Cependant, je recommande de faire un test sur une petite zone avant la première utilisation.', 'Evens Belizaire', 'Mima', '2024-03-19 12:00:00+00', '2024-03-19 15:30:00+00', 23, 11);