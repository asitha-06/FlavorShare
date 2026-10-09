import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app=express(); const PORT=process.env.PORT||5000;
app.use(cors({origin:true,credentials:true})); app.use(express.json({limit:"1mb"}));
app.get("/",(_,res)=>res.json({message:"FlavorShare API is running",status:"ok",storage:"Supabase"}));
app.get("/api/health",(_,res)=>res.json({ok:true,time:new Date().toISOString()}));
app.get("/api/config",(_,res)=>res.json({supabaseConfigured:Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SECRET_KEY)}));
app.post("/api/posts",(req,res)=>res.status(400).json({message:"Posts are now saved by the React app directly to Supabase so user authentication and RLS are enforced."}));
app.listen(PORT,()=>console.log(`FlavorShare API running at http://localhost:${PORT}`));
