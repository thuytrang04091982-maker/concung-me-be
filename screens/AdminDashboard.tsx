
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Users, CreditCard, Gift, Settings, RefreshCcw, X, MessageSquareQuote, Edit3, Save, Trash2, Shield, Wallet, Landmark, Phone, User as UserIcon, Lock } from 'lucide-react';
import { Screen, TransactionRecord, User, GiftItem, BankAccount } from '../types';
import { CloudAPI } from '../services/api';

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
  onApproveTransaction: (id: string) => void;
  onRejectTransaction: (id: string, reason: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onApproveTransaction, onRejectTransaction }) => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'TX' | 'USERS' | 'GIFTS'>('TX');
  const [isLoading, setIsLoading] = useState(false);
  
  const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean, txId: string }>({ isOpen: false, txId: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [editUserModal, setEditUserModal] = useState<{ isOpen: boolean, user: User | null, originalPhone: string }>({ isOpen: false, user: null, originalPhone: '' });

  const loadData = async () => {
    try {
      const [txs, usrs] = await Promise.all([
        CloudAPI.getTransactions(),
        CloudAPI.getUsers()
      ]);
      setTransactions(txs);
      setUsers(usrs);
    } catch (e) {
      console.error("Không thể kết nối Supabase");
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingTxs = transactions.filter(t => t.status === 'PENDING');

  const openRejectModal = (id: string) => {
    setRejectionModal({ isOpen: true, txId: id });
    setRejectReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) return;
    setIsLoading(true);
    await onRejectTransaction(rejectionModal.txId, rejectReason);
    setRejectionModal({ isOpen: false, txId: '' });
    await loadData();
    setIsLoading(false);
  };

  const openEditUser = (user: User) => {
    setEditUserModal({ isOpen: true, user: { ...user }, originalPhone: user.phone });
  };

  const handleSaveUserChanges = async () => {
    if (!editUserModal.user) return;
    setIsLoading(true);
    try {
      await CloudAPI.updateUser(editUserModal.user);
      setEditUserModal({ isOpen: false, user: null, originalPhone: '' });
      await loadData();
      alert('Đã cập nhật thông tin hội viên thành công!');
    } catch (e) {
      alert("Lỗi cập nhật Cloud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 w-full max-sm shadow-2xl animate-scale-up">
            <h3 className="text-lg font-bold text-red-500 mb-4">Lý do từ chối</h3>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 rounded-2xl outline-none text-sm"
              placeholder="Nhập lý do..."
            />
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setRejectionModal({ isOpen: false, txId: '' })} className="py-3 bg-slate-100 text-slate-500 rounded-xl font-bold">Hủy</button>
              <button disabled={isLoading} onClick={handleConfirmReject} className="py-3 bg-red-500 text-white rounded-xl font-bold">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {editUserModal.isOpen && editUserModal.user && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-slide-up overflow-y-auto">
          <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b sticky top-0 bg-white">
            <button onClick={() => setEditUserModal({ isOpen: false, user: null, originalPhone: '' })} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full"><ArrowLeft size={20}/></button>
            <button disabled={isLoading} onClick={handleSaveUserChanges} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Lưu Cloud</button>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400">Tên & Số dư</label>
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold" 
                value={editUserModal.user.name} 
                onChange={(e) => setEditUserModal({...editUserModal, user: {...editUserModal.user!, name: e.target.value}})}
              />
              <input 
                type="number"
                className="w-full p-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-xl" 
                value={editUserModal.user.balance} 
                onChange={(e) => setEditUserModal({...editUserModal, user: {...editUserModal.user!, balance: parseInt(e.target.value) || 0}})}
              />
              <label className="text-xs font-bold text-slate-400">Mật khẩu</label>
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl text-blue-600 font-mono" 
                value={editUserModal.user.password} 
                onChange={(e) => setEditUserModal({...editUserModal, user: {...editUserModal.user!, password: e.target.value}})}
              />
            </div>
          </div>
        </div>
      )}

      <div className="px-6 pt-12 pb-6 bg-slate-900 text-white sticky top-0 z-20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => onNavigate('PROFILE')} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full mr-4"><ArrowLeft size={20}/></button>
            <h2 className="text-xl font-bold">Admin Cloud</h2>
          </div>
          <button onClick={loadData} className="p-2 bg-white/10 rounded-full"><RefreshCcw size={18}/></button>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl">
          {['TX', 'USERS'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`flex-1 py-3 rounded-xl text-sm font-bold ${activeTab === id ? 'bg-white text-slate-900' : 'text-white/60'}`}>{id === 'TX' ? 'Duyệt lệnh' : 'Hội viên'}</button>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1">
        {activeTab === 'TX' ? (
          <div className="space-y-4">
            {pendingTxs.map(tx => (
              <div key={tx.id} className="bg-white p-5 rounded-[32px] shadow-sm border animate-fade-in">
                <p className="font-bold text-slate-800">{tx.userName} - {tx.amount.toLocaleString()}đ</p>
                <p className="text-xs text-slate-400 mb-4">{tx.type} | {tx.bankInfo}</p>
                <div className="flex space-x-3">
                  <button onClick={() => openRejectModal(tx.id)} className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl font-bold">Từ chối</button>
                  <button onClick={() => onApproveTransaction(tx.id)} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold">Duyệt</button>
                </div>
              </div>
            ))}
            {pendingTxs.length === 0 && <p className="text-center text-slate-400 italic">Không có lệnh chờ</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map(u => (
              <div key={u.phone} className="bg-white p-4 rounded-3xl flex items-center justify-between border">
                <div>
                  <p className="font-bold">{u.name}</p>
                  <p className="text-xs text-blue-600 font-bold">{u.balance.toLocaleString()}đ</p>
                </div>
                <button onClick={() => openEditUser(u)} className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Edit3 size={18}/></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
