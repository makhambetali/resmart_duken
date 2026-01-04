// [file name]: ClientModal.tsx
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
import { Plus, Trash2, Eye, EyeOff, Info, Edit, DollarSign, User, Phone, Calendar, X } from 'lucide-react';
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

  const formatTimeOnly = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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

  // Mobile Debt Card
  const MobileDebtCard = ({ debt }: { debt: ClientDebt }) => {
    const employee = employees.find(emp => emp.id === debt.responsible_employee_id);
    
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-sm">
                  {formatDateOnly(debt.date_added)}
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTimeOnly(debt.date_added)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Ответственный: {employee?.first_name || 'Неизвестно'}
                </div>
              </div>
              <Badge 
                variant={debt.is_valid ? "default" : "outline"} 
                className={debt.is_valid ? "bg-green-100 text-green-800" : "border-gray-300 text-gray-500"}
              >
                {debt.is_valid ? 'Активен' : 'Погашен'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className={`text-lg font-bold ${debt.debt_value > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {debt.debt_value > 0 ? '+' : ''}{formatCurrency(debt.debt_value)}
              </div>
              
              {debt.is_valid && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteDebt(debt.id)}
                  disabled={deleteDebtMutation.isPending}
                  className="h-8"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            
            {debt.description && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {debt.description}
              </div>
            )}
            
            {!debt.is_valid && debt.repaid_at && (
              <div className="text-xs text-gray-500">
                Погашен: {formatDateOnly(debt.repaid_at)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0 sm:p-6 sm:max-w-[90vw] sm:w-auto">
        <DialogHeader className="px-4 sm:px-0 py-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {client ? (
                <>
                  <div className="hidden sm:block p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-lg sm:text-xl font-bold truncate">
                      {client.name}
                    </DialogTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant={client.debt > 0 ? "destructive" : "default"} 
                        className={client.debt > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        Долг: {formatCurrency(client.debt)}
                      </Badge>
                      {client.is_chosen && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800">
                          Избранный
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <DialogTitle className="text-lg sm:text-xl font-bold">
                  Добавить долг
                </DialogTitle>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="ml-2 sm:hidden h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-4 sm:px-0 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {tabs.length > 1 && (
              <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
                {tabs.map(tab => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value} 
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">
                      {tab.value === 'edit' ? 'Ред' : 
                       tab.value === 'debts' ? 'Долги' : 
                       tab.value === 'add-debt' ? 'Долг' : tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            <TabsContent value="edit" className="space-y-4 sm:space-y-6 focus:outline-none">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">Имя *</Label>
                    <Input 
                      ref={nameInputRef}
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData(prev => ({ ...prev, name: capitalize(e.target.value) }))} 
                      placeholder="Имя клиента" 
                      required 
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Телефон</Label>
                    <IMaskInput 
                      mask={phoneMask} 
                      id="phone" 
                      value={formData.phone_number} 
                      onAccept={(value) => setFormData(prev => ({ ...prev, phone_number: value as string }))} 
                      className={`${inputClassName} text-sm sm:text-base`} 
                      placeholder="+7 (___) ___-__-__" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Описание</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                    placeholder="Дополнительная информация о клиенте" 
                    rows={3} 
                    className="text-sm sm:text-base"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_chosen" 
                    checked={formData.is_chosen} 
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_chosen: !!checked }))} 
                  />
                  <Label htmlFor="is_chosen" className="text-sm">Избранный клиент</Label>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-2 sm:order-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}
                      className="w-full sm:w-auto"
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
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить клиента
                        {client.debt !== 0 && (
                          <span className="ml-2 text-xs hidden sm:inline">(нельзя удалить при наличии долга)</span>
                        )}
                      </Button>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {client ? 'Сохранить' : 'Добавить'}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="debts" className="space-y-4 sm:space-y-6 focus:outline-none">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      История долгов
                      <div className="flex items-center gap-2 text-sm font-normal">
                        <Badge variant={client?.debt && client.debt > 0 ? "destructive" : "default"} 
                          className={client?.debt && client.debt > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                          Текущий: {client ? formatCurrency(client.debt) : '0 ₸'}
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
                          size="sm"
                        />
                        <span className="text-sm">
                          {showInactiveDebts ? 'Скрыть погашенные' : 'Показать погашенные'}
                        </span>
                      </Label>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Mobile Debt Cards */}
                  <div className="sm:hidden space-y-3">
                    {filteredDebts && filteredDebts.length > 0 ? (
                      filteredDebts.map(debt => (
                        <MobileDebtCard key={debt.id} debt={debt} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {showInactiveDebts ? 'Нет записей о долгах' : 'Нет активных долгов'}
                      </div>
                    )}
                  </div>
                  
                  {/* Desktop Debt Table */}
                  <div className="hidden sm:block">
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
                                    {formatTimeOnly(debt.date_added)}
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
                                    Погашен ({formatDateOnly(debt.repaid_at)})
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
                      <div className="text-center py-8 text-muted-foreground">
                        {showInactiveDebts ? 'Нет записей о долгах' : 'Нет активных долгов'}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <h3 className="font-medium text-sm sm:text-base">Хотите добавить новый долг?</h3>
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

            <TabsContent value="add-debt" className="space-y-4 sm:space-y-6 focus:outline-none">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3">
                    <Label htmlFor="client-search" className="text-sm font-medium">Клиент *</Label>
                    {client ? (
                      <div className="p-3 sm:p-4 border rounded-md bg-muted/50">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{client.name}</p>
                            {client.phone_number && (
                              <p className="text-sm text-muted-foreground truncate">{client.phone_number}</p>
                            )}
                          </div>
                          <Badge 
                            variant={client.debt > 0 ? "destructive" : "default"} 
                            className={client.debt > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                          >
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
                        isMobile={true}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="debt_value" className="text-sm">Сумма долга *</Label>
                      <Input
                        ref={debtInputRef}
                        id="debt_value"
                        type="text"
                        value={client ? newDebtValue : quickDebtValue}
                        onChange={client ? handleDebtInputChange : handleQuickDebtInputChange}
                        placeholder="Например: -50 000 или 25 000"
                        autoComplete="off"
                        className="text-sm sm:text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        +n: увеличить долг<br />
                        -n: уменьшить долг
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employee" className="text-sm">Ответственный *</Label>
                      <Select 
                        value={client ? responsibleEmployeeId : quickResponsibleEmployeeId} 
                        onValueChange={client ? setResponsibleEmployeeId : setQuickResponsibleEmployeeId}
                      >
                        <SelectTrigger id="employee" className="text-sm sm:text-base">
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
                    <Label htmlFor="debt_description" className="text-sm">Описание (необязательно)</Label>
                    <Input
                      id="debt_description"
                      value={client ? newDebtDescription : quickDebtDescription}
                      onChange={(e) => client ? setNewDebtDescription(e.target.value) : setQuickDebtDescription(e.target.value)}
                      placeholder="Причина/комментарий к долгу"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs sm:text-sm text-amber-800">
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
                    size={window.innerWidth < 640 ? "default" : "default"}
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
                  className="w-full sm:w-auto"
                >
                  Закрыть
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};