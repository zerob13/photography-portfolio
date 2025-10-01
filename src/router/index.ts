import { createRouter, createWebHistory } from 'vue-router';
import LocaleLayout from '@/views/LocaleLayout.vue';
import GalleryView from '@/views/GalleryView.vue';
import WorkDetailView from '@/views/WorkDetailView.vue';
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/ContactView.vue';
import { defaultLocale, supportedLocales, setLocale, type SupportedLocale } from '@/locales';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:locale(zh|en)',
      component: LocaleLayout,
      children: [
        {
          path: '',
          name: 'gallery',
          component: GalleryView
        },
        {
          path: 'works/:slug',
          name: 'work-detail',
          component: WorkDetailView,
          props: true
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView
        },
        {
          path: 'contact',
          name: 'contact',
          component: ContactView
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: `/${defaultLocale}`
    }
  ]
});

router.beforeEach(async (to) => {
  const locale = to.params.locale as SupportedLocale | undefined;

  if (!locale || !supportedLocales.includes(locale)) {
    return `/${defaultLocale}`;
  }

  await setLocale(locale);
});

export default router;
