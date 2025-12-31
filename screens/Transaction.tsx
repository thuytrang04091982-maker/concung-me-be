
import React, { useState } from 'react';
import { ArrowLeft, Check, AlertCircle, Building2, DollarSign, Clock } from 'lucide-react';
import { Screen, User, BankAccount, AppNotification, TransactionRecord } from '../types';

interface TransactionProps {
  user: User;
  type: 'DEPOSIT' | 'WITHDRAW';
  onNavigate: (screen: Screen) => void;
}

const QUICK_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000, 5000000];

const Transaction: React.FC<TransactionProps> = ({ user, type, onNavigate }) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(user.banks[0] || null);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'PENDING_MODAL' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const isDeposit = type === 'DEPOSIT';
  const title = isDeposit ? 'Nạp tiền' : 'Rút tiền';

  const handleTransaction = () => {
    const numAmount = parseInt(amount);
    
    if (!numAmount || numAmount < 10000) {
      setErrorMsg('Số tiền tối thiểu là 10.000đ');
      setStatus('ERROR');
      return;
    }

    if (!isDeposit && numAmount > user.balance) {
      setErrorMsg('Số dư không đủ để thực hiện rút tiền');
      setStatus('ERROR');
      return;
    }

    if (!selectedBank) {
      setErrorMsg('Vui lòng chọn ngân hàng liên kết');
      setStatus('ERROR');
      return;
    }

    setStatus('LOADING');
    
    setTimeout(() => {
      // 1. Tạo bản ghi giao dịch cho Admin
      const allTxs: TransactionRecord[] = JSON.parse(localStorage.getItem('mb_all_transactions') || '[]');
      const newTx: TransactionRecord = {
        id: 'TX-' + Date.now(),
        userPhone: user.phone,
        userName: user.name,
        type: type,
        amount: numAmount,
        bankInfo: `${selectedBank.bankName} - ${selectedBank.accountNumber}`,
        status: 'PENDING',
        timestamp: Date.now()
      };
      allTxs.push(newTx);
      localStorage.setItem('mb_all_transactions', JSON.stringify(allTxs));

      // 2. Tạo thông báo "Đang chờ duyệt" cho User
      const userNotifs: AppNotification[] = JSON.parse(localStorage.getItem(`mb_notifs_${user.phone}`) || '[]');
      userNotifs.push({
        id: Date.now().toString(),
        title: `Yêu cầu ${title.toLowerCase()} đang chờ`,
        content: `Mẹ vừa tạo yêu cầu ${title.toLowerCase()} ${numAmount.toLocaleString('vi-VN')}đ. Vui lòng đợi quản trị viên phê duyệt.`,
        timestamp: Date.now(),
        type: 'PENDING',
        isRead: false
      });
      localStorage.setItem(`mb_notifs_${user.phone}`, JSON.stringify(userNotifs));

      setStatus('PENDING_MODAL');
    }, 1200);
  };

  if (status === 'PENDING_MODAL') {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-white p-8 animate-fade-in text-center">
        <div className="w-24 h-24 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mb-6">
          <Clock size={48} className="animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Đã gửi yêu cầu</h2>
        <p className="text-gray-500 mt-3 leading-relaxed">
          Yêu cầu <span className="font-bold text-[#FF85A1]">{title.toLowerCase()}</span> của mẹ đã được gửi tới hệ thống. Quản trị viên sẽ phê duyệt trong thời gian sớm nhất.
        </p>
        <div className="w-full mt-10 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
            <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">Số tiền:</span>
                <span className="font-bold text-gray-700">{parseInt(amount).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-gray-400">Trạng thái:</span>
                <span className="font-bold text-orange-500 italic">Đang chờ duyệt</span>
            </div>
        </div>
        <button 
          onClick={() => onNavigate('HOME')}
          className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl font-bold shadow-lg shadow-[#FF85A1]/20 mt-10 active:scale-95 transition-transform"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="px-6 pt-12 pb-6 flex items-center bg-white sticky top-0 z-10">
        <button onClick={() => onNavigate('HOME')} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-gray-800 ml-4">{title}</h2>
      </div>

      <div className="p-6 flex-1 space-y-8">
        <div className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center">
            <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Số dư hiện tại</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{user.balance.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#FF85A1] shadow-sm">
                <DollarSign size={20} />
            </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 ml-1">Nhập số tiền</label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full py-6 bg-white border-b-2 border-gray-100 text-3xl font-bold text-gray-800 focus:border-[#FF85A1] outline-none transition-all placeholder:text-gray-200"
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">đ</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {QUICK_AMOUNTS.map((val) => (
              <button 
                key={val}
                onClick={() => setAmount(val.toString())}
                className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                    amount === val.toString() 
                    ? 'bg-[#FFF0F3] border-[#FF85A1] text-[#FF85A1]' 
                    : 'bg-white border-gray-100 text-gray-500'
                }`}
              >
                {val >= 1000000 ? `${val/1000000}M` : `${val/1000}K`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-bold text-gray-700">Ngân hàng thụ hưởng</label>
            <button onClick={() => onNavigate('BANKING')} className="text-xs text-[#FF85A1] font-bold">Quản lý</button>
          </div>
          
          <div className="space-y-3">
            {user.banks.map((bank) => (
              <button 
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                className={`w-full flex items-center p-4 rounded-2xl border transition-all ${
                    selectedBank?.id === bank.id 
                    ? 'border-[#FF85A1] bg-[#FFF0F3]/30' 
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                    selectedBank?.id === bank.id ? 'bg-[#FF85A1] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                    <Building2 size={20} />
                </div>
                <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-gray-800">{bank.bankName}</p>
                    <p className="text-xs text-slate-400">{bank.accountNumber.replace(/.(?=.{4})/g, '*')}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-500 text-sm rounded-2xl flex items-center space-x-2 border border-red-100">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-50 mt-auto">
        <button 
          onClick={handleTransaction}
          disabled={status === 'LOADING'}
          className={`w-full py-4 text-white rounded-2xl font-bold shadow-lg shadow-[#FF85A1]/20 active:scale-95 transition-all flex items-center justify-center space-x-2 ${
            status === 'LOADING' ? 'bg-[#FF85A1]/60' : 'bg-[#FF85A1]'
          }`}
        >
          {status === 'LOADING' ? 'Đang gửi yêu cầu...' : `Xác nhận ${title}`}
        </button>
      </div>
    </div>
  );
};

export default Transaction;
