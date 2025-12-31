
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
            src={APP_CONFIG.HOME_BANNER_IMAGE} 
            alt="Product" 
            className="absolute -right-8 -bottom-8 w-48 h-48 opacity-40 rotate-12"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
