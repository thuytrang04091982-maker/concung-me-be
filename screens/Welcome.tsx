
import React from 'react';
import { Screen } from '../types';
import { APP_CONFIG } from '../constants';

interface WelcomeProps {
  onNavigate: (screen: Screen) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FFF0F3] to-white p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-24 h-24 bg-[#FF85A1] rounded-3xl flex items-center justify-center shadow-lg transform rotate-6 animate-bounce-slow">
            <span className="text-white text-4xl font-bold">M&B</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-[#FF85A1]">Mẹ & Bé</h1>
          <p className="text-gray-600 text-lg px-4 leading-relaxed">
            “Đồng hành cùng mẹ – Chăm sóc bé yêu”
          </p>
        </div>

        <div className="w-full max-w-xs aspect-square bg-[#FFE4E9] rounded-full overflow-hidden flex items-center justify-center p-6 relative">
             <img 
               src={'data:image/jpeg;base64,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'} 
               alt="Mother and Baby illustration" 
               className="w-full h-full object-cover rounded-full shadow-inner"
             />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <button 
          onClick={() => onNavigate('LOGIN')}
          className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Đăng nhập
        </button>
        <button 
          onClick={() => onNavigate('REGISTER')}
          className="w-full py-4 bg-white text-[#FF85A1] border-2 border-[#FF85A1] rounded-2xl font-bold active:scale-95 transition-transform"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

export default Welcome;
