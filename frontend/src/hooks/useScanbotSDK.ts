// src/hooks/useScanbotSDK.ts
import { useState, useEffect } from 'react';
import type ScanbotSDK from 'scanbot-web-sdk';

export function useScanbotSDK() {
  const [sdk, setSdk] = useState<ScanbotSDK | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Эта функция гарантирует, что скрипт загружается только один раз
    const loadScanbotScript = () => {
      if (document.getElementById('scanbot-sdk-script')) {
        // Если скрипт уже есть, но sdk еще не инициализирован, пробуем снова
        if (window.ScanbotSDK && !isInitialized) {
            initialize();
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'scanbot-sdk-script';
      script.src = '/package/bundle/ScanbotSDK.ui2.min.js'; // Путь из папки public
      script.async = true;
      script.onload = () => initialize();
      document.body.appendChild(script);
    };

    const initialize = async () => {
      // @ts-ignore
      const scanbotSDK: ScanbotSDK = await window.ScanbotSDK.initialize({
        // Вставьте сюда ваш лицензионный ключ для продакшена
        // licenseKey: "YOUR_SCANBOT_SDK_LICENSE_KEY", 
        enginePath: '/package/bundle/bin/complete/', // Путь из папки public
      });
      setSdk(scanbotSDK);
      setIsInitialized(true);
      console.log('Scanbot SDK Initialized!');
    };

    loadScanbotScript();

  }, [isInitialized]); // Зависимость, чтобы перепроверить, если что-то пошло не так

  return { sdk, isInitialized };
}