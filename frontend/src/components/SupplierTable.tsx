import React, { useState } from 'react';
import { Supplier } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2, History } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { SupplyHistoryModal } from './SupplyHistoryTable';
import { SupplyFullView } from '@/components/SupplyFullView';

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onView: (supplier: Supplier) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({ 
  suppliers, 
  onEdit, 
  onDelete, 
  onView,
  canEdit = true,
  canDelete = true 
}) => {
  const [historyModal, setHistoryModal] = useState<{ open: boolean; supplierName: string; supplierId?: string }>({
    open: false,
    supplierName: '',
  });
  
  const [fullViewSupply, setFullViewSupply] = useState<any | null>(null);

  const openHistory = (supplierName: string, supplierId?: string) => {
    setHistoryModal({ open: true, supplierName, supplierId });
  };

  const closeHistory = () => {
    setHistoryModal({ open: false, supplierName: '' });
  };

  const handleRowClick = (e: React.MouseEvent, supplier: Supplier) => {
    // Проверяем, был ли клик по элементу внутри дропдауна
    const isDropdownClick = (e.target as HTMLElement).closest('[data-dropdown]');
    if (!isDropdownClick) {
      onView(supplier);
    }
  };

  const handleSupplySelect = (supply: any) => {
    setFullViewSupply(supply);
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
                className="hover:bg-gray-50"
                onClick={(e) => handleRowClick(e, supplier)}
              >
                <TableCell className="font-medium cursor-pointer">
                  <div className="flex items-center gap-2">
                    {supplier.name}
                    {supplier.is_everyday_supply && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        ежедневная
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="cursor-pointer">
                  {supplier.representative || '-'}
                </TableCell>
                <TableCell className="cursor-pointer">
                  {supplier.representative_pn || '-'}
                </TableCell>
                <TableCell className="cursor-pointer">
                  {format(new Date(supplier.date_added), 'dd.MM.yyyy')}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        data-dropdown="true"
                      >
                        <span className="sr-only">Открыть меню</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" data-dropdown="true">
                      <DropdownMenuItem onClick={() => onView(supplier)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Просмотр
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openHistory(supplier.name, supplier.id)}>
                        <History className="h-4 w-4 mr-2" />
                        История поставок
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {canEdit && (
                        <DropdownMenuItem onClick={() => onEdit(supplier)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem 
                          onClick={() => onDelete(supplier.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      )}
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
        supplierId={historyModal.supplierId}
        onSelectSupply={handleSupplySelect}
      />

      {fullViewSupply && (
        <SupplyFullView
          supply={fullViewSupply}
          open={!!fullViewSupply}
          onOpenChange={(open) => !open && setFullViewSupply(null)}
        />
      )}
    </>
  );
};