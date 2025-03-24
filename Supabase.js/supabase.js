
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';


dotenv.config();




console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_API:", process.env.SUPABASE_API);

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_API
export const supabase = createClient(supabaseUrl, supabaseKey)


// Listen to Supabase changes
