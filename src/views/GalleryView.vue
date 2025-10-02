<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import PhotoCard from '@/components/PhotoCard.vue';
import { works, years } from '@/data/gallery';

const { t } = useI18n();
const activeYear = ref<'all' | number>('all');
const INITIAL_BATCH = 10;
const LOAD_STEP = 6;
const visibleCount = ref(INITIAL_BATCH);
const sentinel = ref<HTMLElement>();
const observer = ref<IntersectionObserver>();
let loadingMore = false;

const sortedWorks = computed(() =>
  [...works].sort((a, b) => {
    if (a.year === b.year) {
      return a.slug.localeCompare(b.slug);
    }
    return b.year - a.year;
  })
);

const filteredWorks = computed(() => (
  activeYear.value === 'all'
    ? sortedWorks.value
    : sortedWorks.value.filter((work) => work.year === activeYear.value)
));

const visibleWorks = computed(() => filteredWorks.value.slice(0, visibleCount.value));

const hasMore = computed(() => visibleCount.value < filteredWorks.value.length);

function loadMore() {
  if (!hasMore.value) {
    return;
  }

  visibleCount.value = Math.min(
    visibleCount.value + LOAD_STEP,
    filteredWorks.value.length
  );
}

function resetVisibleCount() {
  visibleCount.value = Math.min(INITIAL_BATCH, filteredWorks.value.length || INITIAL_BATCH);
}

function disconnectObserver() {
  observer.value?.disconnect();
  observer.value = undefined;
}

function createObserver() {
  disconnectObserver();

  if (!sentinel.value || !hasMore.value) {
    return;
  }

  observer.value = new IntersectionObserver((entries) => {
    const isIntersecting = entries.some((entry) => entry.isIntersecting);

    if (!isIntersecting || loadingMore) {
      return;
    }

    loadingMore = true;
    loadMore();
    requestAnimationFrame(() => {
      loadingMore = false;
    });
  }, {
    rootMargin: '40% 0px',
    threshold: [0.1]
  });

  observer.value.observe(sentinel.value);
}

watch(activeYear, () => {
  resetVisibleCount();
});

watch(filteredWorks, () => {
  resetVisibleCount();
});

watch([hasMore, sentinel], () => {
  createObserver();
});

onMounted(() => {
  resetVisibleCount();
  createObserver();
});

onBeforeUnmount(() => {
  disconnectObserver();
});
</script>

<template>
  <section class="gallery">
    <aside class="years">
      <span class="years-label">{{ t('gallery.years') }}</span>
      <button
        class="year"
        :class="{ active: activeYear === 'all' }"
        type="button"
        @click="activeYear = 'all'"
      >
        {{ t('gallery.allYears') }}
      </button>
      <button
        v-for="year in years"
        :key="year"
        class="year"
        :class="{ active: activeYear === year }"
        type="button"
        @click="activeYear = year"
      >
        {{ year }}
      </button>
    </aside>
    <div class="grid">
      <header class="gallery-header">
        <div class="eyebrow">{{ t('gallery.years') }}</div>
        <h1>{{ t('gallery.title') }}</h1>
        <p>{{ t('gallery.subtitle') }}</p>
      </header>
      <div class="masonry">
        <PhotoCard v-for="work in visibleWorks" :key="work.slug" :work="work" />
      </div>
      <div ref="sentinel" class="sentinel" aria-hidden="true"></div>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 2.5rem;
  min-height: 100vh;
  padding: 4rem clamp(1.5rem, 6vw, 4.5rem);
  background: #ffffff;
  color: #1f232a;
}

.years {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--muted);
  position: sticky;
  top: 140px;
  align-self: start;
}

.years-label {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  color: #c2c7d3;
}

.year {
  text-align: left;
  color: inherit;
  padding: 0.15rem 0;
  position: relative;
  transition: color 0.2s ease, transform 0.2s ease;
}

.year.active,
.year:hover {
  color: #1f232a;
  transform: translateX(2px);
}

.year.active::before {
  content: '';
  position: absolute;
  left: -0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1.5rem;
  border-radius: 999px;
  background: #d9dfe8;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.gallery-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gallery-header h1 {
  margin: 0;
  font-size: clamp(1.75rem, 2.4vw + 1rem, 3rem);
  letter-spacing: 0.08em;
  font-weight: 500;
}

.gallery-header p {
  margin: 0;
  max-width: 36rem;
  color: var(--muted);
  line-height: 1.7;
}

.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #c2c7d3;
}

.masonry {
  column-width: 300px;
  column-gap: 0;
}

.masonry :deep(.photo-card-container) {
  margin-bottom: 0;
}

.sentinel {
  height: 1px;
}

@media (max-width: 1024px) {
  .gallery {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 3rem clamp(1.25rem, 6vw, 3rem);
  }

  .years {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
    justify-content: flex-start;
  }

  .year::before {
    display: none;
  }

  .masonry {
    column-width: 260px;
  }
}

@media (max-width: 768px) {
  .gallery-header h1 {
    font-size: 1.8rem;
    letter-spacing: 0.18em;
  }

  .gallery-header p {
    font-size: 0.95rem;
  }

  .masonry {
    column-width: 200px;
  }
}
</style>
