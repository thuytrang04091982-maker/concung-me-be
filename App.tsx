
import React, { useState, useEffect } from 'react';
import { Screen, User, TransactionRecord, AppNotification } from './types';
import { CloudAPI } from './services/api';
import Welcome from './screens/Welcome';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import Gifts from './screens/Gifts';
import Profile from './screens/Profile';
import Banking from './screens/Banking';
import Security from './screens/Security';
import Transaction from './screens/Transaction';
import Notifications from './screens/Notifications';
import AdminDashboard from './screens/AdminDashboard';
import BottomNav from './components/BottomNav';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('WELCOME');
  const [isSyncing, setIsSyncing] = useState(true);
  const [transactionType, setTransactionType] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');

  // Khởi tạo app và nạp session từ "Cloud"
  useEffect(() => {
    const initApp = async () => {
      setIsSyncing(true);
      const user = await CloudAPI.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setCurrentScreen('HOME');
      }
      
      // Đảm bảo có Admin mặc định
      const users = await CloudAPI.getUsers();
      if (!users.find(u => u.phone === '0000')) {
        users.push({
          name: 'Quản trị viên',
          phone: '0000',
          balance: 999999999,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          password: 'admin',
          banks: [],
          isAdmin: true
        });
        await CloudAPI.saveUsers(users);
      }
      setIsSyncing(false);
    };
    initApp();
  }, []);

  // Watcher: Đồng bộ hóa trạng thái tài khoản thời gian thực
  useEffect(() => {
    if (!currentUser) return;

    const syncInterval = setInterval(async () => {
      const users = await CloudAPI.getUsers();
      const freshData = users.find(u => u.phone === currentUser.phone);
      if (freshData && JSON.stringify(freshData) !== JSON.stringify(currentUser)) {
        setCurrentUser(freshData);
      }
    }, 3000);

    return () => clearInterval(syncInterval);
  }, [currentUser]);

  const navigateTo = (screen: Screen, params?: any) => {
    if (screen === 'TRANSACTION' && params?.type) {
      setTransactionType(params.type);
    }
    setCurrentScreen(screen);
  };

  const handleApproveTransaction = async (txId: string) => {
    setIsSyncing(true);
    const txs = await CloudAPI.getTransactions();
    const tx = txs.find(t => t.id === txId);
    if (tx && tx.status === 'PENDING') {
      const users = await CloudAPI.getUsers();
      const userIdx = users.findIndex(u => u.phone === tx.userPhone);
      
      if (userIdx !== -1) {
        users[userIdx].balance += (tx.type === 'DEPOSIT' ? tx.amount : -tx.amount);
        tx.status = 'APPROVED';
        
        await CloudAPI.saveUsers(users);
        await CloudAPI.updateTransaction(tx);
        await CloudAPI.addNotification(tx.userPhone, {
          id: Date.now().toString(),
          title: 'Giao dịch thành công',
          content: `Lệnh ${tx.type === 'DEPOSIT' ? 'Nạp' : 'Rút'} ${tx.amount.toLocaleString()}đ đã được duyệt.`,
          timestamp: Date.now(),
          type: 'SUCCESS',
          isRead: false
        });
      }
    }
    setIsSyncing(false);
  };

  const handleRejectTransaction = async (txId: string, reason: string) => {
    setIsSyncing(true);
    const txs = await CloudAPI.getTransactions();
    const tx = txs.find(t => t.id === txId);
    if (tx) {
      tx.status = 'REJECTED';
      tx.rejectionReason = reason;
      await CloudAPI.updateTransaction(tx);
      await CloudAPI.addNotification(tx.userPhone, {
        id: Date.now().toString(),
        title: 'Giao dịch thất bại',
        content: `Lệnh giao dịch bị từ chối. Lý do: ${reason}`,
        timestamp: Date.now(),
        type: 'ERROR',
        isRead: false
      });
    }
    setIsSyncing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('mb_current_user');
    setCurrentUser(null);
    setCurrentScreen('WELCOME');
  };

  if (isSyncing && currentScreen === 'WELCOME') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#FF85A1] mb-4" size={48} />
        <p className="text-gray-400 font-bold animate-pulse text-sm">Đang kết nối Cloud...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-[430px] aspect-[9/19.5] sm:aspect-[9/16] bg-white shadow-2xl overflow-hidden flex flex-col h-[100dvh]">
        {/* Sync Indicator */}
        {isSyncing && (
          <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-pink-50 flex items-center space-x-2 animate-fade-in">
            <Loader2 className="animate-spin text-pink-400" size={12} />
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-tighter">Syncing</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {(() => {
            if (!currentUser && !['WELCOME', 'REGISTER', 'LOGIN'].includes(currentScreen)) return <Welcome onNavigate={navigateTo} />;
            switch (currentScreen) {
              case 'WELCOME': return <Welcome onNavigate={navigateTo} />;
              case 'REGISTER': return <Register onNavigate={navigateTo} onRegister={async (u) => {
                const users = await CloudAPI.getUsers();
                users.push(u);
                await CloudAPI.saveUsers(users);
                setCurrentUser(u);
                localStorage.setItem('mb_current_user', JSON.stringify(u));
                setCurrentScreen('HOME');
              }} />;
              case 'LOGIN': return <Login onNavigate={navigateTo} onLogin={async (p, pass) => {
                const users = await CloudAPI.getUsers();
                const u = users.find(user => user.phone === p && user.password === pass);
                if (u) {
                  setCurrentUser(u);
                  localStorage.setItem('mb_current_user', JSON.stringify(u));
                  setCurrentScreen('HOME');
                  return true;
                }
                return false;
              }} />;
              case 'HOME': return <Home user={currentUser!} onNavigate={navigateTo} />;
              case 'GIFTS': return <Gifts onNavigate={navigateTo} />;
              case 'PROFILE': return <Profile user={currentUser!} onNavigate={navigateTo} onLogout={handleLogout} />;
              case 'BANKING': return <Banking onNavigate={navigateTo} user={currentUser!} onAddBank={async (bank) => {
                const updated = { ...currentUser!, banks: [...(currentUser!.banks || []), bank] };
                await CloudAPI.updateUser(updated);
                setCurrentUser(updated);
              }} />;
              case 'SECURITY': return <Security onNavigate={navigateTo} user={currentUser!} />;
              case 'NOTIFICATIONS': return <Notifications user={currentUser!} onNavigate={navigateTo} />;
              case 'TRANSACTION': return <Transaction user={currentUser!} type={transactionType} onNavigate={navigateTo} />;
              case 'ADMIN_DASHBOARD': return <AdminDashboard onNavigate={navigateTo} onApproveTransaction={handleApproveTransaction} onRejectTransaction={handleRejectTransaction} />;
              default: return <Welcome onNavigate={navigateTo} />;
            }
          })()}
        </div>
        {['HOME', 'GIFTS', 'PROFILE', 'BANKING', 'SECURITY', 'NOTIFICATIONS'].includes(currentScreen) && (
          <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} />
        )}
      </div>
    </div>
  );
};

export default App;
