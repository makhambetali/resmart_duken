// [file name]: ClientTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Client } from '@/types/client';
import { ChevronLeft, ChevronRight, Phone, User, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientTableProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  totalCount: number;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onEditClient,
  onDeleteClient,
  totalCount,
  currentPage,
  perPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / perPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(value) + ' ₸';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Mobile card view
  const MobileClientCard = ({ client }: { client: Client }) => (
    <Card 
      className="mb-3 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onEditClient(client)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-base truncate">{client.name}</h3>
              {client.is_chosen && (
                <Badge className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5">
                  избранный
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              {client.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="truncate">{client.phone_number}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className={`font-medium ${client.debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(client.debt)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatDateTime(client.last_accessed)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-3">
            <User className="h-12 w-12 mx-auto text-gray-300" />
            <div className="text-gray-500 text-base">Клиенты не найдены</div>
            <p className="text-sm text-gray-400">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Долг</TableHead>
                  <TableHead>Последняя активность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onEditClient(client)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {client.name}
                        {client.is_chosen && (
                          <Badge className="text-xs bg-amber-100 text-amber-800">
                            избранный
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{client.phone_number || '-'}</TableCell>
                    <TableCell>
                      <span className={client.debt > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                        {formatCurrency(client.debt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{formatDateTime(client.last_accessed)}</span>
                        <span className="text-xs">{formatTime(client.last_accessed)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {clients.map((client) => (
          <MobileClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Страница {currentPage} из {totalPages} • Всего: {totalCount}
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 3) {
                  page = i + 1;
                } else if (currentPage === 1) {
                  page = i + 1;
                } else if (currentPage === totalPages) {
                  page = totalPages - 2 + i;
                } else {
                  page = currentPage - 1 + i;
                }

                if (page > totalPages || page < 1) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};