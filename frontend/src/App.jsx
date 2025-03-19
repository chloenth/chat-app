import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log('authUser: ', authUser);

  if (isCheckingAuth && !authUser)
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/signup' element={<SignUpPage />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/settings' element={<SettingsPage />}></Route>
        <Route path='/profile' element={<ProfilePage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
