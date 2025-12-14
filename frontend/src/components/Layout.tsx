
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onAddSupplyClick?: () => void; // новый проп
}

export const Layout: React.FC<LayoutProps> = ({ children, onAddSupplyClick }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Главная
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors">
                Контрагенты <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/clients" className="w-full">Покупатели</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/suppliers" className="w-full">Поставщики</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="/finance" 
              className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Финансы
            </Link>
{/* 
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors">
                Профиль <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Профиль</DropdownMenuItem>
                <DropdownMenuItem asChild>
  <Link to="/history">История</Link>
</DropdownMenuItem>

                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">Настройки</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Выйти</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>


        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
