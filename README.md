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


## Changes and deployment checklist

### 1. Supabase database
1. Open Supabase Dashboard → SQL Editor.
2. Run the updated `supabase_schema.sql`. It adds `recipes.chef_type` safely with `IF NOT EXISTS` and keeps the existing tables.
3. Confirm the `recipe-media` Storage bucket exists and its policies are set up as described above.

### 2. Vercel environment variables
In Vercel → Project → Settings → Environment Variables, set these for Production (and Preview if needed):
- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable/anon key

Redeploy after changing environment variables. Never put the Supabase secret/service-role key in a `VITE_` variable or the frontend.

### 3. Fix email confirmation → Vercel login
In Supabase Dashboard → Authentication → URL Configuration:
- Set **Site URL** to your deployed Vercel origin, for example `https://your-project.vercel.app` (use your actual URL).
- Add that exact origin to **Redirect URLs**. If you use Vercel preview deployments, add only the specific preview URLs you need.
- Keep email confirmation enabled if you want confirmed email accounts. After clicking the email confirmation link, return to the site and log in with the same email/password. The signup code now requests a redirect to the current website origin.

If confirmation still returns to the wrong place, check the actual confirmation email URL and the Supabase URL Configuration; code cannot override a redirect URL that Supabase does not allow.

### 4. Likes, follows and chef pages
- Like/follow counts now come from Supabase rows, not hard-coded profile numbers.
- Likes/follows work for recipes and cooks that exist in Supabase. Built-in sample recipes use local numeric IDs and are demonstrations, so they cannot be saved as database likes until you seed them as real `recipes` rows.
- The Chefs menu contains Head Chef and Regional Home Chef cards. Their current photos are illustrative placeholders; replace them with actual, licensed chef photos before publishing.
- Create Post lets a signed-in user select `Head Chef`, `Home Chef` or `User`, and saves the corresponding hashtag. This is a self-selected label, not verified chef status.

### 5. Local build
From `frontend`, run `npm ci` then `npm run build`. The uploaded `node_modules` in the original archive was incomplete for this environment, so reinstall dependencies from the lockfile before building.
