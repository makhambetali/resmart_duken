import React, { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import { Supplier, CreateSupplierData } from '@/types/suppliers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { capitalize } from '@/lib/utils';

interface SupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier | null;
  onSubmit: (data: CreateSupplierData) => Promise<void>;
  isLoading: boolean;
}

const initialState: CreateSupplierData = {
  name: '',
  description: '',
  supervisor: '',
  supervisor_pn: '',
  representative: '',
  representative_pn: '',
  delivery: '',
  delivery_pn: '',
  is_everyday_supply: false,
};

const phoneMask = '+{7} 000 000 00 00';
const inputClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const SupplierModal: React.FC<SupplierModalProps> = ({ open, onOpenChange, supplier, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CreateSupplierData>(initialState);

  useEffect(() => {
    if (supplier && open) {
      setFormData({
        name: supplier.name,
        description: supplier.description || '',
        supervisor: supplier.supervisor || '',
        supervisor_pn: supplier.supervisor_pn || '',
        representative: supplier.representative || '',
        representative_pn: supplier.representative_pn || '',
        delivery: supplier.delivery || '',
        delivery_pn: supplier.delivery_pn || '',
        is_everyday_supply: supplier.is_everyday_supply || false,
      });
    } else {
      setFormData(initialState);
    }
  }, [supplier, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: capitalize(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {supplier ? 'Редактировать поставщика' : 'Новый поставщик'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Название *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Введите название компании"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supervisor">Контактное лицо (нач.)</Label>
              <Input 
                id="supervisor" 
                name="supervisor" 
                value={formData.supervisor} 
                onChange={handleChange} 
                placeholder="ФИО"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor_pn">Телефон</Label>
              <IMaskInput
                mask={phoneMask}
                id="supervisor_pn"
                name="supervisor_pn"
                value={formData.supervisor_pn}
                onAccept={(value) => handleChange({ target: { name: 'supervisor_pn', value } } as any)}
                className={inputClassName}
                placeholder="+7 ___ ___ __ __"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="representative">Представитель</Label>
              <Input 
                id="representative" 
                name="representative" 
                value={formData.representative} 
                onChange={handleChange} 
                placeholder="ФИО"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="representative_pn">Телефон</Label>
              <IMaskInput
                mask={phoneMask}
                id="representative_pn"
                name="representative_pn"
                value={formData.representative_pn}
                onAccept={(value) => handleChange({ target: { name: 'representative_pn', value } } as any)}
                className={inputClassName}
                placeholder="+7 ___ ___ __ __"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery">Доставка</Label>
              <Input 
                id="delivery" 
                name="delivery" 
                value={formData.delivery} 
                onChange={handleChange} 
                placeholder="ФИО"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_pn">Телефон</Label>
              <IMaskInput
                mask={phoneMask}
                id="delivery_pn"
                name="delivery_pn"
                value={formData.delivery_pn}
                onAccept={(value) => handleChange({ target: { name: 'delivery_pn', value } } as any)}
                className={inputClassName}
                placeholder="+7 ___ ___ __ __"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Дополнительная информация о поставщике"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox 
                id="is_everyday_supply"
                checked={formData.is_everyday_supply}
                onCheckedChange={(checked) => setFormData(prev => ({...prev, is_everyday_supply: Boolean(checked)}))}
              />
              <Label htmlFor="is_everyday_supply" className="text-sm">
                Ежедневная поставка
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name}>
              {isLoading ? 'Сохранение...' : supplier ? 'Обновить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};