import { useState } from 'react';
import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import MenuView from './components/MenuView';
import AnalyticsView from './components/AnalyticsView';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);

  return (
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Навигация */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-amber-700">Cafe Order</h1>
          <div className="space-x-4">
            {!user ? (
                <>
                  <button onClick={() => setPage('login')} className="hover:text-amber-700 transition">Войти</button>
                  <button onClick={() => setPage('register')} className="hover:text-amber-700 transition">Регистрация</button>
                </>
            ) : (
                <>
                  <span>Привет, {user.name}</span>
                  <button onClick={() => { setUser(null); setPage('home'); }} className="hover:text-amber-700 transition">Выйти</button>
                </>
            )}
          </div>
        </nav>

        {/* Контент */}
        <main className="container mx-auto py-8 px-4">
          {page === 'home' && <HomeView onLogin={() => setPage('login')} />}
          {page === 'login' && <LoginView onLogin={(userData) => { setUser(userData); setPage('menu'); }} />}
          {page === 'register' && <RegisterView onRegister={(userData) => { setUser(userData); setPage('menu'); }} />}
          {page === 'menu' && <MenuView />}
          {page === 'analytics' && <AnalyticsView />}
        </main>

        {/* Футер */}
        <footer className="bg-white shadow-inner mt-12 py-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Cafe Order — частное кафе
        </footer>
      </div>
  );
}