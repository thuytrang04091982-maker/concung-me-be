
import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowDownCircle, Gift, Bell, Search, AlertCircle, X } from 'lucide-react';
import { Screen, User, AppNotification } from '../types';
import { APP_CONFIG } from '../constants';

interface HomeProps {
  user: User;
  onNavigate: (screen: Screen, params?: any) => void;
}

const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [hasNewNotif, setHasNewNotif] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`mb_notifs_${user.phone}`);
    if (saved) {
      const notifs: AppNotification[] = JSON.parse(saved);
      setHasNewNotif(notifs.some(n => !n.isRead));
    }
  }, [user.phone]);

  const handleAction = (type: 'DEPOSIT' | 'WITHDRAW') => {
    if (!user.banks || user.banks.length === 0) {
      setShowWarning(true);
    } else {
      onNavigate('TRANSACTION', { type });
    }
  };

  const goToNotifications = () => {
    // Đánh dấu tất cả là đã đọc khi vào xem
    const saved = localStorage.getItem(`mb_notifs_${user.phone}`);
    if (saved) {
      const notifs: AppNotification[] = JSON.parse(saved).map((n: any) => ({...n, isRead: true}));
      localStorage.setItem(`mb_notifs_${user.phone}`, JSON.stringify(notifs));
    }
    onNavigate('NOTIFICATIONS');
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-24">
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl animate-scale-up">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                <AlertCircle size={28} />
              </div>
              <button onClick={() => setShowWarning(false)} className="p-2 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Chưa có ngân hàng</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Mẹ vui lòng liên kết tài khoản ngân hàng để thực hiện nạp hoặc rút tiền an toàn.
            </p>
            <div className="flex flex-col space-y-3 mt-6">
              <button 
                onClick={() => onNavigate('BANKING')}
                className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl font-bold shadow-lg shadow-[#FF85A1]/20 active:scale-95 transition-transform"
              >
                Liên kết ngay
              </button>
              <button 
                onClick={() => setShowWarning(false)}
                className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold active:scale-95 transition-transform"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#FF85A1] rounded-b-[40px] px-6 pt-12 pb-10 text-white shadow-xl shadow-[#FF85A1]/20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full border-2 border-white/50"
            />
            <div>
              <p className="text-xs text-white/80">Chào mẹ,</p>
              <h3 className="font-bold text-lg">{user.name}</h3>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 bg-white/20 rounded-full backdrop-blur-md">
                <Search size={20} />
            </button>
            <button 
              onClick={goToNotifications}
              className="p-2 bg-white/20 rounded-full backdrop-blur-md relative active:scale-90 transition-transform"
            >
                <Bell size={20} />
                {hasNewNotif && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-[#FF85A1] animate-pulse"></span>
                )}
            </button>
          </div>
        </div>

        <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-md border border-white/20">
          <p className="text-sm text-white/80 font-medium">Số dư tài khoản</p>
          <h2 className="text-3xl font-bold mt-1 tracking-wide">
            {user.balance.toLocaleString('vi-VN')}đ
          </h2>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-3xl p-4 shadow-xl shadow-gray-200 flex justify-around items-center">
            <button onClick={() => handleAction('DEPOSIT')} className="flex flex-col items-center space-y-2 group">
                <div className="w-14 h-14 bg-[#FFF0F3] rounded-2xl flex items-center justify-center text-[#FF85A1] group-active:scale-95 transition-transform">
                    <PlusCircle size={28} />
                </div>
                <span className="text-xs font-bold text-gray-700">Nạp tiền</span>
            </button>
            <div className="w-[1px] h-10 bg-gray-100"></div>
            <button onClick={() => handleAction('WITHDRAW')} className="flex flex-col items-center space-y-2 group">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400 group-active:scale-95 transition-transform">
                    <ArrowDownCircle size={28} />
                </div>
                <span className="text-xs font-bold text-gray-700">Rút tiền</span>
            </button>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-gray-800">Nổi bật cho mẹ</h4>
          <button className="text-xs text-[#FF85A1] font-bold">Xem tất cả</button>
        </div>

        <div 
          onClick={() => onNavigate('GIFTS')}
          className="relative bg-gradient-to-br from-orange-400 to-[#FF85A1] rounded-3xl p-6 text-white overflow-hidden shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="relative z-10 w-2/3">
            <div className="flex items-center space-x-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md mb-3">
              <Gift size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Ưu đãi độc quyền</span>
            </div>
            <h3 className="text-2xl font-bold leading-tight">Quà tặng 0 đồng cho bé yêu</h3>
            <p className="text-white/80 text-xs mt-2">Hàng ngàn sản phẩm tã, sữa, đồ dùng cho mẹ và bé đang chờ bạn.</p>
            <button className="mt-4 bg-white text-[#FF85A1] px-6 py-2 rounded-xl text-sm font-bold shadow-md">
                Nhận ngay
            </button>
          </div>
          <img 
            src={'data:image/jpeg;base64,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'} 
            alt="Product" 
            className="absolute -right-8 -bottom-8 w-48 h-48 opacity-40 rotate-12"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
