
import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle2, CreditCard, X, Building2, User as UserIcon, Hash } from 'lucide-react';
import { Screen, User, BankAccount } from '../types';

interface BankingProps {
  user: User;
  onNavigate: (screen: Screen) => void;
  onAddBank: (bank: BankAccount) => void;
}

const Banking: React.FC<BankingProps> = ({ user, onNavigate, onAddBank }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: user.name.toUpperCase()
  });

  const handleAdd = () => {
    if (!formData.bankName || !formData.accountNumber) return;
    
    const newBank: BankAccount = {
      id: Date.now().toString(),
      ...formData
    };
    
    onAddBank(newBank);
    setShowAddForm(false);
    setFormData({ bankName: '', accountNumber: '', accountHolder: user.name.toUpperCase() });
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      <div className="px-6 pt-12 pb-6 flex items-center border-b border-gray-50 bg-white sticky top-0 z-10">
        <button onClick={() => onNavigate('PROFILE')} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-gray-800 ml-4">Liên kết ngân hàng</h2>
      </div>

      <div className="p-6 flex-1">
        {(!user.banks || user.banks.length === 0) ? (
          <div className="py-12 flex flex-col items-center text-center px-8">
            <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center text-gray-300 mb-6">
              <CreditCard size={48} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Chưa có ngân hàng</h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Mẹ chưa liên kết tài khoản nào. Hãy thêm ngân hàng để thực hiện các giao dịch nạp rút tiền.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Danh sách đã liên kết</h4>
            {user.banks.map((bank) => (
              <div key={bank.id} className="bg-gradient-to-br from-blue-600 to-indigo-500 rounded-[32px] p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden animate-fade-in">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-md">
                      <span className="text-white font-bold text-xs uppercase tracking-widest">{bank.bankName}</span>
                    </div>
                    <CheckCircle2 size={24} className="text-blue-100" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-[10px] uppercase tracking-[0.2em] mb-1">Số tài khoản</p>
                    <p className="text-xl font-bold tracking-widest">
                        {bank.accountNumber.replace(/.(?=.{4})/g, '*')}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between items-end">
                    <span className="text-xs text-blue-100 uppercase tracking-widest">{bank.accountHolder}</span>
                    <span className="text-[10px] text-blue-100 bg-white/20 px-2 py-1 rounded-full uppercase">Chính chủ</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 space-y-4">
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center p-5 bg-white border-2 border-dashed border-gray-200 rounded-[32px] text-[#FF85A1] hover:border-[#FF85A1]/30 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 bg-[#FFF0F3] rounded-2xl flex items-center justify-center mr-4">
              <Plus size={24} />
            </div>
            <span className="font-bold text-sm">Thêm tài khoản ngân hàng</span>
          </button>
        </div>
      </div>

      {/* Add Bank Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-t-[48px] p-8 w-full max-h-[90%] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">Liên kết ngân hàng</h3>
              <button onClick={() => setShowAddForm(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Tên ngân hàng</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Vietcombank, Techcombank..."
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Số tài khoản</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    placeholder="Nhập số tài khoản ngân hàng"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Tên chủ tài khoản</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    disabled
                    value={formData.accountHolder}
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 text-gray-500 rounded-2xl border-none outline-none font-bold"
                  />
                </div>
              </div>

              <button 
                onClick={handleAdd}
                className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl font-bold shadow-lg shadow-[#FF85A1]/30 active:scale-95 transition-transform mt-4"
              >
                Xác nhận liên kết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banking;
