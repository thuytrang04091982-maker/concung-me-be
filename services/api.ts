
import { User, TransactionRecord, AppNotification, BankAccount } from '../types';

// MÔ PHỎNG DATABASE ĐÁM MÂY (Cloud Simulation)
// Để biến thành Real Database, bạn chỉ cần thay thế logic fetch/storage bằng Supabase/Firebase SDK.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CloudAPI = {
  // --- USER API ---
  async getUsers(): Promise<User[]> {
    await delay(500); // Giả lập độ trễ mạng
    return JSON.parse(localStorage.getItem('mb_users') || '[]');
  },

  async saveUsers(users: User[]) {
    await delay(300);
    localStorage.setItem('mb_users', JSON.stringify(users));
  },

  async getCurrentUser(): Promise<User | null> {
    const user = localStorage.getItem('mb_current_user');
    return user ? JSON.parse(user) : null;
  },

  async updateUser(user: User) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.phone === user.phone);
    if (index !== -1) {
      users[index] = user;
      await this.saveUsers(users);
      // Nếu là user đang đăng nhập, cập nhật luôn session
      const current = await this.getCurrentUser();
      if (current && current.phone === user.phone) {
        localStorage.setItem('mb_current_user', JSON.stringify(user));
      }
    }
  },

  // --- TRANSACTION API ---
  async getTransactions(): Promise<TransactionRecord[]> {
    await delay(400);
    return JSON.parse(localStorage.getItem('mb_all_transactions') || '[]');
  },

  async createTransaction(tx: TransactionRecord) {
    const txs = await this.getTransactions();
    txs.push(tx);
    localStorage.setItem('mb_all_transactions', JSON.stringify(txs));
  },

  async updateTransaction(tx: TransactionRecord) {
    const txs = await this.getTransactions();
    const index = txs.findIndex(t => t.id === tx.id);
    if (index !== -1) {
      txs[index] = tx;
      localStorage.setItem('mb_all_transactions', JSON.stringify(txs));
    }
  },

  // --- NOTIFICATION API ---
  async getNotifications(phone: string): Promise<AppNotification[]> {
    await delay(300);
    return JSON.parse(localStorage.getItem(`mb_notifs_${phone}`) || '[]');
  },

  async addNotification(phone: string, notif: AppNotification) {
    const notifs = await this.getNotifications(phone);
    notifs.push(notif);
    localStorage.setItem(`mb_notifs_${phone}`, JSON.stringify(notifs));
  }
};
