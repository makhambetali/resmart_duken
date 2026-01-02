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
  History
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
    if (isAdmin) return 'bg-purple-100 text-purple-800';
    if (isEmployee) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Левая часть: Навигация */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/app" 
              className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              Главная
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium">
                Контрагенты <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/clients" className="w-full flex items-center">
                    Покупатели
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/suppliers" className="w-full flex items-center">
                    Поставщики
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="/finance" 
              className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              Финансы
            </Link>

            {/* Кнопка добавления поставки (только на главной) */}
            {isHomePage && onAddSupplyClick && (
              <Button 
                onClick={onAddSupplyClick}
                className="gap-2 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Новая поставка
              </Button>
            )}
          </div>

          {/* Правая часть: Информация о пользователе */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Информация о магазине (если есть) */}
                {user.profile?.store && (
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg border">
                    <Store className="h-4 w-4 text-gray-600" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {user.profile.store.name || 'Магазин'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.profile.store.code || user.profile.store.address || 'Магазин'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Информация о пользователе */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {user.username}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor()} inline-block`}>
                      {getRoleLabel()}
                    </div>
                  </div>
                  {/* <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div> */}
                </div>

                {/* Выпадающее меню пользователя */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {/* Информация в заголовке */}
                    <div className="px-2 py-1.5 border-b">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {isAdmin && <Shield className="h-3 w-3" />}
                        {getRoleLabel()}
                      </div>
                      {user.email && (
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      )}
                    </div>

                    {/* Магазин в меню */}
                    {user.profile?.store && (
                      <div className="px-2 py-1.5 border-b">
                        <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                          <Store className="h-3 w-3" />
                          Магазин
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {user.profile.store.name}
                        </div>
                        {user.profile.store.code && (
                          <div className="text-xs text-gray-500">
                            Код: {user.profile.store.code}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Меню */}
                    <DropdownMenuItem asChild>
                      <Link to="/history" className="flex items-center gap-2 cursor-pointer">
                        <History className="h-4 w-4" />
                        История действий
                      </Link>
                    </DropdownMenuItem>
                    
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          Настройки системы
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem 
                      onClick={() => logout()}
                      className="flex items-center gap-2 text-red-600 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Выйти из системы
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Мобильная версия (только иконка) */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5">
                        <div className="font-medium">{user.username}</div>
                        <div className={`text-xs ${getRoleColor()} px-2 py-0.5 rounded-full inline-block`}>
                          {getRoleLabel()}
                        </div>
                      </div>
                      
                      {user.profile?.store && (
                        <div className="px-2 py-1.5 border-y">
                          <div className="text-xs font-medium">Магазин</div>
                          <div className="text-sm">{user.profile.store.name}</div>
                        </div>
                      )}
                      
                      <DropdownMenuItem asChild>
                        <Link to="/history">История</Link>
                      </DropdownMenuItem>
                      
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/settings">Настройки</Link>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                        Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              // Если пользователь не аутентифицирован
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Вход
                  </Button>
                </Link>
                
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Баннер информации о магазине для мобильных */}
        {user?.profile?.store && (
          <div className="md:hidden mb-4 p-3 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Store className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">{user.profile.store.name}</div>
                  <div className="text-sm text-gray-500">
                    {user.username} • {getRoleLabel()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {children}
      </main>
    </div>
  );
};