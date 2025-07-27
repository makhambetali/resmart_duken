
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Страница не найдена</p>
          <Button asChild>
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
