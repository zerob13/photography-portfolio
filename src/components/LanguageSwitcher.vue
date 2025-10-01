<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supportedLocales, type SupportedLocale } from '@/locales';

const route = useRoute();
const router = useRouter();

const currentLocale = computed(() => route.params.locale as SupportedLocale);

async function switchLocale(locale: SupportedLocale) {
  if (locale === currentLocale.value) return;

  await router.push({
    name: (route.name as string) ?? 'gallery',
    params: {
      ...route.params,
      locale
    },
    query: route.query
  });
}
</script>

<template>
  <div class="language-switcher" role="group" aria-label="Language switcher">
    <button
      v-for="locale in supportedLocales"
      :key="locale"
      type="button"
      :class="['language-option', { active: locale === currentLocale } ]"
      @click="switchLocale(locale)"
    >
      {{ locale === 'zh' ? '中文' : 'EN' }}
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 0.25rem;
  background-color: var(--surface);
  gap: 0.25rem;
}

.language-option {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--muted);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.language-option.active {
  background-color: #1f1f1f;
  color: #fff;
}
</style>
