<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import PhotoCard from '@/components/PhotoCard.vue';
import { works, years } from '@/data/gallery';

const { t } = useI18n();
const activeYear = ref<'all' | number>('all');
const visibleCount = ref(6);

const sortedWorks = computed(() =>
  [...works].sort((a, b) => {
    if (a.year === b.year) {
      return a.slug.localeCompare(b.slug);
    }
    return b.year - a.year;
  })
);

const filteredWorks = computed(() => {
  const list = activeYear.value === 'all'
    ? sortedWorks.value
    : sortedWorks.value.filter((work) => work.year === activeYear.value);

  return list.slice(0, visibleCount.value);
});

const totalMatching = computed(() =>
  activeYear.value === 'all'
    ? sortedWorks.value.length
    : sortedWorks.value.filter((work) => work.year === activeYear.value).length
);

const hasMore = computed(() => filteredWorks.value.length < totalMatching.value);

watch(activeYear, () => {
  visibleCount.value = 6;
});

function showMore() {
  visibleCount.value += 4;
}
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
        <h1>{{ t('gallery.title') }}</h1>
        <p>{{ t('gallery.subtitle') }}</p>
      </header>
      <div class="photo-grid">
        <PhotoCard v-for="work in filteredWorks" :key="work.slug" :work="work" />
      </div>
      <div v-if="hasMore" class="more">
        <button type="button" @click="showMore">{{ t('gallery.loadMore') }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 3rem;
  min-height: 70vh;
}

.years {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--muted);
  position: sticky;
  top: 120px;
  align-self: start;
}

.years-label {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  color: #b0b0b0;
}

.year {
  text-align: left;
  color: inherit;
  padding: 0.25rem 0;
  position: relative;
  transition: color 0.2s ease;
}

.year.active,
.year:hover {
  color: #1f1f1f;
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
  background-color: #1f1f1f;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.gallery-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gallery-header h1 {
  font-size: 2rem;
  letter-spacing: 0.18em;
  margin: 0;
}

.gallery-header p {
  margin: 0;
  max-width: 32rem;
  color: var(--muted);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--gallery-gap);
}

.more {
  text-align: center;
  margin-top: 1rem;
}

.more button {
  padding: 0.75rem 2.5rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background-color: var(--surface);
  transition: background-color 0.2s ease;
}

.more button:hover {
  background-color: #1f1f1f;
  color: #fff;
}

@media (max-width: 1024px) {
  .gallery {
    grid-template-columns: 1fr;
  }

  .years {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    justify-content: flex-start;
  }

  .year::before {
    display: none;
  }
}

@media (max-width: 768px) {
  .gallery-header h1 {
    font-size: 1.6rem;
  }

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}
</style>
