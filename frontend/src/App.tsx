import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import Suppliers from "./pages/Suppliers";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import History from "./pages/History";

const queryClient = new QueryClient();

const App = () => {
  // ++ НАЧАЛО ИЗМЕНЕНИЙ: Блокировка контекстного меню ++
  useEffect(() => {
    // Функция-обработчик, которая отменяет действие по умолчанию для события
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Добавляем слушатель события 'contextmenu' на весь документ
    document.addEventListener('contextmenu', handleContextMenu);

    // Функция очистки: удаляем слушатель, когда компонент размонтируется
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании
  // ++ КОНЕЦ ИЗМЕНЕНИЙ ++

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/history" element={<History/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
