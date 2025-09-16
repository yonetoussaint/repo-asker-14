-- Update existing products to be current flash deals
UPDATE products 
SET 
  flash_deal = true,
  flash_start_time = NOW(),
  tags = CASE 
    WHEN 'flash-deals' = ANY(tags) THEN tags
    ELSE array_append(COALESCE(tags, ARRAY[]::text[]), 'flash-deals')
  END
WHERE id IN (
  'ea4313bd-c64d-4787-8945-e509afe0fecd',
  'd1ce99b2-5804-4347-8766-cb3f4e3944ab', 
  '2edeac89-8be1-4009-97bb-143669c567de',
  'a4c43dec-9232-4b48-a986-7662c32cb6fd',
  '9d128524-c4d4-4d6a-9cde-71e80ae268d9',
  'aae97882-a3a1-4db5-b4f5-156705cd10ee'
);

-- Also call the auto flash deals function to create more variety
SELECT auto_select_flash_deals();