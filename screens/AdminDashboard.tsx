
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Users, CreditCard, Gift, Settings, RefreshCcw, X, MessageSquareQuote, Edit3, Save, Trash2, Shield, Wallet, Landmark, Phone, User as UserIcon, Lock } from 'lucide-react';
import { Screen, TransactionRecord, User, GiftItem, BankAccount } from '../types';

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
  onApproveTransaction: (id: string) => void;
  onRejectTransaction: (id: string, reason: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onApproveTransaction, onRejectTransaction }) => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'TX' | 'USERS' | 'GIFTS'>('TX');
  
  // States cho modal từ chối
  const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean, txId: string }>({ isOpen: false, txId: '' });
  const [rejectReason, setRejectReason] = useState('');

  // States cho modal chỉnh sửa User
  const [editUserModal, setEditUserModal] = useState<{ isOpen: boolean, user: User | null, originalPhone: string }>({ isOpen: false, user: null, originalPhone: '' });

  const loadData = () => {
    const txs = JSON.parse(localStorage.getItem('mb_all_transactions') || '[]');
    const usrs = JSON.parse(localStorage.getItem('mb_users') || '[]');
    setTransactions(txs);
    setUsers(usrs);
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

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return;
    onRejectTransaction(rejectionModal.txId, rejectReason);
    setRejectionModal({ isOpen: false, txId: '' });
    loadData();
  };

  const openEditUser = (user: User) => {
    setEditUserModal({ isOpen: true, user: { ...user }, originalPhone: user.phone });
  };

  const handleUpdateUserField = (field: keyof User, value: any) => {
    if (editUserModal.user) {
      setEditUserModal({
        ...editUserModal,
        user: { ...editUserModal.user, [field]: value }
      });
    }
  };

  const handleUpdateBankField = (index: number, field: keyof BankAccount, value: string) => {
    if (editUserModal.user) {
      const newBanks = [...editUserModal.user.banks];
      newBanks[index] = { ...newBanks[index], [field]: value };
      handleUpdateUserField('banks', newBanks);
    }
  };

  const removeBank = (index: number) => {
    if (editUserModal.user) {
      const newBanks = editUserModal.user.banks.filter((_, i) => i !== index);
      handleUpdateUserField('banks', newBanks);
    }
  };

  const handleSaveUserChanges = () => {
    if (!editUserModal.user) return;
    
    const allUsers: User[] = JSON.parse(localStorage.getItem('mb_users') || '[]');
    const userIdx = allUsers.findIndex(u => u.phone === editUserModal.originalPhone);
    
    if (userIdx !== -1) {
      const updatedUser = editUserModal.user;
      
      // Nếu đổi SĐT, cần cập nhật các khóa liên quan
      if (updatedUser.phone !== editUserModal.originalPhone) {
        // Cập nhật thông báo
        const notifs = localStorage.getItem(`mb_notifs_${editUserModal.originalPhone}`);
        if (notifs) {
          localStorage.setItem(`mb_notifs_${updatedUser.phone}`, notifs);
          localStorage.removeItem(`mb_notifs_${editUserModal.originalPhone}`);
        }
        
        // Cập nhật lịch sử giao dịch toàn cục
        const allTxs: TransactionRecord[] = JSON.parse(localStorage.getItem('mb_all_transactions') || '[]');
        const updatedTxs = allTxs.map(tx => tx.userPhone === editUserModal.originalPhone ? { ...tx, userPhone: updatedUser.phone } : tx);
        localStorage.setItem('mb_all_transactions', JSON.stringify(updatedTxs));
      }

      allUsers[userIdx] = updatedUser;
      localStorage.setItem('mb_users', JSON.stringify(allUsers));

      // Nếu đang sửa chính mình (Admin), cập nhật current_user
      const currentUser = JSON.parse(localStorage.getItem('mb_current_user') || '{}');
      if (currentUser.phone === editUserModal.originalPhone) {
        localStorage.setItem('mb_current_user', JSON.stringify(updatedUser));
      }

      setEditUserModal({ isOpen: false, user: null, originalPhone: '' });
      loadData();
      alert('Đã cập nhật thông tin hội viên thành công!');
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl animate-scale-up border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2 text-red-500">
                <MessageSquareQuote size={20} />
                <h3 className="text-lg font-bold">Lý do từ chối</h3>
              </div>
              <button onClick={() => setRejectionModal({ isOpen: false, txId: '' })} className="p-2 text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <textarea 
              autoFocus
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Thông tin ngân hàng không chính xác, Số dư không hợp lệ..."
              className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-200 outline-none text-sm text-slate-700 resize-none transition-all"
            />
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setRejectionModal({ isOpen: false, txId: '' })} className="py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm">Hủy</button>
              <button disabled={!rejectReason.trim()} onClick={handleConfirmReject} className="py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-200 disabled:opacity-50">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserModal.isOpen && editUserModal.user && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-slide-up overflow-y-auto">
          <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white z-10">
            <div className="flex items-center">
              <button onClick={() => setEditUserModal({ isOpen: false, user: null, originalPhone: '' })} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full mr-4">
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              <h2 className="text-lg font-bold text-slate-800">Quản lý hội viên</h2>
            </div>
            <button onClick={handleSaveUserChanges} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center space-x-2">
              <Save size={16} />
              <span>Lưu thay đổi</span>
            </button>
          </div>

          <div className="p-6 space-y-8 pb-12">
            {/* Header: Avatar & Basic */}
            <div className="flex flex-col items-center py-4">
                <div className="relative">
                    <img src={editUserModal.user.avatar} className="w-24 h-24 rounded-full border-4 border-slate-50" />
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                        <Edit3 size={14} />
                    </button>
                </div>
                <h3 className="mt-4 font-bold text-slate-800 text-lg">{editUserModal.user.name}</h3>
                <p className="text-slate-400 text-sm italic">ID: {editUserModal.originalPhone}</p>
            </div>

            {/* Section: Account Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                <Shield size={14} />
                <span>Thông tin tài khoản</span>
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold ml-1">Họ và tên</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      value={editUserModal.user.name}
                      onChange={(e) => handleUpdateUserField('name', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold ml-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      value={editUserModal.user.phone}
                      onChange={(e) => handleUpdateUserField('phone', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold ml-1">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text"
                      value={editUserModal.user.password || ''}
                      onChange={(e) => handleUpdateUserField('password', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-medium text-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Finance */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                <Wallet size={14} />
                <span>Tài chính & Ví</span>
              </h4>
              <div className="p-5 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-100">
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider">Số dư khả dụng</p>
                <div className="flex items-center space-x-2 mt-1">
                    <input 
                      type="number"
                      value={editUserModal.user.balance}
                      onChange={(e) => handleUpdateUserField('balance', parseInt(e.target.value) || 0)}
                      className="bg-transparent text-2xl font-black border-none outline-none w-full focus:ring-0"
                    />
                    <span className="text-xl font-bold">đ</span>
                </div>
              </div>
            </div>

            {/* Section: Banks */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                    <Landmark size={14} />
                    <span>Ngân hàng liên kết</span>
                </h4>
              </div>
              
              {editUserModal.user.banks.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-3xl italic text-sm">Chưa có ngân hàng</div>
              ) : (
                <div className="space-y-3">
                  {editUserModal.user.banks.map((bank, index) => (
                    <div key={bank.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 italic">BANK #{index + 1}</span>
                        <button onClick={() => removeBank(index)} className="text-red-400 p-1"><Trash2 size={16} /></button>
                      </div>
                      <input 
                        placeholder="Tên ngân hàng"
                        value={bank.bankName}
                        onChange={(e) => handleUpdateBankField(index, 'bankName', e.target.value)}
                        className="w-full text-sm font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl outline-none border-none"
                      />
                      <input 
                        placeholder="Số tài khoản"
                        value={bank.accountNumber}
                        onChange={(e) => handleUpdateBankField(index, 'accountNumber', e.target.value)}
                        className="w-full text-sm font-medium text-blue-600 bg-slate-50 px-3 py-2 rounded-xl outline-none border-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Navbar */}
      <div className="px-6 pt-12 pb-6 bg-slate-900 text-white sticky top-0 z-20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => onNavigate('PROFILE')} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full mr-4">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">Quản trị viên</h2>
          </div>
          <button onClick={loadData} className="p-2 bg-white/10 rounded-full">
            <RefreshCcw size={18} />
          </button>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl">
          {[
            { id: 'TX', label: 'Duyệt lệnh', icon: CreditCard },
            { id: 'USERS', label: 'Hội viên', icon: Users },
            { id: 'GIFTS', label: 'Quà tặng', icon: Gift }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 pb-10">
        {activeTab === 'TX' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center">Chờ phê duyệt ({pendingTxs.length})</h3>
            {pendingTxs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-100 italic">Không có giao dịch chờ xử lý</div>
            ) : (
              pendingTxs.sort((a,b) => b.timestamp - a.timestamp).map(tx => (
                <div key={tx.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 animate-fade-in">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {tx.type === 'DEPOSIT' ? 'Nạp tiền' : 'Rút tiền'}
                      </span>
                      <p className="mt-2 font-bold text-slate-800">{tx.userName}</p>
                      <p className="text-xs text-slate-400">{tx.userPhone}</p>
                    </div>
                    <p className="text-lg font-black text-slate-900">{tx.amount.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl mb-4 text-xs text-slate-600 font-medium">{tx.bankInfo}</div>
                  <div className="flex space-x-3">
                    <button onClick={() => openRejectModal(tx.id)} className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl font-bold flex items-center justify-center space-x-2"><XCircle size={18} /><span>Từ chối</span></button>
                    <button onClick={() => onApproveTransaction(tx.id)} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-200"><CheckCircle size={18} /><span>Phê duyệt</span></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Danh sách mẹ ({users.length})</h3>
            {users.map(u => (
              <div key={u.phone} className="bg-white p-4 rounded-3xl flex items-center space-x-4 border border-slate-100 shadow-sm">
                <img src={u.avatar} className="w-12 h-12 rounded-full" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-slate-800 truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{u.phone}</p>
                  <p className="text-[10px] font-black text-blue-600 mt-0.5">{u.balance.toLocaleString('vi-VN')}đ</p>
                </div>
                <button onClick={() => openEditUser(u)} className="p-3 bg-blue-50 text-blue-600 rounded-2xl active:scale-90 transition-transform">
                  <Edit3 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'GIFTS' && (
          <div className="text-center py-20 text-slate-400">
            <Settings className="mx-auto mb-4 opacity-20" size={48} />
            <p>Tính năng chỉnh sửa quà tặng<br/>đang được cập nhật.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
