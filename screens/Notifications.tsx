
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, CheckCircle2, XCircle, Clock, Trash2, AlertCircle, MessageCircle, AlertTriangle } from 'lucide-react';
import { Screen, AppNotification, User } from '../types';
import { CloudAPI } from '../services/api';

interface NotificationsProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ user, onNavigate }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const fetchNotifs = async () => {
    try {
      const data = await CloudAPI.getNotifications(user.phone);
      setNotifications(data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifs();
    // Đánh dấu là đã xem khi mở trang này
    CloudAPI.markNotifsAsRead(user.phone);
  }, [user.phone]);

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} - ${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => onNavigate('HOME')} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full active:scale-90 transition-transform">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-800 ml-4">Thông báo</h2>
        </div>
        <button className="text-xs text-gray-400 font-bold uppercase tracking-widest">Xóa hết</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-10">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Bell size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold">Mẹ chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-5 rounded-[32px] border shadow-sm transition-all animate-fade-in ${
                notif.isRead ? 'bg-white border-gray-100' : 'bg-white border-pink-100 ring-1 ring-pink-50'
              }`}>
                <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        notif.type === 'SUCCESS' ? 'bg-green-50 text-green-500' :
                        notif.type === 'ERROR' ? 'bg-red-50 text-red-500' :
                        'bg-blue-50 text-blue-500'
                    }`}>
                        {notif.type === 'SUCCESS' ? <CheckCircle2 size={24} /> :
                         notif.type === 'ERROR' ? <AlertTriangle size={24} /> :
                         <Clock size={24} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-black text-gray-800 leading-tight pr-2">{notif.title}</h4>
                            <span className="text-[9px] text-gray-400 font-bold uppercase shrink-0 mt-0.5">{formatTime(notif.timestamp)}</span>
                        </div>
                        <p className="text-[12px] text-gray-500 leading-relaxed">{notif.content}</p>
                        
                        {!notif.isRead && (
                             <div className="mt-3 flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-[#FF85A1] rounded-full animate-pulse"></span>
                                <span className="text-[9px] font-bold text-[#FF85A1] uppercase tracking-wider">Mới cập nhật</span>
                             </div>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-8 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Mẹ & Bé Cloud Service</p>
      </div>
    </div>
  );
};

export default Notifications;
