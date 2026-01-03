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
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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

  const testimonials = [
    {
      name: 'Иван Петров',
      role: 'Владелец сети "Свежие продукты"',
      text: 'После внедрения системы наши операционные расходы сократились на 30%. Очень удобный интерфейс!'
    },
    {
      name: 'Мария Сидорова',
      role: 'Директор магазина "Домашний уют"',
      text: 'Теперь все процессы учета автоматизированы. Экономим 15 часов в неделю на рутинных задачах.'
    },
    {
      name: 'Алексей Козлов',
      role: 'Финансовый директор "Торговая группа"',
      text: 'Отличная аналитика! Помогает принимать взвешенные решения по закупкам и управлению ассортиментом.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Здесь будет отправка формы на сервер
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
      
      toast({
        title: 'Заявка отправлена!',
        description: 'Наш менеджер свяжется с вами в течение 24 часов.',
        duration: 5000,
      });

      // Очистка формы
      setFormData({
        name: '',
        phone: '',
        comment: ''
      });

    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">dukenCRM</h1>
                <p className="text-xs text-gray-500">smart-duken.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
           <Link to="/login">
  <Button 
    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
  >
    <LogIn className="h-4 w-4" />
    Войти
  </Button>
</Link>
              {/* <Button 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Демо-версия
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm mb-6">
              <span className="text-sm">smart-duken.com</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Управляйте вашим бизнесом
              <span className="block text-blue-200">с умом и эффективностью</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Полная система автоматизации розничной торговли: от учета товаров до финансовой аналитики
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Оставить заявку
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {/* <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-6 bg-transparent"
              >
                Смотреть демо
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Все необходимое для вашего бизнеса
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Комплексное решение, которое охватывает все аспекты управления розничной торговлей
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Почему выбирают нашу систему?
              </h2>
              <ul className="space-y-4">
                {[
                  'Снижение операционных расходов до 40%',
                  'Увеличение скорости обработки заказов в 3 раза',
                  'Точность учета товаров 99,9%',
                  'Интеграция с популярными эквайрингами',
                  'Мобильное приложение для сотрудников',
                  'Круглосуточная техническая поддержка'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Статистика эффективности</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Рост продаж</span>
                    <span className="font-bold">+45%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-3/4 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Сокращение времени на учет</span>
                    <span className="font-bold">-65%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Уменьшение ошибок</span>
                    <span className="font-bold">-90%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-9/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Отзывы наших клиентов
            </h2>
            <p className="text-gray-600 text-lg">Уже более 500 компаний доверяют нам</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact Form */}
      <section id="contact-form" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Готовы оптимизировать свой бизнес?
            </h2>
            <p className="text-gray-600 text-lg">
              Оставьте заявку и получите персональную демонстрацию системы
            </p>
          </div>

          <Card className="border-none shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-6 text-center">
                <p className="text-gray-600">Уже есть аккаунт?</p>
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  Войти в систему
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+7 (999) 999-99-99"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий или вопрос</Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Расскажите о ваших задачах или задайте вопрос..."
                    rows={4}
                  />
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="px-12 py-6 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Отправка...
                      </>
                    ) : (
                      'Отправить заявку'
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 mt-3">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RetailPro</h3>
              <p className="text-gray-400 mb-2">
                smart-duken.com
              </p>
              <p className="text-gray-400 text-sm">
                Современная система управления розничной торговлей
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+7 (800) 123-45-67</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@smart-duken.com</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Москва, ул. Торговая, 15</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Возможности</a></li>
                <li><a href="#" className="hover:text-white">Тарифы</a></li>
                <li><a href="#" className="hover:text-white">Демо</a></li>
                <li><a href="#" className="hover:text-white">Интеграции</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Быстрые ссылки</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Вход в систему</Link></li>
                <li><a href="#" className="hover:text-white">Документация</a></li>
                <li><a href="#" className="hover:text-white">Поддержка</a></li>
                <li><a href="#" className="hover:text-white">Блог</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} RetailPro - smart-duken.com. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;