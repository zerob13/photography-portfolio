<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { works, type Work } from '@/data/gallery';

type Locale = 'zh' | 'en';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const locale = computed<Locale>(() => (route.params.locale as Locale) ?? 'zh');
const work = computed<Work | undefined>(() => works.find((item: Work) => item.slug === route.params.slug));

if (!work.value) {
  router.replace({ name: 'gallery', params: { locale: locale.value } });
}

function goBack() {
  router.push({ name: 'gallery', params: { locale: locale.value } });
}
</script>

<template>
  <section v-if="work" class="detail">
    <button class="back" type="button" @click="goBack">
      ← {{ t('detail.back') }}
    </button>
    <div class="detail-layout">
      <div class="detail-image">
        <img :src="work.coverImage" :alt="work.title[locale]" loading="lazy" decoding="async" />
      </div>
      <div class="detail-info">
        <header>
          <p class="work-year">{{ work.year }}</p>
          <h1>{{ work.title[locale] }}</h1>
          <p class="work-location">{{ work.location[locale] }}</p>
        </header>
        <div class="meta-grid">
          <div class="meta-item">
            <span class="label">{{ t('detail.date') }}</span>
            <span>{{ work.shootingDate }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ t('detail.camera') }}</span>
            <span>{{ work.camera }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ t('detail.lens') }}</span>
            <span>{{ work.lens }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ t('detail.aperture') }}</span>
            <span>{{ work.aperture }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ t('detail.shutter') }}</span>
            <span>{{ work.shutter }}</span>
          </div>
          <div class="meta-item">
            <span class="label">ISO</span>
            <span>{{ work.iso }}</span>
          </div>
        </div>
        <div class="description">
          <p>{{ work.description[locale] }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.back {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 1.5rem;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: start;
}

.detail-image {
  background: var(--surface);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(31, 31, 31, 0.1);
}

.detail-image img {
  display: block;
  width: 100%;
  height: auto;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-info h1 {
  font-size: 2rem;
  letter-spacing: 0.2em;
  margin: 0.5rem 0 0;
}

.work-year {
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--muted);
}

.work-location {
  margin: 0;
  color: var(--muted);
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 2rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #b0b0b0;
}

.description {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #424242;
}

@media (max-width: 1024px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}
</style>
