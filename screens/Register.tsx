
import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Lock, AlertCircle } from 'lucide-react';
import { Screen, User as UserType } from '../types';
import { APP_CONFIG } from '../constants';

interface RegisterProps {
  onNavigate: (screen: Screen) => void;
  onRegister: (user: UserType) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleRegister = () => {
    setError('');
    
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ và tên');
      return;
    }

    if (!formData.phone.match(/^(0|84)(3|5|7|8|9)([0-9]{8})$/)) {
      setError('Số điện thoại không hợp lệ');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Không kiểm tra localStorage ở đây nữa, App.tsx sẽ gọi CloudAPI để tạo user
    // Nếu số điện thoại tồn tại, Supabase sẽ trả về lỗi và App.tsx sẽ alert.

    const newUser: UserType = {
      name: formData.name,
      phone: formData.phone,
      balance: 0,
      avatar: `${APP_CONFIG.DEFAULT_AVATAR_BASE}${formData.phone}`,
      password: formData.password,
      banks: []
    };

    onRegister(newUser);
  };

  return (
    <div className="min-h-full flex flex-col bg-white p-6">
      <button onClick={() => onNavigate('WELCOME')} className="mb-8 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Tạo tài khoản</h2>
        <p className="text-gray-500 mt-1">Gia nhập cộng đồng Mẹ & Bé cao cấp</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 text-sm rounded-2xl flex items-center space-x-2 border border-red-100 animate-pulse">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Họ và tên</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Nhập họ và tên đầy đủ"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Số điện thoại</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="tel" 
              placeholder="Nhập số điện thoại của mẹ"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Mật khẩu bảo mật"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input type="checkbox" id="terms" className="w-5 h-5 accent-[#FF85A1] rounded cursor-pointer" />
          <label htmlFor="terms" className="text-sm text-gray-600">Tôi đồng ý với chính sách của Mẹ & Bé</label>
        </div>

        <button 
          onClick={handleRegister}
          className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl font-bold shadow-lg shadow-[#FF85A1]/30 active:scale-95 transition-transform mt-4"
        >
          Đăng ký tài khoản
        </button>
      </div>

      <div className="mt-8 text-center pb-8">
        <p className="text-gray-600 text-sm">
          Đã có tài khoản?{' '}
          <button onClick={() => onNavigate('LOGIN')} className="text-[#FF85A1] font-bold">Đăng nhập</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
