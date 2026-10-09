
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const userId = process.env.USER_ID;

if (!supabaseUrl || !secretKey || !userId) {
  console.error("Missing SUPABASE_URL, SUPABASE_SECRET_KEY, or USER_ID in backend/.env");
  process.exit(1);
}

const response = await fetch(
  `${supabaseUrl}/auth/v1/admin/users/${userId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "apikey": secretKey,
      "Authorization": `Bearer ${secretKey}`,
    },
    body: JSON.stringify({ email_confirm: true }),
  }
);

const result = await response.json();

if (!response.ok) {
  console.error("Confirmation failed:", result.msg || result.message || JSON.stringify(result));
  process.exit(1);
}

console.log("Email confirmed successfully for:", result.email);
