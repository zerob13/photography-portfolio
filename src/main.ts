import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { i18n, defaultLocale, setLocale } from './locales';

async function bootstrap() {
  await setLocale(defaultLocale);

  const app = createApp(App);
  app.use(router);
  app.use(i18n);

  await router.isReady();
  app.mount('#app');
}

bootstrap();
