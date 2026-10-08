import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zehgkgjksqnqtimdjnoy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaGdrZ2prc3FucXRpbWRqbm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MDc2NTEsImV4cCI6MjEwNjk4MzY1MX0.Lzz6LtzGQdD4NuB-Hkj2wplgiUAWeU9n4ToeAIwGc2A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)