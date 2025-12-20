import React, { useState } from 'react';
import { Supplier } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { SupplyHistoryModal } from './SupplyHistoryTable';

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onView: (supplier: Supplier) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({ 
  suppliers, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const [historyModal, setHistoryModal] = useState<{ open: boolean; supplierName: string }>({
    open: false,
    supplierName: '',
  });

  const openHistory = (supplierName: string) => {
    setHistoryModal({ open: true, supplierName });
  };

  const closeHistory = () => {
    setHistoryModal({ open: false, supplierName: '' });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Контактное лицо</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Дата добавления</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length > 0 ? (
            suppliers.map(supplier => (
              <TableRow 
                key={supplier.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onView(supplier)}
              >
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.supervisor || '-'}</TableCell>
                <TableCell>{supplier.supervisor_pn || '-'}</TableCell>
                <TableCell>{format(new Date(supplier.date_added), 'dd.MM.yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Открыть меню</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(supplier)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Просмотр
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openHistory(supplier.name)}>
                        История поставок
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(supplier)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(supplier.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Поставщики не найдены.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <SupplyHistoryModal
        isOpen={historyModal.open}
        onClose={closeHistory}
        supplierName={historyModal.supplierName}
      />
    </>
  );
};