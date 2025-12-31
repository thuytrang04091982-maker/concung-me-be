
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, CheckCircle2, XCircle, Clock, Trash2, AlertCircle } from 'lucide-react';
import { Screen, AppNotification, User } from '../types';

interface NotificationsProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ user, onNavigate }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`mb_notifs_${user.phone}`);
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, [user.phone]);

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem(`mb_notifs_${user.phone}`);
  };

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} - ${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => onNavigate('HOME')} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-800 ml-4">Thông báo</h2>
        </div>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="p-2 text-gray-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-10">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
              <Bell size={48} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Chưa có thông báo</h3>
            <p className="text-gray-400 text-sm mt-2 px-10">
              Các hoạt động nạp, rút và quà tặng của mẹ sẽ hiển thị tại đây.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.sort((a, b) => b.timestamp - a.timestamp).map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 rounded-[24px] border border-gray-50 shadow-sm flex flex-col animate-fade-in ${notif.isRead ? 'bg-white' : 'bg-[#FFF0F3]/20'}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'SUCCESS' ? 'bg-green-50 text-green-500' : 
                    notif.type === 'ERROR' ? 'bg-red-50 text-red-500' : 
                    notif.type === 'PENDING' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {notif.type === 'SUCCESS' && <CheckCircle2 size={24} />}
                    {notif.type === 'ERROR' && <XCircle size={24} />}
                    {(notif.type === 'PENDING' || notif.type === 'INFO') && <Clock size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-gray-800">{notif.title}</h4>
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                        {formatTime(notif.timestamp)}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${notif.type === 'ERROR' ? 'text-gray-600' : 'text-gray-500'}`}>
                      {notif.content}
                    </p>
                  </div>
                </div>

                {notif.type === 'ERROR' && (
                  <div className="mt-3 p-3 bg-red-50/50 rounded-xl border border-red-50 flex items-start space-x-2">
                    <AlertCircle size={14} className="text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-red-500 uppercase tracking-tight">Chi tiết nguyên nhân:</p>
                      <p className="text-[11px] text-red-600 mt-0.5 italic">
                        {notif.content.split('Lý do: ')[1] || 'Vui lòng liên hệ CSKH để biết thêm chi tiết.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-2 flex items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    notif.type === 'SUCCESS' ? 'bg-green-100 text-green-600' : 
                    notif.type === 'ERROR' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {notif.type === 'SUCCESS' ? 'Đã duyệt' : notif.type === 'ERROR' ? 'Từ chối' : 'Đang xử lý'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
