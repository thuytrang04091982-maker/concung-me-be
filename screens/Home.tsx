
import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowDownCircle, Gift, Bell, Search, AlertCircle, X, Clock, ChevronRight, MessageSquare, AlertTriangle } from 'lucide-react';
import { Screen, User, TransactionRecord, AppNotification } from '../types';
import { APP_CONFIG } from '../constants';
import { CloudAPI } from '../services/api';

interface HomeProps {
  user: User;
  onNavigate: (screen: Screen, params?: any) => void;
}

const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [latestNotif, setLatestNotif] = useState<AppNotification | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<TransactionRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông báo mới nhất chưa đọc
        const notifs = await CloudAPI.getNotifications(user.phone);
        const unread = notifs.filter(n => !n.isRead);
        if (unread.length > 0) {
          setLatestNotif(unread[0]);
        } else {
          setLatestNotif(null);
        }
        
        // Lấy giao dịch gần đây của chính user này
        const allTxs = await CloudAPI.getTransactions();
        const userTxs = allTxs
          .filter(t => t.userPhone === user.phone)
          .slice(0, 5);
        setRecentTransactions(userTxs);
      } catch (e) {
        console.warn("Lỗi đồng bộ Home");
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user.phone]);

  const handleAction = (type: 'DEPOSIT' | 'WITHDRAW') => {
    if (!user.banks || user.banks.length === 0) {
      setShowWarning(true);
    } else {
      onNavigate('TRANSACTION', { type });
    }
  };

  const goToNotifications = async () => {
    try {
      await CloudAPI.markNotifsAsRead(user.phone);
      setLatestNotif(null);
    } catch (e) {}
    onNavigate('NOTIFICATIONS');
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-24 relative">
      {/* Floating Notification Toast - Nổi bật khi có tin mới */}
      {latestNotif && (
        <div className="fixed top-14 left-0 right-0 z-[110] px-6 animate-slide-up">
          <button 
            onClick={goToNotifications}
            className={`w-full p-4 rounded-2xl shadow-2xl flex items-center space-x-3 border-2 transform active:scale-95 transition-all ${
              latestNotif.type === 'ERROR' 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-white border-pink-100 text-gray-800'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              latestNotif.type === 'ERROR' ? 'bg-red-500 text-white' : 'bg-[#FF85A1] text-white'
            }`}>
              {latestNotif.type === 'ERROR' ? <AlertTriangle size={20} /> : <Bell size={20} />}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Thông báo mới</p>
              <p className="font-bold text-sm truncate">{latestNotif.title}</p>
              <p className="text-[11px] opacity-80 line-clamp-1">{latestNotif.content}</p>
            </div>
            <ChevronRight size={16} className="opacity-30" />
          </button>
        </div>
      )}

      {showWarning && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
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

      {/* Header Section */}
      <div className="bg-[#FF85A1] rounded-b-[40px] px-6 pt-12 pb-10 text-white shadow-xl shadow-[#FF85A1]/20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full border-2 border-white/50 bg-white/20"
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
                {latestNotif && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-[#FF85A1] animate-pulse"></span>
                )}
            </button>
          </div>
        </div>

        <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-md border border-white/20">
          <p className="text-sm text-white/80 font-medium">Số dư tài khoản</p>
          <div className="flex items-end space-x-2">
            <h2 className="text-3xl font-bold mt-1 tracking-wide">
              {user.balance.toLocaleString('vi-VN')}
            </h2>
            <span className="mb-1.5 font-bold text-white/80">đ</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-3xl p-4 shadow-xl shadow-gray-200 flex justify-around items-center border border-gray-50">
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

      {/* Recent Transactions */}
      <div className="px-6 mt-8 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-bold text-gray-800">Lịch sử gần đây</h4>
          <button onClick={goToNotifications} className="text-[10px] text-[#FF85A1] font-bold uppercase tracking-wider">Xem tất cả</button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-50">
            <Clock size={32} className="text-gray-200 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Mẹ chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      tx.type === 'DEPOSIT' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'
                    }`}>
                      {tx.type === 'DEPOSIT' ? <PlusCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{tx.type === 'DEPOSIT' ? 'Nạp tiền' : 'Rút tiền'}</p>
                      <p className="text-[10px] text-gray-400">{new Date(tx.timestamp).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${tx.type === 'DEPOSIT' ? 'text-green-500' : 'text-orange-500'}`}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString()}đ
                    </p>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      tx.status === 'APPROVED' ? 'bg-green-50 text-green-500' : 
                      tx.status === 'REJECTED' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
                    }`}>
                      {tx.status === 'PENDING' ? 'Chờ duyệt' : tx.status === 'APPROVED' ? 'Thành công' : 'Từ chối'}
                    </span>
                  </div>
                </div>
                
                {/* LÝ DO TỪ CHỐI HIỆN RÕ RÀNG Ở ĐÂY */}
                {tx.status === 'REJECTED' && tx.rejectionReason && (
                  <div className="bg-red-50/50 p-3 rounded-2xl flex items-start space-x-2 border border-red-100/50">
                    <MessageSquare size={14} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-red-600 font-medium leading-relaxed italic">
                      Lý do: {tx.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promotion Banner */}
      <div className="px-6 mt-8 space-y-4">
        <h4 className="font-bold text-gray-800 px-1">Ưu đãi độc quyền</h4>
        <div 
          onClick={() => onNavigate('GIFTS')}
          className="relative bg-gradient-to-br from-orange-400 to-[#FF85A1] rounded-3xl p-6 text-white overflow-hidden shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="relative z-10 w-2/3">
            <h3 className="text-xl font-bold leading-tight">Quà tặng 0 đồng cho mẹ & bé</h3>
            <p className="text-white/80 text-[10px] mt-2">Hàng ngàn sản phẩm tã sữa đang chờ đón mẹ.</p>
            <button className="mt-4 bg-white text-[#FF85A1] px-5 py-2 rounded-xl text-[11px] font-bold shadow-md">
                Nhận ngay
            </button>
          </div>
          <img 
            src={'data:image/jpeg;base64,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'} 
            alt="Product" 
            className="absolute -right-6 -bottom-6 w-40 h-40 opacity-30 rotate-12"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
