# FlavorShare 6 — Supabase build

## Frontend
cd frontend
npm install
copy .env.example .env.local
# put your Supabase Project URL and Publishable key in .env.local
npm run dev

## Backend (optional health/API server)
cd backend
npm install
copy .env.example .env
npm start

The React app stores authentication, recipes, images/videos, follows, likes and comments in Supabase. Recipe media is uploaded to the `recipe-media` Storage bucket; do not use localStorage for recipe media.

## Supabase
Run `supabase_schema.sql` in SQL Editor. Create a Storage bucket named `recipe-media` (public for this prototype). Add Storage policies allowing authenticated users to upload/delete objects under their own `<user_id>/...` folder.
