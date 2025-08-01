import React, { useState, useEffect } from 'react';
import { Supplier, CreateSupplierData } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{supplier ? 'Редактировать поставщика' : 'Новый поставщик'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supervisor">Контактное лицо (нач.)</Label>
              <Input id="supervisor" name="supervisor" value={formData.supervisor} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor_pn">Телефон</Label>
              <Input id="supervisor_pn" name="supervisor_pn" value={formData.supervisor_pn} onChange={handleChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="representative">Представитель</Label>
              <Input id="representative" name="representative" value={formData.representative} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="representative_pn">Телефон</Label>
              <Input id="representative_pn" name="representative_pn" value={formData.representative_pn} onChange={handleChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery">Доставка</Label>
              <Input id="delivery" name="delivery" value={formData.delivery} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_pn">Телефон</Label>
              <Input id="delivery_pn" name="delivery_pn" value={formData.delivery_pn} onChange={handleChange} />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_everyday_supply"
                checked={formData.is_everyday_supply}
                onCheckedChange={(checked) => setFormData(prev => ({...prev, is_everyday_supply: Boolean(checked)}))}
              />
              <Label htmlFor="is_everyday_supply">Ежедневная поставка</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button type="submit" disabled={isLoading || !formData.name}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};