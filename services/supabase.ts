
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mndavacrbishhquhygwi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZGF2YWNyYmlzaGhxdWh5Z3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzI1NjQsImV4cCI6MjA4NTEwODU2NH0.u-M879SFtHys2nozTnFHfImlPRf47joaycjfLwKMs8I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
