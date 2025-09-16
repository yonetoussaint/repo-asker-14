-- Add some digital products for the seller
INSERT INTO products (name, description, price, discount_price, seller_id, product_type, tags, inventory, status, specifications, bundle_deals) VALUES
  (
    'Advanced JavaScript Mastery Course',
    'Master modern JavaScript with this comprehensive course covering ES6+, async programming, frameworks, and best practices. Includes 50+ hours of video content, exercises, and projects.',
    89.99,
    129.99,
    '7f4e937f-d215-4e86-a286-8cfa3e8b4525',
    'digital',
    ARRAY['education', 'programming', 'javascript', 'online-course'],
    999,
    'active',
    '[
      {
        "title": "Course Details",
        "icon": "📚",
        "items": [
          {"label": "Duration", "value": "50+ hours"},
          {"label": "Lessons", "value": "120 lessons"},
          {"label": "Level", "value": "Intermediate to Advanced"},
          {"label": "Language", "value": "English"},
          {"label": "Certificate", "value": "Yes"}
        ]
      }
    ]'::jsonb,
    '[
      {"min": 1, "max": null, "discount": 0}
    ]'::jsonb
  ),
  (
    'React Development Bootcamp',
    'Build modern web applications with React. Learn hooks, context, routing, state management, and deployment. Perfect for aspiring frontend developers.',
    79.99,
    99.99,
    '7f4e937f-d215-4e86-a286-8cfa3e8b4525',
    'digital',
    ARRAY['education', 'programming', 'react', 'frontend', 'online-course'],
    999,
    'active',
    '[
      {
        "title": "Course Details",
        "icon": "⚛️",
        "items": [
          {"label": "Duration", "value": "40+ hours"},
          {"label": "Projects", "value": "8 real projects"},
          {"label": "Level", "value": "Beginner to Intermediate"},
          {"label": "Updates", "value": "Lifetime"},
          {"label": "Support", "value": "Community access"}
        ]
      }
    ]'::jsonb,
    '[
      {"min": 1, "max": null, "discount": 0}
    ]'::jsonb
  ),
  (
    'Digital Marketing Strategy eBook',
    'Complete guide to digital marketing in 2024. Covers SEO, social media, content marketing, email campaigns, and analytics. 300+ pages of actionable insights.',
    24.99,
    39.99,
    '7f4e937f-d215-4e86-a286-8cfa3e8b4525',
    'digital',
    ARRAY['education', 'marketing', 'business', 'ebook'],
    999,
    'active',
    '[
      {
        "title": "eBook Details",
        "icon": "📖",
        "items": [
          {"label": "Pages", "value": "300+"},
          {"label": "Format", "value": "PDF, EPUB"},
          {"label": "Bonus", "value": "Templates included"},
          {"label": "Updates", "value": "Free lifetime updates"},
          {"label": "Language", "value": "English"}
        ]
      }
    ]'::jsonb,
    '[
      {"min": 1, "max": null, "discount": 0}
    ]'::jsonb
  ),
  (
    'Photoshop Design Templates Pack',
    'Professional design templates for social media, presentations, and marketing materials. Over 500 customizable templates for Instagram, Facebook, LinkedIn and more.',
    49.99,
    79.99,
    '7f4e937f-d215-4e86-a286-8cfa3e8b4525',
    'digital',
    ARRAY['design', 'templates', 'photoshop', 'graphics', 'social-media'],
    999,
    'active',
    '[
      {
        "title": "Template Pack",
        "icon": "🎨",
        "items": [
          {"label": "Templates", "value": "500+ designs"},
          {"label": "Formats", "value": "PSD, PNG, JPG"},
          {"label": "Categories", "value": "10+ niches"},
          {"label": "License", "value": "Commercial use"},
          {"label": "Software", "value": "Photoshop CS6+"}
        ]
      }
    ]'::jsonb,
    '[
      {"min": 1, "max": null, "discount": 0}
    ]'::jsonb
  ),
  (
    'Stock Photo Bundle - Nature Collection',
    'High-resolution nature photography collection with 1000+ stunning images. Perfect for websites, blogs, and commercial projects. All images are royalty-free.',
    34.99,
    59.99,
    '7f4e937f-d215-4e86-a286-8cfa3e8b4525',
    'digital',
    ARRAY['photography', 'stock-photos', 'nature', 'royalty-free'],
    999,
    'active',
    '[
      {
        "title": "Photo Collection",
        "icon": "📸",
        "items": [
          {"label": "Images", "value": "1000+ photos"},
          {"label": "Resolution", "value": "High-res (4K+)"},
          {"label": "License", "value": "Royalty-free"},
          {"label": "Format", "value": "JPG"},
          {"label": "Usage", "value": "Commercial allowed"}
        ]
      }
    ]'::jsonb,
    '[
      {"min": 1, "max": null, "discount": 0}
    ]'::jsonb
  ),
  (
    'Web Development Starter Kit',
    'Complete toolkit for web developers including HTML/CSS templates, JavaScript libraries, icons, and documentation. Everything you need to start building websites.',
    39.99,
    69.99,
    '7f4e937f-d215-4e86-a286-8cfa3e8b4525',
    'digital',
    ARRAY['web-development', 'templates', 'toolkit', 'html', 'css', 'javascript'],
    999,
    'active',
    '[
      {
        "title": "Starter Kit",
        "icon": "💻",
        "items": [
          {"label": "Templates", "value": "50+ HTML templates"},
          {"label": "Components", "value": "200+ UI components"},
          {"label": "Icons", "value": "1000+ SVG icons"},
          {"label": "Documentation", "value": "Complete guides"},
          {"label": "License", "value": "Commercial use"}
        ]
      }
    ]'::jsonb,
    '[
      {"min": 1, "max": null, "discount": 0}
    ]'::jsonb
  );