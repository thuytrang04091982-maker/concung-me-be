
import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from 'lucide-react';
import { Screen, User } from '../types';

interface SecurityProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

const InputField: React.FC<{ label: string, placeholder: string }> = ({ label, placeholder }) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
        <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="password" 
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none text-sm"
            />
            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        </div>
    </div>
);

const Security: React.FC<SecurityProps> = ({ onNavigate, user }) => {
  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="px-6 pt-12 pb-6 flex items-center border-b border-gray-50 bg-white sticky top-0 z-10">
        <button onClick={() => onNavigate('PROFILE')} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-gray-800 ml-4">Đổi mật khẩu</h2>
      </div>

      <div className="p-8 flex flex-col items-center flex-1">
        <div className="w-20 h-20 bg-[#FFF0F3] rounded-[24px] flex items-center justify-center text-[#FF85A1] mb-8 shadow-lg shadow-[#FF85A1]/10">
            <ShieldCheck size={40} />
        </div>
        
        <div className="text-center mb-10">
            <p className="text-gray-500 text-sm px-4">
                Chào mẹ <strong>{user.name}</strong>, mật khẩu mới của mẹ cần khác với mật khẩu được sử dụng trước đó để đảm bảo an toàn.
            </p>
        </div>

        <form className="w-full space-y-6 flex-1">
            <InputField label="Mật khẩu hiện tại" placeholder="••••••••" />
            <InputField label="Mật khẩu mới" placeholder="••••••••" />
            <InputField label="Xác nhận mật khẩu mới" placeholder="••••••••" />

            <div className="pt-4">
                <button 
                    type="button"
                    onClick={() => onNavigate('PROFILE')}
                    className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl font-bold shadow-lg shadow-[#FF85A1]/30 active:scale-95 transition-transform"
                >
                    Cập nhật mật khẩu
                </button>
            </div>
        </form>

        <div className="mt-8 pb-8 text-center">
            <button className="text-gray-400 text-sm font-medium">Mẹ cần trợ giúp?</button>
        </div>
      </div>
    </div>
  );
};

export default Security;
