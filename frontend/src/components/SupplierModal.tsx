// [file name]: SupplierModal.tsx
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
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {supplier ? 'Редактировать поставщика' : 'Новый поставщик'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Название *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Введите название компании"
                className="text-sm sm:text-base"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supervisor" className="text-sm">Контактное лицо</Label>
                <Input 
                  id="supervisor" 
                  name="supervisor" 
                  value={formData.supervisor} 
                  onChange={handleChange} 
                  placeholder="ФИО"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisor_pn" className="text-sm">Телефон</Label>
                <IMaskInput
                  mask={phoneMask}
                  id="supervisor_pn"
                  name="supervisor_pn"
                  value={formData.supervisor_pn}
                  onAccept={(value) => handleChange({ target: { name: 'supervisor_pn', value } } as any)}
                  className={`${inputClassName} text-sm sm:text-base`}
                  placeholder="+7 ___ ___ __ __"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="representative" className="text-sm">Представитель</Label>
                <Input 
                  id="representative" 
                  name="representative" 
                  value={formData.representative} 
                  onChange={handleChange} 
                  placeholder="ФИО"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="representative_pn" className="text-sm">Телефон</Label>
                <IMaskInput
                  mask={phoneMask}
                  id="representative_pn"
                  name="representative_pn"
                  value={formData.representative_pn}
                  onAccept={(value) => handleChange({ target: { name: 'representative_pn', value } } as any)}
                  className={`${inputClassName} text-sm sm:text-base`}
                  placeholder="+7 ___ ___ __ __"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery" className="text-sm">Доставка</Label>
                <Input 
                  id="delivery" 
                  name="delivery" 
                  value={formData.delivery} 
                  onChange={handleChange} 
                  placeholder="ФИО"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_pn" className="text-sm">Телефон</Label>
                <IMaskInput
                  mask={phoneMask}
                  id="delivery_pn"
                  name="delivery_pn"
                  value={formData.delivery_pn}
                  onAccept={(value) => handleChange({ target: { name: 'delivery_pn', value } } as any)}
                  className={`${inputClassName} text-sm sm:text-base`}
                  placeholder="+7 ___ ___ __ __"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Описание</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Дополнительная информация о поставщике"
                rows={3}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="flex items-center space-x-2">
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
          
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.name}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? 'Сохранение...' : supplier ? 'Обновить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};