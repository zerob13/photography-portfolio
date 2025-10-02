<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();

const locale = computed(() => route.params.locale as string);

const links = computed(() => [
  { key: 'gallery', label: t('navigation.gallery'), name: 'gallery' },
  { key: 'about', label: t('navigation.about'), name: 'about' },
  { key: 'contact', label: t('navigation.contact'), name: 'contact' }
]);
</script>

<template>
  <header class="navigation">
    <div class="brand">
      <RouterLink :to="{ name: 'gallery', params: { locale } }">
        {{ t('brand.title') }}
      </RouterLink>
    </div>
    <nav class="nav-links" aria-label="Primary navigation">
      <RouterLink
        v-for="link in links"
        :key="link.key"
        class="nav-link"
        :class="{ active: route.name === link.name }"
        :to="{ name: link.name, params: { ...route.params, locale } }"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
    <slot name="right" />
  </header>
</template>

<style scoped>
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 2.25rem 0;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(6px);
  z-index: 10;
}

.brand {
  font-size: 1.2rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  font-size: 0.95rem;
}

.nav-link {
  color: var(--muted);
  position: relative;
  padding-bottom: 0.25rem;
  transition: color 0.2s ease;
}

.nav-link.active,
.nav-link:hover {
  color: #1f232a;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: var(--accent);
}

@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem 0;
  }

  .nav-links {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
