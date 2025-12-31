
import { User, TransactionRecord, AppNotification, BankAccount } from '../types';
import { supabase } from '../lib/supabase';

const checkSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase chưa được kết nối.");
  }
};

export const CloudAPI = {
  // --- USER API ---
  async getUsers(): Promise<User[]> {
    checkSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) {
        console.error("CloudAPI getUsers error:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
    return data || [];
  },

  async createUser(user: User) {
    checkSupabase();
    
    // Tạo payload chuẩn xác để tránh lỗi Schema
    const payload = {
        name: user.name,
        phone: user.phone,
        balance: user.balance || 0,
        avatar: user.avatar,
        password: user.password,
        banks: user.banks || [],
        isAdmin: user.isAdmin || false
    };
    
    const { error } = await supabase
      .from('users')
      .insert([payload]);
      
    if (error) {
        console.error("CloudAPI createUser detailed error:", JSON.stringify(error, null, 2));
        
        let msg = error.message;
        if (error.details) msg += ` (Chi tiết: ${error.details})`;
        if (error.hint) msg += ` (Gợi ý: ${error.hint})`;
        
        throw new Error(msg);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const phone = localStorage.getItem('mb_session_phone');
    if (!phone || !supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();
      
      if (error) {
          localStorage.removeItem('mb_session_phone');
          return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  },

  async updateUser(user: User) {
    checkSupabase();
    const { error } = await supabase
      .from('users')
      .update({
        name: user.name,
        balance: user.balance,
        avatar: user.avatar,
        password: user.password,
        banks: user.banks || [],
        isAdmin: user.isAdmin
      })
      .eq('phone', user.phone);
    if (error) {
        console.error("CloudAPI updateUser error:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
  },

  // --- TRANSACTION API ---
  async getTransactions(): Promise<TransactionRecord[]> {
    checkSupabase();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) {
        console.error("CloudAPI getTransactions error:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
    return data || [];
  },

  async createTransaction(tx: TransactionRecord) {
    checkSupabase();
    const { error } = await supabase
      .from('transactions')
      .insert([tx]);
    if (error) {
        console.error("CloudAPI createTransaction error:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
  },

  async updateTransaction(tx: TransactionRecord) {
    checkSupabase();
    const { error } = await supabase
      .from('transactions')
      .update({
        status: tx.status,
        rejectionReason: tx.rejectionReason
      })
      .eq('id', tx.id);
    if (error) {
        console.error("CloudAPI updateTransaction error:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
  },

  // --- NOTIFICATION API ---
  async getNotifications(phone: string): Promise<AppNotification[]> {
    checkSupabase();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('phone', phone)
      .order('timestamp', { ascending: false });
    if (error) {
        console.error("CloudAPI getNotifications error:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
    return data || [];
  },

  async addNotification(phone: string, notif: AppNotification) {
    checkSupabase();
    const { error } = await supabase
      .from('notifications')
      .insert([{
        id: notif.id,
        phone: phone,
        title: notif.title,
        content: notif.content,
        timestamp: notif.timestamp,
        type: notif.type,
        isRead: notif.isRead
      }]);
    if (error) {
        console.error("CloudAPI addNotification error:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
  },

  async markNotifsAsRead(phone: string) {
    checkSupabase();
    const { error } = await supabase
      .from('notifications')
      .update({ isRead: true })
      .eq('phone', phone);
    if (error) {
        console.error("CloudAPI markNotifsAsRead error:", JSON.stringify(error, null, 2));
    }
  }
};
