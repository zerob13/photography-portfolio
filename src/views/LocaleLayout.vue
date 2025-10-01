<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="layout">
    <NavigationBar>
      <template #right>
        <LanguageSwitcher />
      </template>
    </NavigationBar>
    <main class="content">
      <RouterView />
    </main>
    <footer class="footer">
      <p>{{ t('footer.copy') }}</p>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  width: min(100%, var(--max-content-width));
  margin: 0 auto;
  padding: 0 2.5rem 3rem;
}

.content {
  flex: 1;
}

.footer {
  padding-top: 4rem;
  padding-bottom: 2rem;
  font-size: 0.8rem;
  color: var(--muted);
  text-align: center;
}

@media (max-width: 768px) {
  .layout {
    padding: 0 1.25rem 2.5rem;
  }
}
</style>
