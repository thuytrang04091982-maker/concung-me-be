
export type Screen = 
  | 'WELCOME' 
  | 'REGISTER' 
  | 'LOGIN' 
  | 'HOME' 
  | 'GIFTS' 
  | 'PROFILE' 
  | 'BANKING' 
  | 'SECURITY'
  | 'TRANSACTION'
  | 'NOTIFICATIONS'
  | 'ADMIN_DASHBOARD';

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'PENDING';
  isRead: boolean;
}

export interface TransactionRecord {
  id: string;
  userPhone: string;
  userName: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  bankInfo: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  timestamp: number;
}

export interface User {
  name: string;
  phone: string;
  balance: number;
  avatar: string;
  password?: string;
  banks: BankAccount[];
  isAdmin?: boolean;
}

export interface GiftItem {
  id: string;
  name: string;
  image: string;
  price: number;
}
