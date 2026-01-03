import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Store, 
  TrendingUp, 
  Users,
  Shield,
  Phone,
  Mail,
  MapPin,
  Package,
  CreditCard,
  LogIn,
  MessageSquare,
  User,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { leadsApi } from '@/lib/api';

const Landing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  });
  const { toast } = useToast();

  const features = [
    {
      icon: <Store className="h-8 w-8" />,
      title: 'Управление магазинами',
      description: 'Единая система для контроля всех ваших торговых точек'
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: 'Учет поставок',
      description: 'Автоматизированный учет товаров и управление складом'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Аналитика продаж',
      description: 'Детальные отчеты и прогнозирование спроса'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'CRM система',
      description: 'Управление клиентами и поставщиками в одном месте'
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Финансовый учет',
      description: 'Контроль расходов, доходов и финансовой отчетности'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Безопасность данных',
      description: 'Защита коммерческой информации и резервное копирование'
    }
  ];

  // Маска для телефона
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    let formatted = numbers;
    if (numbers.startsWith('7') || numbers.startsWith('8')) {
      formatted = '7' + numbers.substring(1);
    } else if (numbers.startsWith('9')) {
      formatted = '7' + numbers;
    }
    
    formatted = formatted.substring(0, 11);
    
    if (formatted.length === 0) return '';
    if (formatted.length <= 1) return `+${formatted}`;
    if (formatted.length <= 4) return `+${formatted.substring(0, 1)} ${formatted.substring(1)}`;
    if (formatted.length <= 7) return `+${formatted.substring(0, 1)} ${formatted.substring(1, 4)} ${formatted.substring(4)}`;
    if (formatted.length <= 9) return `+${formatted.substring(0, 1)} ${formatted.substring(1, 4)} ${formatted.substring(4, 7)} ${formatted.substring(7)}`;
    return `+${formatted.substring(0, 1)} ${formatted.substring(1, 4)} ${formatted.substring(4, 7)} ${formatted.substring(7, 9)} ${formatted.substring(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, введите ваше имя',
        variant: 'destructive',
      });
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, введите корректный номер телефона',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Используем API из api.ts
      await leadsApi.createLead({
        name: formData.name,
        phone_number: formData.phone.replace(/\s+/g, ''),
        comment: formData.comment || ''
      });
      
      toast({
        title: '✅ Заявка отправлена успешно!',
        description: 'Наш менеджер свяжется с вами в течение 24 часов.',
        duration: 5000,
        className: 'bg-green-50 border-green-200 text-green-800',
      });

      // Очистка формы
      setFormData({
        name: '',
        phone: '',
        comment: ''
      });

    } catch (error: any) {
      console.error('Lead submission error:', error);
      
      toast({
        title: 'Ошибка отправки',
        description: error.message || 'Не удалось отправить заявку. Пожалуйста, попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm backdrop-blur-sm bg-white/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  dukenCRM
                </h1>
                <p className="text-xs text-gray-500 font-medium">smart-duken.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button 
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Войти</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">smart-duken.com</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Управляйте бизнесом
              <span className="block text-blue-200 mt-3">с умом и эффективностью</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Полная система автоматизации розничной торговли: от учета товаров до финансовой аналитики
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-7 rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 font-semibold"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Оставить заявку
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35,6.36,119.13-6.25,32.18-10.77,60-28.93,89-43.81,32-16.45,65-30,97-37.67,37.79-8.91,77,1.28,114,10.69,34.41,8.64,71.35,19.07,103,32.47,37,15.71,72.37,37,108,52,33.13,14,67.36,24.35,102,28,36.26,3.75,73.37,2.67,109-3,33.74-5.44,67-15,100-25.36,31.52-9.93,63.23-20.31,93-33.22V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-700">ВОЗМОЖНОСТИ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Все необходимое для вашего бизнеса
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Комплексное решение, которое охватывает все аспекты управления розничной торговлей
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="p-8 relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <div className="scale-125">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="inline-flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span>Подробнее</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mb-8 border border-white/10">
                <span className="text-sm font-medium text-blue-300">ПРЕИМУЩЕСТВА</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Почему выбирают
                <span className="block text-blue-300 mt-2">нашу систему?</span>
              </h2>
              <ul className="space-y-6">
                {[
                  'Снижение операционных расходов до 40%',
                  'Увеличение скорости обработки заказов в 3 раза',
                  'Точность учета товаров 99,9%',
                  'Интеграция с популярными эквайрингами',
                  'Мобильное приложение для сотрудников',
                  'Круглосуточная техническая поддержка'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <span className="ml-4 text-lg text-gray-200 group-hover:text-white transition-colors duration-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-10 backdrop-blur-sm border border-white/10 shadow-2xl">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-blue-300" />
                  Статистика эффективности
                </h3>
                <p className="text-gray-400">Результаты наших клиентов за 2024 год</p>
              </div>
              
              <div className="space-y-8">
                {[
                  { label: 'Рост продаж', value: '+45%', width: '75%', color: 'from-green-500 to-emerald-500' },
                  { label: 'Сокращение времени на учет', value: '-65%', width: '67%', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Уменьшение ошибок', value: '-90%', width: '90%', color: 'from-purple-500 to-pink-500' }
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-300 font-medium">{stat.label}</span>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                        style={{ width: stat.width }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10">
                <p className="text-gray-300 italic text-center">
                  "Более 500 компаний уже доверили нам управление своим бизнесом"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-8 shadow-lg">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Контакты</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Готовы оптимизировать
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">свой бизнес?</span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Оставьте заявку и получите персональную демонстрацию системы от наших экспертов
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Info Cards */}
            <div className="space-y-6">
              <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                    <Phone className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Телефон</h3>
                  <p className="text-gray-600 mb-2">+7 (800) 123-45-67</p>
                  <p className="text-sm text-gray-500">Ежедневно с 9:00 до 21:00</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                    <Mail className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Email</h3>
                  <p className="text-gray-600 mb-2">info@smart-duken.com</p>
                  <p className="text-sm text-gray-500">Ответим в течение 2 часов</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-50 to-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                    <LogIn className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Уже есть аккаунт?</h3>
                  <p className="text-gray-600 mb-4">Войдите в систему управления</p>
                  <Link to="/login">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg">
                      <LogIn className="h-4 w-4 mr-2" />
                      Войти в систему
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 border-none shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -translate-x-64 translate-y-64"></div>
              
              <CardContent className="p-10 relative z-10">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-xl mr-6">
                    <Send className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Оставить заявку</h3>
                    <p className="text-gray-400 mt-1">Заполните форму и мы свяжемся с вами</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label htmlFor="name" className="text-gray-300 font-medium flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Ваше имя <span className="text-red-400 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Иван Иванов"
                          required
                          disabled={isSubmitting}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 h-14 pl-12 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="phone" className="text-gray-300 font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Телефон(Whatsapp) <span className="text-red-400 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+7 777 777 77 77"
                          required
                          disabled={isSubmitting}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 h-14 pl-12 rounded-xl font-mono focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <Phone className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Формат: +7 XXX XXX XX XX
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="comment" className="text-gray-300 font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Комментарий или вопрос
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Расскажите о ваших задачах или задайте вопрос..."
                        rows={5}
                        disabled={isSubmitting}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 rounded-xl pl-12 pt-4 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      />
                      <div className="absolute left-4 top-4 text-gray-500">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl rounded-xl transform hover:-translate-y-1 transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                          Отправка...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-3" />
                          Отправить заявку
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-500 text-center mt-4">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
