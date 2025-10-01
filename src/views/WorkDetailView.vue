<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { works, type Work, type Locale } from '@/data/gallery';
import { renderMarkdown } from '@/utils/markdown';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const locale = computed<Locale>(() => (route.params.locale as Locale) ?? 'zh');
const work = computed<Work | undefined>(() => works.find((item: Work) => item.slug === route.params.slug));

const contentHtml = computed(() =>
  work.value ? renderMarkdown(work.value.content[locale.value]) : ''
);

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
          <p class="work-summary">{{ work.summary[locale] }}</p>
        </header>
        <div class="meta-grid">
          <div class="meta-item">
            <span class="label">{{ t('detail.date') }}</span>
            <span>{{ work.shootingDate }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ t('detail.camera') }}</span>
            <span>{{ work.exif.camera }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ t('detail.lens') }}</span>
            <span>{{ work.exif.lens }}</span>
          </div>
          <div class="meta-item" v-if="work.exif.focalLength">
            <span class="label">{{ t('detail.focalLength') }}</span>
            <span>{{ work.exif.focalLength }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ t('detail.aperture') }}</span>
            <span>{{ work.exif.aperture }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ t('detail.shutter') }}</span>
            <span>{{ work.exif.shutter }}</span>
          </div>
          <div class="meta-item">
            <span class="label">ISO</span>
            <span>{{ work.exif.iso }}</span>
          </div>
        </div>
        <div class="description" v-html="contentHtml" />
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
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.95), rgba(244, 238, 231, 0.95));
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(215, 191, 174, 0.35);
  box-shadow: 0 22px 48px rgba(195, 178, 157, 0.18);
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

.work-summary {
  margin: 0.75rem 0 0;
  color: #655a4f;
  line-height: 1.6;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 1.25rem;
  border: 1px solid rgba(215, 191, 174, 0.35);
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
  color: #b9afa0;
}

.description {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #4b4239;
}

.description :deep(p) {
  margin: 0 0 1.1rem;
}

@media (max-width: 1024px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}
</style>
