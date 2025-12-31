
import React from 'react';
import { User, CreditCard, ShieldCheck, Key, LogOut, ChevronRight, Heart, ShieldAlert } from 'lucide-react';
import { Screen, User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const MenuLink: React.FC<{ 
    icon: any, 
    label: string, 
    onClick: () => void,
    isDanger?: boolean,
    isSpecial?: boolean
}> = ({ icon: Icon, label, onClick, isDanger, isSpecial }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow active:scale-[0.99] mb-4 ${
          isSpecial ? 'bg-slate-900 text-white' : 'bg-white'
        }`}
    >
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${
              isSpecial ? 'bg-white/10 text-white' :
              isDanger ? 'bg-red-50 text-red-500' : 
              'bg-[#FFF0F3] text-[#FF85A1]'
            }`}>
                <Icon size={20} />
            </div>
            <span className={`font-semibold ${
              isSpecial ? 'text-white' :
              isDanger ? 'text-red-500' : 
              'text-gray-700'
            }`}>{label}</span>
        </div>
        <ChevronRight size={18} className={isSpecial ? 'text-white/40' : isDanger ? 'text-red-300' : 'text-gray-300'} />
    </button>
);

const Profile: React.FC<ProfileProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#FAFAFA] pb-24">
      {/* Profile Header */}
      <div className="bg-white px-8 pt-16 pb-8 rounded-b-[48px] shadow-lg shadow-gray-100 text-center flex flex-col items-center">
        <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full border-4 border-[#FFF0F3] p-1 shadow-inner">
                <img 
                    src={user.avatar} 
                    alt="User" 
                    className="w-full h-full rounded-full object-cover"
                />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF85A1] border-4 border-white rounded-full flex items-center justify-center text-white">
                <ShieldCheck size={14} />
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
        <p className="text-gray-400 text-sm mt-1">{user.phone}</p>
        
        <div className="flex space-x-4 mt-6">
            <div className="bg-[#FFF0F3] px-4 py-2 rounded-full flex items-center space-x-2">
                <Heart size={14} className="text-[#FF85A1] fill-current" />
                <span className="text-[11px] font-bold text-[#FF85A1]">
                  {user.isAdmin ? 'Quản trị viên hệ thống' : 'Thành viên may mắn'}
                </span>
            </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        {user.isAdmin && (
          <MenuLink 
            icon={ShieldAlert} 
            label="Bảng điều khiển Admin" 
            isSpecial
            onClick={() => onNavigate('ADMIN_DASHBOARD')} 
          />
        )}

        <MenuLink 
            icon={User} 
            label="Thông tin cá nhân" 
            onClick={() => {}} 
        />
        <MenuLink 
            icon={CreditCard} 
            label="Liên kết ngân hàng" 
            onClick={() => onNavigate('BANKING')} 
        />
        <MenuLink 
            icon={ShieldCheck} 
            label="Bảo mật & Quyền riêng tư" 
            onClick={() => onNavigate('SECURITY')} 
        />
        <div className="pt-4">
            <MenuLink 
                icon={LogOut} 
                label="Đăng xuất" 
                onClick={onLogout} 
                isDanger 
            />
        </div>
      </div>

      <div className="mt-12 text-center text-gray-300 text-xs px-12">
          Hệ thống Mẹ & Bé Premium v4.0.0
      </div>
    </div>
  );
};

export default Profile;
