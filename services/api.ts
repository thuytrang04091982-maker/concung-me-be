
import { User, TransactionRecord, AppNotification, BankAccount } from '../types';
import { supabase } from '../lib/supabase';

const checkSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase chưa được kết nối. Mẹ vui lòng kiểm tra lại cấu hình URL!");
  }
};

export const CloudAPI = {
  // --- USER API ---
  async getUsers(): Promise<User[]> {
    checkSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async createUser(user: User) {
    checkSupabase();
    const { error } = await supabase
      .from('users')
      .insert([user]);
    if (error) throw error;
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
        banks: user.banks,
        isAdmin: user.isAdmin
      })
      .eq('phone', user.phone);
    if (error) throw error;
  },

  // --- TRANSACTION API ---
  async getTransactions(): Promise<TransactionRecord[]> {
    checkSupabase();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createTransaction(tx: TransactionRecord) {
    checkSupabase();
    const { error } = await supabase
      .from('transactions')
      .insert([tx]);
    if (error) throw error;
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
    if (error) throw error;
  },

  // --- NOTIFICATION API ---
  async getNotifications(phone: string): Promise<AppNotification[]> {
    checkSupabase();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('phone', phone)
      .order('timestamp', { ascending: false });
    if (error) throw error;
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
    if (error) throw error;
  },

  async markNotifsAsRead(phone: string) {
    checkSupabase();
    await supabase
      .from('notifications')
      .update({ isRead: true })
      .eq('phone', phone);
  }
};
