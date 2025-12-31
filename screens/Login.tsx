
import React, { useState } from 'react';
import { ArrowLeft, Phone, Lock, AlertCircle } from 'lucide-react';
import { Screen } from '../types';

interface LoginProps {
  onNavigate: (screen: Screen) => void;
  // Fix: Added Promise<boolean> to allow asynchronous login operations
  onLogin: (phone: string, pass: string) => Promise<boolean> | boolean;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fix: handleLogin is now async to properly await the result of onLogin
  const handleLogin = async () => {
    setError('');
    if (!phone || !password) {
      setError('Vui lòng nhập đủ thông tin');
      return;
    }

    const success = await onLogin(phone, password);
    if (!success) {
      setError('Số điện thoại hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-white p-6">
      <button onClick={() => onNavigate('WELCOME')} className="mb-8 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Chào mừng trở lại</h2>
        <p className="text-gray-500 mt-2">Dữ liệu của mẹ đã sẵn sàng</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm rounded-2xl flex items-center space-x-2 border border-red-100 animate-shake">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Số điện thoại</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="tel" 
              placeholder="Số điện thoại đăng ký"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
            <button type="button" className="text-xs text-[#FF85A1] font-semibold">Quên mật khẩu?</button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF85A1] transition-all outline-none"
            />
          </div>
        </div>

        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl font-bold shadow-lg shadow-[#FF85A1]/30 active:scale-95 transition-transform"
        >
          Đăng nhập ngay
        </button>
      </div>

      <div className="mt-8 text-center pb-8">
        <p className="text-gray-600 text-sm">
          Chưa có tài khoản?{' '}
          <button onClick={() => onNavigate('REGISTER')} className="text-[#FF85A1] font-bold">Đăng ký mới</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
