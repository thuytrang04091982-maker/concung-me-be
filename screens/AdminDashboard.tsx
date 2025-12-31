
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Users, CreditCard, Gift, Settings, RefreshCcw, X, MessageSquareQuote, Edit3, Save, Trash2, Shield, Wallet, Landmark, Phone, User as UserIcon, Lock, Search } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'TX' | 'USERS'>('TX');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean, txId: string }>({ isOpen: false, txId: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [editUserModal, setEditUserModal] = useState<{ isOpen: boolean, user: User | null }>({ isOpen: false, user: null });

  const loadData = async () => {
    try {
      const [txs, usrs] = await Promise.all([
        CloudAPI.getTransactions(),
        CloudAPI.getUsers()
      ]);
      setTransactions(txs);
      setUsers(usrs);
    } catch (e) {
      console.error("Lỗi đồng bộ Admin Cloud");
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingTxs = transactions.filter(t => t.status === 'PENDING');
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm)
  );

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) return;
    setIsLoading(true);
    await onRejectTransaction(rejectionModal.txId, rejectReason);
    setRejectionModal({ isOpen: false, txId: '' });
    await loadData();
    setIsLoading(false);
  };

  const handleSaveUserChanges = async () => {
    if (!editUserModal.user) return;
    setIsLoading(true);
    try {
      await CloudAPI.updateUser(editUserModal.user);
      setEditUserModal({ isOpen: false, user: null });
      await loadData();
      alert('Cập nhật Cloud thành công!');
    } catch (e) {
      alert("Lỗi lưu Cloud. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 w-full max-sm shadow-2xl">
            <h3 className="text-lg font-bold text-red-500 mb-4">Lý do từ chối</h3>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 rounded-2xl outline-none text-sm border focus:border-red-200"
              placeholder="Nhập lý do gửi cho khách hàng..."
            />
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setRejectionModal({ isOpen: false, txId: '' })} className="py-3 bg-slate-100 text-slate-500 rounded-xl font-bold">Hủy</button>
              <button disabled={isLoading} onClick={handleConfirmReject} className="py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserModal.isOpen && editUserModal.user && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-slide-up">
          <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b sticky top-0 bg-white z-10">
            <button onClick={() => setEditUserModal({ isOpen: false, user: null })} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full"><ArrowLeft size={20}/></button>
            <h3 className="font-bold">Sửa hội viên</h3>
            <button disabled={isLoading} onClick={handleSaveUserChanges} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">Lưu</button>
          </div>
          <div className="p-6 space-y-6 overflow-y-auto pb-10">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tên khách hàng</label>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1" 
                  value={editUserModal.user.name} 
                  onChange={(e) => setEditUserModal({...editUserModal, user: {...editUserModal.user!, name: e.target.value}})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Số dư hiện có (đ)</label>
                <input 
                  type="number"
                  className="w-full p-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-2xl mt-1" 
                  value={editUserModal.user.balance} 
                  onChange={(e) => setEditUserModal({...editUserModal, user: {...editUserModal.user!, balance: parseInt(e.target.value) || 0}})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Mật khẩu</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-slate-700 font-mono" 
                    value={editUserModal.user.password} 
                    onChange={(e) => setEditUserModal({...editUserModal, user: {...editUserModal.user!, password: e.target.value}})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-600">Quyền Admin</span>
                <input 
                  type="checkbox" 
                  checked={editUserModal.user.isAdmin} 
                  onChange={(e) => setEditUserModal({...editUserModal, user: {...editUserModal.user!, isAdmin: e.target.checked}})}
                  className="w-6 h-6 accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-slate-900 text-white sticky top-0 z-20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => onNavigate('PROFILE')} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full mr-4"><ArrowLeft size={20}/></button>
            <div>
              <h2 className="text-xl font-bold">Admin Cloud</h2>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Hệ thống mượt mà</span>
              </div>
            </div>
          </div>
          <button onClick={loadData} className="p-2 bg-white/10 rounded-full active:rotate-180 transition-transform"><RefreshCcw size={18}/></button>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl">
          {['TX', 'USERS'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === id ? 'bg-white text-slate-900' : 'text-white/60'}`}>
              {id === 'TX' ? `Lệnh chờ (${pendingTxs.length})` : 'Hội viên'}
            </button>
          ))}
        </div>
      </div>

      {/* Search for Users tab */}
      {activeTab === 'USERS' && (
        <div className="px-6 py-4 bg-white border-b sticky top-[168px] z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Tìm tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none border focus:border-blue-200"
            />
          </div>
        </div>
      )}

      <div className="p-6 flex-1 pb-24">
        {activeTab === 'TX' ? (
          <div className="space-y-4">
            {pendingTxs.map(tx => (
              <div key={tx.id} className="bg-white p-5 rounded-[32px] shadow-sm border animate-fade-in">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-slate-800 text-lg">{tx.userName}</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${tx.type === 'DEPOSIT' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {tx.type === 'DEPOSIT' ? 'NẠP TIỀN' : 'RÚT TIỀN'}
                  </span>
                </div>
                <p className="text-xl font-black text-slate-900 mb-1">{tx.amount.toLocaleString()}đ</p>
                <div className="bg-slate-50 p-3 rounded-xl mb-4">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Ngân hàng thụ hưởng</p>
                  <p className="text-xs text-slate-600 font-medium">{tx.bankInfo}</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setRejectionModal({ isOpen: true, txId: tx.id })} className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm active:scale-95 transition-transform">Từ chối</button>
                  <button onClick={() => onApproveTransaction(tx.id)} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 active:scale-95 transition-transform">Duyệt lệnh</button>
                </div>
              </div>
            ))}
            {pendingTxs.length === 0 && (
              <div className="py-20 text-center opacity-30">
                <CheckCircle size={48} className="mx-auto mb-2"/>
                <p className="font-bold">Đã duyệt hết lệnh!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map(u => (
              <div key={u.phone} className="bg-white p-4 rounded-3xl flex items-center justify-between border shadow-sm group active:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={u.avatar} className="w-10 h-10 rounded-full bg-slate-100" />
                  <div>
                    <p className="font-bold text-slate-800">{u.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{u.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-600">{u.balance.toLocaleString()}đ</p>
                    {u.isAdmin && <span className="text-[8px] bg-slate-900 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">Admin</span>}
                  </div>
                  <button onClick={() => setEditUserModal({ isOpen: true, user: { ...u } })} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Edit3 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
