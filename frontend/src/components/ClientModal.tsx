import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client, AddClientForm, ClientDebt } from '@/types/client';
import { clientsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface ClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSubmit: (data: AddClientForm) => void;
  onDelete: (id: string) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  open,
  onOpenChange,
  client,
  onSubmit,
  onDelete,
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<AddClientForm>({
    name: '',
    phone_number: '',
    description: '',
    is_chosen: false,
  });
  
  const [newDebtValue, setNewDebtValue] = useState<string>('');
  const [showDebtForm, setShowDebtForm] = useState(false);

  // Загрузка долгов клиента
  const { data: debts = [] } = useQuery({
    queryKey: ['client-debts', client?.id],
    queryFn: () => client ? clientsApi.getClientDebts(client.id) : Promise.resolve([]),
    enabled: !!client?.id,
  });

  // Мутации для долгов
  const addDebtMutation = useMutation({
    mutationFn: ({ id, debt_value }: { id: string; debt_value: number }) =>
      clientsApi.addDebt(id, debt_value),
    onSuccess: () => {
      toast({ title: 'Долг добавлен' });
      queryClient.invalidateQueries({ queryKey: ['client-debts', client?.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setNewDebtValue('');
      setShowDebtForm(false);
    },
    onError: () => {
      toast({ title: 'Ошибка добавления долга', variant: 'destructive' });
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: clientsApi.deleteDebt,
    onSuccess: () => {
      toast({ title: 'Долг удален' });
      queryClient.invalidateQueries({ queryKey: ['client-debts', client?.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: () => {
      toast({ title: 'Ошибка удаления долга', variant: 'destructive' });
    },
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        phone_number: client.phone_number || '',
        description: client.description || '',
        is_chosen: client.is_chosen,
      });
    } else {
      setFormData({
        name: '',
        phone_number: '',
        description: '',
        is_chosen: false,
      });
    }
    setShowDebtForm(false);
    setNewDebtValue('');
  }, [client, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: 'Укажите имя клиента', variant: 'destructive' });
      return;
    }
    onSubmit(formData);
  };

  const handleAddDebt = () => {
    const debtValue = parseFloat(newDebtValue);
    if (isNaN(debtValue) || debtValue === 0) {
      toast({ title: 'Введите корректную сумму долга', variant: 'destructive' });
      return;
    }
    if (client) {
      addDebtMutation.mutate({ id: client.id, debt_value: debtValue });
    }
  };

  const handleDeleteDebt = (debtId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту запись о долге?')) {
      deleteDebtMutation.mutate(debtId);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(value) + ' ₸';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? `Редактирование: ${client.name}` : 'Добавить клиента'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Имя клиента"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="Номер телефона"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Дополнительная информация о клиенте"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_chosen"
              checked={formData.is_chosen}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_chosen: !!checked }))}
            />
            <Label htmlFor="is_chosen">Избранный клиент</Label>
          </div>

          {client && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Долги клиента</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDebtForm(!showDebtForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить долг
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {showDebtForm && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={newDebtValue}
                      onChange={(e) => setNewDebtValue(e.target.value)}
                      placeholder="Сумма долга"
                    />
                    <Button type="button" onClick={handleAddDebt}>
                      Сохранить
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowDebtForm(false);
                        setNewDebtValue('');
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                )}

                {debts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead className="w-20">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {debts.map((debt) => (
                        <TableRow key={debt.id}>
                          <TableCell>{formatDate(debt.date_added)}</TableCell>
                          <TableCell>
                            <span className={debt.debt_value > 0 ? 'text-red-600' : 'text-green-600'}>
                              {formatCurrency(debt.debt_value)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDebt(debt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Нет записей о долгах
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <DialogFooter className="flex justify-between">
            {client && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm('Вы уверены, что хотите удалить клиента?')) {
                    onDelete(client.id);
                    onOpenChange(false);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить клиента
              </Button>
            )}
            <div className="space-x-2">
            
              <Button type="submit">
                {client ? 'Сохранить' : 'Добавить'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};