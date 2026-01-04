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
import { Switch } from '@/components/ui/switch';
import { Client, AddClientForm, ClientDebt } from '@/types/client';
import { clientsApi, employeesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Eye, EyeOff, Info, Edit, DollarSign } from 'lucide-react';
import { ClientSearchCombobox } from './ClientSearchCombobox';
import { Badge } from '@/components/ui/badge';
import { capitalize } from '@/lib/utils';

const phoneMask = '+{7} (000) 000-00-00';
const inputClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

interface ClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSubmit: (data: AddClientForm) => void;
  onDelete: (id: string) => void;
  mode?: 'add-debt' | 'edit';
  initialTab?: string;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  open,
  onOpenChange,
  client,
  onSubmit,
  onDelete,
  mode = 'edit',
  initialTab = 'edit',
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
  const [newDebtDescription, setNewDebtDescription] = useState<string>('');
  const [responsibleEmployeeId, setResponsibleEmployeeId] = useState<string>('');
  
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [quickDebtValue, setQuickDebtValue] = useState<string>('');
  const [quickDebtDescription, setQuickDebtDescription] = useState<string>('');
  const [quickResponsibleEmployeeId, setQuickResponsibleEmployeeId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [showInactiveDebts, setShowInactiveDebts] = useState(false);

  const { data: employees = [] } = useQuery<Array<{ id: number; name: string }>>({
    queryKey: ['employees'],
    queryFn: employeesApi.getEmployees,
    enabled: open,
    staleTime: 1000 * 60 * 30,
  });

  const { data: debts = [] } = useQuery({
    queryKey: ['client-debts', client?.id, showInactiveDebts],
    queryFn: () => client ? clientsApi.getClientDebts(client.id) : Promise.resolve([]),
    enabled: !!client?.id && open,
    staleTime: 1000 * 60 * 5,
  });

  const filteredDebts = showInactiveDebts 
    ? debts 
    : debts?.filter(debt => debt.is_valid) || [];

  const addDebtMutation = useMutation({
    mutationFn: ({ id, debt_value, responsible_employee_id, description }: { 
      id: string; 
      debt_value: number; 
      responsible_employee_id: string;
      description?: string;
    }) =>
      clientsApi.addDebt(id, debt_value, responsible_employee_id),
      
    onSuccess: () => {
      toast({ 
        title: 'Долг добавлен', 
        variant: 'default', 
        className: "bg-green-500 text-white" 
      });
      queryClient.invalidateQueries({ queryKey: ['client-debts', client?.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setNewDebtValue('');
      setNewDebtDescription('');
      setResponsibleEmployeeId('');
    },
    onError: () => {
      toast({ title: 'Ошибка добавления долга', variant: 'destructive' });
    },
  });

  const addQuickDebtMutation = useMutation({
    mutationFn: ({ id, debt_value, responsible_employee_id }: { 
      id: string; 
      debt_value: number; 
      responsible_employee_id: string;
    }) =>
      clientsApi.addDebt(id, debt_value, responsible_employee_id),
    onSuccess: () => {
      toast({ 
        title: `Долг успешно добавлен для ${selectedClientName}`, 
        variant: 'default', 
        className: "bg-green-500 text-white" 
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setSelectedClientId('');
      setSelectedClientName('');
      setQuickDebtValue('');
      setQuickDebtDescription('');
      setQuickResponsibleEmployeeId('');
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: 'Ошибка добавления долга', variant: 'destructive' });
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: clientsApi.deleteDebt,
    onSuccess: () => {
      toast({ 
        title: 'Долг отмечен как погашенный', 
        variant: 'default', 
        className: "bg-green-500 text-white" 
      });
      queryClient.invalidateQueries({ queryKey: ['client-debts', client?.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: () => {
      toast({ title: 'Ошибка при изменении статуса долга', variant: 'destructive' });
    },
  });

  useEffect(() => {
    if (open) {
      if (client) {
        setFormData({
          name: client.name,
          phone_number: client.phone_number || '',
          description: client.description || '',
          is_chosen: client.is_chosen,
        });
        setSelectedClientId(client.id);
        setSelectedClientName(client.name);
        
        if (mode === 'add-debt') {
          setActiveTab('add-debt');
        } else {
          setActiveTab(initialTab);
        }
      } else {
        setFormData({ name: '', phone_number: '', description: '', is_chosen: false });
        setActiveTab('add-debt');
      }
      
      setNewDebtValue('');
      setNewDebtDescription('');
      setResponsibleEmployeeId('');
      setQuickDebtValue('');
      setQuickDebtDescription('');
      setQuickResponsibleEmployeeId('');
      setShowInactiveDebts(false);
    }
  }, [open, client, mode, initialTab]);

  useEffect(() => {
    if (open && activeTab === 'add-debt') {
      const timer = setTimeout(() => {
        debtInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, activeTab]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (activeTab === 'edit') {
          nameInputRef.current?.focus();
        } else if (activeTab === 'add-debt') {
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
    if (numericValue.length > 8) {
      numericValue = numericValue.slice(0, 8);
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
      addDebtMutation.mutate({ 
        id: client.id, 
        debt_value: debtValue, 
        responsible_employee_id: responsibleEmployeeId,
        description: newDebtDescription
      });
    }
  };

  const handleQuickDebtInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isNegative = value.startsWith('-');
    let numericValue = value.replace(/[^\d]/g, '');
    if (numericValue.length > 8) {
      numericValue = numericValue.slice(0, 8);
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
    setActiveTab('edit');
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  const handleDeleteDebt = (debtId: string) => {
    if (confirm('Вы уверены, что хотите отметить этот долг как погашенный? Это действие нельзя отменить.')) {
      deleteDebtMutation.mutate(debtId);
    }
  };

  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('ru-RU', { 
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
    return formatted + ' ₸';
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getTabs = () => {
    if (!client) {
      return [
        { value: 'add-debt', label: 'Добавить долг', icon: <Plus className="h-4 w-4" /> }
      ];
    }
    
    return [
      { value: 'edit', label: 'Редактирование', icon: <Edit className="h-4 w-4" /> },
      { value: 'debts', label: 'Долги', icon: <DollarSign className="h-4 w-4" /> },
      { value: 'add-debt', label: 'Добавить долг', icon: <Plus className="h-4 w-4" /> }
    ];
  };

  const tabs = getTabs();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto max-w-[90vw] min-w-[70vw] max-h-[90vh] overflow-y-auto" 
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {client ? `Клиент: ${client.name}` : 'Добавить долг'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {tabs.length > 1 && (
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
              {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          <TabsContent value="edit" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя *</Label>
                  <Input 
                    ref={nameInputRef}
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData(prev => ({ ...prev, name: capitalize(e.target.value) }))} 
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

              <DialogFooter className="flex justify-between">
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Закрыть
                  </Button>
                  {client && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => {
                        if (confirm('Вы уверены, что хотите удалить клиента? Это действие нельзя отменить.')) {
                          onDelete(client.id);
                          onOpenChange(false);
                        }
                      }}
                      disabled={client.debt !== 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить клиента
                      {client.debt !== 0 && (
                        <span className="ml-2 text-xs">(нельзя удалить при наличии долга)</span>
                      )}
                    </Button>
                  )}
                  <Button type="submit">{client ? 'Сохранить' : 'Добавить'}</Button>
                </div>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="debts" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    История долгов
                    <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                      <Badge variant={client?.debt && client.debt > 0 ? "destructive" : "default"} 
                        className={client?.debt && client.debt > 0 ? "bg-red-500" : "bg-green-500"}>
                        Текущий долг: {client ? formatCurrency(client.debt) : '0 ₸'}
                      </Badge>
                      {debts && (
                        <Badge variant="outline">
                          Активных: {debts.filter(d => d.is_valid).length}
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="show-inactive" className="text-sm flex items-center gap-2 cursor-pointer">
                      <Switch 
                        id="show-inactive" 
                        checked={showInactiveDebts} 
                        onCheckedChange={setShowInactiveDebts} 
                      />
                      {showInactiveDebts ? (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Скрыть погашенные</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          <span>Показать погашенные</span>
                        </>
                      )}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredDebts && filteredDebts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Отв. лицо</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDebts.map((debt) => (
                        <TableRow key={debt.id} className={!debt.is_valid ? 'opacity-60 bg-muted/30' : ''}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDateOnly(debt.date_added)}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(debt.date_added).toLocaleTimeString('ru-RU', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={debt.debt_value > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                                {debt.debt_value > 0 ? '+' : ''}{formatCurrency(debt.debt_value)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {employees.find(emp => emp.id === debt.responsible_employee_id)?.first_name ?? 'Неизвестно'}
                          </TableCell>
                          <TableCell>
                            {debt.is_valid ? (
                              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                Активен
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-300 text-gray-500">
                                Погашен({formatDateOnly(debt.repaid_at)})
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {debt.description || '-'}
                          </TableCell>
                          <TableCell>
                            {debt.is_valid && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteDebt(debt.id)}
                                disabled={deleteDebtMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    {showInactiveDebts ? 'Нет записей о долгах' : 'Нет активных долгов'}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Хотите добавить новый долг?</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('add-debt')}
                    >
                      Перейти к добавлению
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-debt" className="space-y-6">
            <Card>
              <CardContent className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="client-search">Клиент *</Label>
                  {client ? (
                    <div className="p-3 border rounded-md bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          {client.phone_number && (
                            <p className="text-sm text-muted-foreground">{client.phone_number}</p>
                          )}
                        </div>
                        <Badge variant={client.debt > 0 ? "destructive" : "default"} className={client.debt > 0 ? "bg-red-500" : "bg-green-500"}>
                          Долг: {formatCurrency(client.debt)}
                        </Badge>
                      </div>
                    </div>
                  ) : (
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quick_debt_value">Сумма долга *</Label>
                    <Input
                      ref={debtInputRef}
                      id="quick_debt_value"
                      type="text"
                      value={client ? newDebtValue : quickDebtValue}
                      onChange={client ? handleDebtInputChange : handleQuickDebtInputChange}
                      placeholder="Например: -50 000 или 25 000"
                      autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground">
                      +n: увеличить долг<br />
                      -n: уменьшить долг
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quick_employee">Ответственный *</Label>
                    <Select 
                      value={client ? responsibleEmployeeId : quickResponsibleEmployeeId} 
                      onValueChange={client ? setResponsibleEmployeeId : setQuickResponsibleEmployeeId}
                    >
                      <SelectTrigger id="quick_employee">
                        <SelectValue placeholder="Выберите сотрудника" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp: { id: number; name: string }) => (
                          <SelectItem key={emp.id} value={String(emp.id)}>{emp.first_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="debt_description">Описание (необязательно)</Label>
                  <Input
                    id="debt_description"
                    value={client ? newDebtDescription : quickDebtDescription}
                    onChange={(e) => client ? setNewDebtDescription(e.target.value) : setQuickDebtDescription(e.target.value)}
                    placeholder="Причина/комментарий к долгу"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Важно:</span> Система автоматически начнет погашение самых старых активных долгов при добавлении отрицательной суммы.
                  </p>
                </div>

                <Button 
                  type="button" 
                  onClick={client ? handleAddDebt : handleAddQuickDebt}
                  disabled={
                    client 
                      ? !newDebtValue || !responsibleEmployeeId || addDebtMutation.isPending
                      : !selectedClientId || !quickDebtValue || !quickResponsibleEmployeeId || addQuickDebtMutation.isPending
                  }
                  className="w-full"
                >
                  {client 
                    ? (addDebtMutation.isPending ? 'Добавление...' : 'Добавить долг')
                    : (addQuickDebtMutation.isPending ? 'Добавление...' : 'Добавить долг')
                  }
                </Button>
              </CardContent>
            </Card>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Закрыть
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};