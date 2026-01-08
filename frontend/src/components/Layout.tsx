import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  Plus, 
  User, 
  Store, 
  Shield,
  LogOut,
  Settings,
  History,
  Menu,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  onAddSupplyClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onAddSupplyClick }) => {
  const location = useLocation();
  const { user, logout, isAdmin, isEmployee } = useAuth();
  const isHomePage = location.pathname === '/';

  // Функция для отображения роли на русском
  const getRoleLabel = () => {
    if (isAdmin) return 'Администратор';
    if (isEmployee) return 'Сотрудник';
    return 'Пользователь';
  };

  // Функция для получения цвета роли
  const getRoleColor = () => {
    if (isAdmin) return 'bg-purple-100 text-purple-900';
    if (isEmployee) return 'bg-blue-100 text-blue-900';
    return 'bg-gray-100 text-gray-900';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Левая часть: Навигация */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Мобильное меню для навигации */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden h-9 w-9 p-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/app" className="flex items-center gap-2 w-full">
                    <Home className="h-4 w-4" />
                    Главная
                  </Link>
                </DropdownMenuItem>
                
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-800">
                  Контрагенты
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/clients" className="w-full text-gray-800">
                    Покупатели
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/suppliers" className="w-full text-gray-800">
                    Поставщики
                  </Link>
                </DropdownMenuItem>
                
                {isAdmin && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-800">
                      Администрирование
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/finance" className="flex items-center gap-2 w-full text-gray-800">
                        Финансы
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Десктопная навигация */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link 
                to="/app" 
                className="text-gray-900 hover:text-blue-700 px-2 lg:px-3 py-1.5 lg:py-2 rounded-md hover:bg-gray-100 transition-colors font-semibold text-sm lg:text-base"
              >
                Главная
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-900 hover:text-blue-700 px-2 lg:px-3 py-1.5 lg:py-2 rounded-md hover:bg-gray-100 transition-colors font-semibold text-sm lg:text-base">
                  Контрагенты <ChevronDown className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/clients" className="w-full flex items-center text-gray-800 font-medium">
                      Покупатели
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/suppliers" className="w-full flex items-center text-gray-800 font-medium">
                      Поставщики
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isAdmin && (
                <Link 
                  to="/finance" 
                  className="text-gray-900 hover:text-blue-700 px-2 lg:px-3 py-1.5 lg:py-2 rounded-md hover:bg-gray-100 transition-colors font-semibold text-sm lg:text-base"
                >
                  Финансы
                </Link>
              )}
            </div>

            {/* Кнопка добавления поставки (только на главной) */}
            {isHomePage && onAddSupplyClick && (
              <Button 
                onClick={onAddSupplyClick}
                className="gap-1 sm:gap-2 bg-blue-700 hover:bg-blue-800 text-xs sm:text-sm font-semibold"
                size="sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Новая поставка</span>
                <span className="xs:hidden">Добавить</span>
              </Button>
            )}
          </div>

          {/* Правая часть: Информация о пользователе */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {user ? (
              <>
                {/* Информация о магазине (только на десктопе среднего размера и больше) */}
                {user.profile?.store && (
                  <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    <Store className="h-4 w-4 text-gray-700" />
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900 truncate max-w-[120px] xl:max-w-[180px]">
                        {user.profile.store.name || 'Магазин'}
                      </div>
                      <div className="text-xs text-gray-700 truncate max-w-[120px] xl:max-w-[180px]">
                        {user.profile.store.code || user.profile.store.address || 'Магазин'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Информация о пользователе (только на десктопе) */}
                <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                  <div className="text-right hidden lg:block">
                    <div className="font-semibold text-gray-900 text-sm truncate max-w-[100px] xl:max-w-[150px]">
                      {user.username}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor()} inline-block mt-1 font-medium`}>
                      {getRoleLabel()}
                    </div>
                  </div>
                  
                  {/* Сокращенная информация на средних экранах */}
                  <div className="lg:hidden flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">
                        {user.username.split(' ')[0]}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor()} mt-1 font-medium`}>
                        {isAdmin ? 'Админ' : isEmployee ? 'Сотр.' : 'Польз.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Выпадающее меню пользователя */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 sm:h-9 sm:w-auto sm:px-2 sm:gap-1 lg:gap-2 text-gray-800 hover:text-gray-900"
                    >
                      <User className="h-4 w-4" />
                      <ChevronDown className="hidden sm:block h-3 w-3" />
                      <span className="hidden lg:inline text-sm font-medium">Профиль</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 sm:w-64">
                    {/* Информация в заголовке */}
                    <div className="px-3 py-2 border-b border-gray-200">
                      <div className="font-semibold text-gray-900 truncate">{user.username}</div>
                      <div className="text-xs text-gray-700 flex items-center gap-1 mt-1 font-medium">
                        {isAdmin && <Shield className="h-3 w-3" />}
                        {getRoleLabel()}
                      </div>
                      {user.email && (
                        <div className="text-xs text-gray-700 truncate mt-1">{user.email}</div>
                      )}
                    </div>

                    {/* Магазин в меню */}
                    {user.profile?.store && (
                      <div className="px-3 py-2 border-b border-gray-200">
                        <div className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                          <Store className="h-3 w-3" />
                          Магазин
                        </div>
                        <div className="text-sm text-gray-900 mt-1 truncate font-medium">
                          {user.profile.store.name}
                        </div>
                        {user.profile.store.code && (
                          <div className="text-xs text-gray-700 truncate">
                            Код: {user.profile.store.code}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Меню */}
                    <DropdownMenuItem asChild className="px-3 py-2 text-gray-800 hover:bg-gray-100">
                      <Link to="/history" className="flex items-center gap-2 cursor-pointer w-full font-medium">
                        <History className="h-4 w-4" />
                        <span>История действий</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {isAdmin && (
                      <DropdownMenuItem asChild className="px-3 py-2 text-gray-800 hover:bg-gray-100">
                        <Link to="/settings" className="flex items-center gap-2 cursor-pointer w-full font-medium">
                          <Settings className="h-4 w-4" />
                          <span>Настройки системы</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem 
                      onClick={() => logout()}
                      className="px-3 py-2 flex items-center gap-2 text-red-700 hover:bg-red-50 cursor-pointer font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Выйти из системы</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Если пользователь не аутентифицирован
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 text-gray-800 font-medium"
                  >
                    Вход
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Баннер информации о магазине для мобильных и планшетов */}
        {user?.profile?.store && (
          <div className="md:hidden mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Store className="h-5 w-5 text-gray-700" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 truncate">{user.profile.store.name}</div>
                  <div className="text-sm text-gray-700 truncate font-medium">
                    {user.username} • {getRoleLabel()}
                  </div>
                </div>
              </div>
            </div>
            {user.profile.store.code && (
              <div className="mt-2 text-xs text-gray-700 font-medium">
                Код магазина: {user.profile.store.code}
              </div>
            )}
          </div>
        )}

        {children}
      </main>

      {/* Мобильное нижнее меню для быстрой навигации */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
          <div className="flex justify-between items-center">
            <Link 
              to="/app" 
              className={`flex flex-col items-center space-y-1 p-2 ${isHomePage ? 'text-blue-700' : 'text-gray-800'}`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Главная</span>
            </Link>
            
            <Link 
              to="/clients" 
              className="flex flex-col items-center space-y-1 p-2 text-gray-800"
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Клиенты</span>
            </Link>
            
            {isHomePage && onAddSupplyClick && (
              <button 
                onClick={onAddSupplyClick}
                className="flex flex-col items-center space-y-1 p-2 -mt-6 bg-blue-700 text-white rounded-full h-14 w-14 justify-center shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </button>
            )}
            
            <Link 
              to="/suppliers" 
              className="flex flex-col items-center space-y-1 p-2 text-gray-800"
            >
              <Store className="h-5 w-5" />
              <span className="text-xs font-medium">Поставщики</span>
            </Link>
            
            {isAdmin && (
              <Link 
                to="/finance" 
                className="flex flex-col items-center space-y-1 p-2 text-gray-800"
              >
                <Shield className="h-5 w-5" />
                <span className="text-xs font-medium">Финансы</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Отступ для мобильного меню */}
      {user && <div className="md:hidden h-16"></div>}
    </div>
  );
};