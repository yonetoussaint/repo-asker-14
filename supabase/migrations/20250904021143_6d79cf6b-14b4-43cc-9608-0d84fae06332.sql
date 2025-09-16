-- Associate all existing reels to seller iStore by setting their user_id to the iStore-linked profile
-- iStore profile (from earlier lookup): 6a01fb2e-9c7b-45b4-ab7f-9e2c058f54f3
-- Reels to associate: fb6eeb9b-c55d-4d7b-9378-cf496eb7c57c, 1c4d0529-c257-4903-99eb-255d9dfb6508, bdb20474-3a6f-4766-bc79-88f9c332a60a

update public.videos
set user_id = '6a01fb2e-9c7b-45b4-ab7f-9e2c058f54f3'
where id in (
  'fb6eeb9b-c55d-4d7b-9378-cf496eb7c57c',
  '1c4d0529-c257-4903-99eb-255d9dfb6508',
  'bdb20474-3a6f-4766-bc79-88f9c332a60a'
);