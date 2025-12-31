
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

  useEffect(() => {
    const initApp = async () => {
      setIsSyncing(true);
      try {
        const user = await CloudAPI.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setCurrentScreen('HOME');
        }
      } catch (e) {
        console.error("Lỗi khởi tạo:", e);
      } finally {
        setIsSyncing(false);
      }
    };
    initApp();
  }, []);

  // Real-time Watcher: Cập nhật thông tin mẹ ngay lập tức nếu Admin sửa trên Cloud
  useEffect(() => {
    if (!currentUser) return;

    const syncInterval = setInterval(async () => {
      try {
        const users = await CloudAPI.getUsers();
        const freshData = users.find(u => u.phone === currentUser.phone);
        if (freshData && JSON.stringify(freshData) !== JSON.stringify(currentUser)) {
          setCurrentUser(freshData);
        }
      } catch (e) {
        console.warn("Mất kết nối Cloud tạm thời...");
      }
    }, 4000);

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
    try {
      const txs = await CloudAPI.getTransactions();
      const tx = txs.find(t => t.id === txId);
      if (tx && tx.status === 'PENDING') {
        const users = await CloudAPI.getUsers();
        const user = users.find(u => u.phone === tx.userPhone);
        
        if (user) {
          user.balance += (tx.type === 'DEPOSIT' ? tx.amount : -tx.amount);
          tx.status = 'APPROVED';
          
          await CloudAPI.updateUser(user);
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
    } catch (e) {
      alert("Lỗi phê duyệt: " + e);
    }
    setIsSyncing(false);
  };

  const handleRejectTransaction = async (txId: string, reason: string) => {
    setIsSyncing(true);
    try {
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
    } catch (e) {
      alert("Lỗi từ chối: " + e);
    }
    setIsSyncing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('mb_session_phone');
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
        {isSyncing && (
          <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-pink-50 flex items-center space-x-2">
            <Loader2 className="animate-spin text-pink-400" size={12} />
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-tighter">Đồng bộ Cloud</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {(() => {
            if (!currentUser && !['WELCOME', 'REGISTER', 'LOGIN'].includes(currentScreen)) return <Welcome onNavigate={navigateTo} />;
            switch (currentScreen) {
              case 'WELCOME': return <Welcome onNavigate={navigateTo} />;
              case 'REGISTER': return <Register onNavigate={navigateTo} onRegister={async (u) => {
                setIsSyncing(true);
                try {
                  await CloudAPI.createUser(u);
                  setCurrentUser(u);
                  localStorage.setItem('mb_session_phone', u.phone);
                  setCurrentScreen('HOME');
                } catch (e) {
                  alert("Số điện thoại này đã tồn tại trên Cloud!");
                }
                setIsSyncing(false);
              }} />;
              case 'LOGIN': return <Login onNavigate={navigateTo} onLogin={async (p, pass) => {
                setIsSyncing(true);
                try {
                  const users = await CloudAPI.getUsers();
                  const u = users.find(user => user.phone === p && user.password === pass);
                  if (u) {
                    setCurrentUser(u);
                    localStorage.setItem('mb_session_phone', u.phone);
                    setCurrentScreen('HOME');
                    return true;
                  }
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsSyncing(false);
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
