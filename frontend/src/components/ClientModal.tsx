import React, { useState, useEffect, useRef } from 'react';
import { IMaskInput } from 'react-imask';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client, AddClientForm, ClientDebt } from '@/types/client';
import { clientsApi, employeesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { ClientSearchCombobox } from './ClientSearchCombobox';

const phoneMask = '+{7} (000) 000-00-00';
const inputClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

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
  
  const debtInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AddClientForm>({
    name: '',
    phone_number: '',
    description: '',
    is_chosen: false,
  });
  
  const [newDebtValue, setNewDebtValue] = useState<string>('');
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [responsibleEmployeeId, setResponsibleEmployeeId] = useState<string>('');
  
  // Состояния для второй вкладки
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [quickDebtValue, setQuickDebtValue] = useState<string>('');
  const [quickResponsibleEmployeeId, setQuickResponsibleEmployeeId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('manage');

  const { data: employees = [] } = useQuery<Array<{ id: number; name: string }>>({
    queryKey: ['employees'],
    queryFn: employeesApi.getEmployees,
  });

  const { data: debts = [] } = useQuery({
    queryKey: ['client-debts', client?.id],
    queryFn: () => client ? clientsApi.getClientDebts(client.id) : Promise.resolve([]),
    enabled: !!client?.id && open && activeTab === 'manage', // Только в управлении клиентом
  });

  const addDebtMutation = useMutation({
    mutationFn: ({ id, debt_value, responsible_employee_id }: { id: string; debt_value: number, responsible_employee_id:string }) =>
      clientsApi.addDebt( id, debt_value, responsible_employee_id ),
    onSuccess: () => {
      toast({ title: 'Долг добавлен', variant: 'default', className: "bg-green-500 text-white", });
      queryClient.invalidateQueries({ queryKey: ['client-debts', client?.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setNewDebtValue('');
      setShowDebtForm(false);
    },
    onError: () => {
      toast({ title: 'Ошибка добавления долга', variant: 'destructive' });
    },
  });

  const addQuickDebtMutation = useMutation({
    mutationFn: ({ id, debt_value, responsible_employee_id }: { id: string; debt_value: number, responsible_employee_id:string }) =>
      clientsApi.addDebt( id, debt_value, responsible_employee_id ),
    onSuccess: () => {
      toast({ title: `Долг успешно добавлен для ${selectedClientName}`, variant: 'default', className: "bg-green-500 text-white", });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setSelectedClientId('');
      setSelectedClientName('');
      setQuickDebtValue('');
      setQuickResponsibleEmployeeId('');
      onOpenChange(false); // Закрываем модалку после успешного добавления
    },
    onError: () => {
      toast({ title: 'Ошибка добавления долга', variant: 'destructive' });
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: clientsApi.deleteDebt,
    onSuccess: () => {
      toast({ title: 'Долг удален', variant: 'default', className: "bg-green-500 text-white", });
      queryClient.invalidateQueries({ queryKey: ['client-debts', client?.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: () => {
      toast({ title: 'Ошибка удаления долга', variant: 'destructive' });
    },
  });

  // ++ ИСПРАВЛЕНИЕ: При редактировании сразу открываем вкладку добавления долга ++
  useEffect(() => {
    if (open) {
      if (client) {
        // Режим редактирования - заполняем форму данными клиента И открываем вкладку добавления долга
        setFormData({
          name: client.name,
          phone_number: client.phone_number || '',
          description: client.description || '',
          is_chosen: client.is_chosen,
        });
        setSelectedClientId(client.id);
        setSelectedClientName(client.name);
        setActiveTab('quick-debt'); // ++ СРАЗУ ОТКРЫВАЕМ ВКЛАДКУ ДОБАВЛЕНИЯ ДОЛГА ++
      } else {
        // Режим добавления - очищаем форму
        setFormData({ name: '', phone_number: '', description: '', is_chosen: false });
        setActiveTab('manage');
      }
      
      // Сбрасываем остальные состояния
      setNewDebtValue('');
      setResponsibleEmployeeId('');
      setQuickDebtValue('');
      setQuickResponsibleEmployeeId('');
      setShowDebtForm(false);
    }
  }, [open, client]);

  // ++ ФОКУС НА ПОЛЕ СУММЫ ДОЛГА ПРИ ОТКРЫТИИ ВКЛАДКИ ДОБАВЛЕНИЯ ДОЛГА ++
  useEffect(() => {
    if (open && activeTab === 'quick-debt') {
      const timer = setTimeout(() => {
        debtInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, activeTab]);

  // Фокус при смене вкладок
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (activeTab === 'manage') {
          nameInputRef.current?.focus();
        } else if (activeTab === 'quick-debt') {
          debtInputRef.current?.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: 'Укажите имя клиента', variant: 'destructive' });
      return;
    }
    onSubmit(formData);
  };
  
  const handleDebtInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isNegative = value.startsWith('-');
    let numericValue = value.replace(/[^\d]/g, '');
    if (numericValue.length > 6) {
      numericValue = numericValue.slice(0, 6);
    }
    const formattedNumericPart = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (isNegative) {
      setNewDebtValue(formattedNumericPart ? `- ${formattedNumericPart}` : '-');
    } else {
      setNewDebtValue(formattedNumericPart);
    }
  };

  const handleAddDebt = () => {
    const rawValue = newDebtValue.replace(/\s/g, '');
    const debtValue = parseFloat(rawValue);
    if (isNaN(debtValue) || debtValue === 0) {
      toast({ title: 'Введите корректную сумму долга', variant: 'destructive' });
      return;
    }
    if (!responsibleEmployeeId) {
      toast({ title: 'Выберите ответственного сотрудника', variant: 'destructive' });
      return;
    }
    if (client) {
      addDebtMutation.mutate({ id: client.id, debt_value: debtValue, responsible_employee_id: responsibleEmployeeId });
    }
  };

  const handleQuickDebtInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isNegative = value.startsWith('-');
    let numericValue = value.replace(/[^\d]/g, '');
    if (numericValue.length > 6) {
      numericValue = numericValue.slice(0, 6);
    }
    const formattedNumericPart = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (isNegative) {
      setQuickDebtValue(formattedNumericPart ? `- ${formattedNumericPart}` : '-');
    } else {
      setQuickDebtValue(formattedNumericPart);
    }
  };

  const handleAddQuickDebt = () => {
    if (!selectedClientId) {
      toast({ title: 'Выберите клиента', variant: 'destructive' });
      return;
    }
    const rawValue = quickDebtValue.replace(/\s/g, '');
    const debtValue = parseFloat(rawValue);
    if (isNaN(debtValue) || debtValue === 0) {
      toast({ title: 'Введите корректную сумму долга', variant: 'destructive' });
      return;
    }
    if (!quickResponsibleEmployeeId) {
      toast({ title: 'Выберите ответственного сотрудника', variant: 'destructive' });
      return;
    }
    addQuickDebtMutation.mutate({ 
      id: selectedClientId, 
      debt_value: debtValue, 
      responsible_employee_id: quickResponsibleEmployeeId 
    });
  };

  const handleAddNewClientFromSearch = (clientName: string) => {
    setFormData(prev => ({ ...prev, name: clientName }));
    setActiveTab('manage');
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  const handleDeleteDebt = (debtId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту запись о долге?')) {
      deleteDebtMutation.mutate(debtId);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(value) + ' ₸';
  };

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('ru-RU', options);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? `Добавление долга: ${client.name}` : 'Управление клиентами'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manage">
              {client ? 'Редактировать клиента' : 'Добавить клиента'}
            </TabsTrigger>
            <TabsTrigger value="quick-debt">
              {client ? 'Добавить долг' : 'Добавить долг клиенту'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя *</Label>
                  <Input 
                    ref={nameInputRef}
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                    placeholder="Имя клиента" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <IMaskInput mask={phoneMask} id="phone" value={formData.phone_number} onAccept={(value) => setFormData(prev => ({ ...prev, phone_number: value as string }))} className={inputClassName} placeholder="+7 (___) ___-__-__" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Дополнительная информация о клиенте" rows={3} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="is_chosen" checked={formData.is_chosen} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_chosen: !!checked }))} />
                <Label htmlFor="is_chosen">Избранный клиент</Label>
              </div>

              {/* ++ УБРАНА ФОРМА ДОБАВЛЕНИЯ ДОЛГА ИЗ РЕДАКТИРОВАНИЯ ++ */}
              {client && debts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">История долгов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Дата</TableHead>
                          <TableHead>Сумма</TableHead>
                          <TableHead>Отв. лицо</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {debts.map((debt) => (
                          <TableRow key={debt.id}>
                            <TableCell>{formatDateTime(debt.date_added)}</TableCell>
                            <TableCell>
                              <span className={debt.debt_value > 0 ? 'text-red-600' : 'text-green-600'}>
                                {formatCurrency(debt.debt_value)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {employees.find(emp => emp.id === debt.responsible_employee_id)?.name ?? 'Неизвестно'}
                            </TableCell>
                            <TableCell>
                              <Button type="button" variant="outline" size="sm" onClick={() => handleDeleteDebt(debt.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              <DialogFooter className="flex justify-between">
                {client && (
                  <Button type="button" variant="destructive" onClick={() => {
                    if (confirm('Вы уверены, что хотите удалить клиента?')) {
                      onDelete(client.id);
                      onOpenChange(false);
                    }
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить клиента
                  </Button>
                )}
                <div className="space-x-2">
                  <Button type="submit">{client ? 'Сохранить' : 'Добавить'}</Button>
                </div>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="quick-debt" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {client ? `Добавление долга для: ${client.name}` : 'Быстрое добавление долга'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-search">Клиент *</Label>
                  {client ? (
                    // ++ ЕСЛИ РЕДАКТИРУЕМ КЛИЕНТА, ПОКАЗЫВАЕМ ЕГО ИМЯ КАК ВЫБРАННОЕ ++
                    <div className="p-3 border rounded-md bg-muted/50">
                      <p className="font-medium">{client.name}</p>
                      {client.phone_number && (
                        <p className="text-sm text-muted-foreground">{client.phone_number}</p>
                      )}
                    </div>
                  ) : (
                    // ++ ЕСЛИ ДОБАВЛЯЕМ НОВЫЙ ДОЛГ, ПОКАЗЫВАЕМ ПОИСК ++
                    <ClientSearchCombobox
                      value={selectedClientId}
                      onValueChange={(clientId, clientName) => {
                        setSelectedClientId(clientId);
                        setSelectedClientName(clientName);
                      }}
                      onAddNewClient={handleAddNewClientFromSearch}
                      placeholder="Найдите клиента..."
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quick_debt_value">Сумма долга *</Label>
                  <Input
                    ref={debtInputRef}
                    id="quick_debt_value"
                    type="text"
                    value={quickDebtValue}
                    onChange={handleQuickDebtInputChange}
                    placeholder="Например: -50 000"
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground">
                    Положительное число для долга клиента, отрицательное для переплаты
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quick_employee">Ответственный сотрудник *</Label>
                  <Select value={quickResponsibleEmployeeId} onValueChange={setQuickResponsibleEmployeeId}>
                    <SelectTrigger id="quick_employee">
                      <SelectValue placeholder="Выберите сотрудника" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp: { id: number; name: string }) => (
                        <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="button" 
                  onClick={handleAddQuickDebt}
                  disabled={!selectedClientId || !quickDebtValue || !quickResponsibleEmployeeId || addQuickDebtMutation.isPending}
                  className="w-full"
                >
                  {addQuickDebtMutation.isPending ? 'Добавление...' : 'Добавить долг'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};