
import { createClient } from '@supabase/supabase-js';

// THÔNG TIN CẤU HÌNH SUPABASE THỰC TẾ
const supabaseUrl = 'https://wjukclszdpicoglmyhwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdWtjbHN6ZHBpY29nbG15aHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjMzMTAsImV4cCI6MjA4MjczOTMxMH0.INcnuy6mghD7o_mBZMd5xgKpRWrwbAj-1RyJuNIy7bU';

// Khởi tạo Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("✅ Hệ thống Mẹ & Bé đã kết nối tới Cloud Supabase.");
