
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, CheckCircle2, XCircle, Clock, Trash2, AlertCircle } from 'lucide-react';
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
  }, [user.phone]);

  const clearAll = () => {
    // Với Cloud API, bạn có thể thêm hàm xóa thông báo trên server nếu cần
    setNotifications([]);
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
          <h2 className="text-lg font-bold text-gray-800 ml-4">Thông báo Cloud</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-10">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center">
            <Bell size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 rounded-[24px] border shadow-sm ${notif.isRead ? 'bg-white' : 'bg-pink-50/30'}`}>
                <div className="flex justify-between">
                  <h4 className="text-sm font-bold text-gray-800">{notif.title}</h4>
                  <span className="text-[10px] text-gray-400">{formatTime(notif.timestamp)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{notif.content}</p>
                <span className={`text-[10px] font-bold mt-2 inline-block px-2 py-0.5 rounded-full ${notif.type === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {notif.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
