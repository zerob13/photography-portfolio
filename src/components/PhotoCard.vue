<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Work, Locale } from '@/data/gallery';

const props = defineProps<{ work: Work }>();

const route = useRoute();
const isVisible = ref(false);
const isLoaded = ref(false);
const observer = ref<IntersectionObserver>();
const container = ref<HTMLElement>();
const activeSrc = ref(props.work.previewImage);
const orientationClass = computed(
  () => `orientation-${props.work.orientation ?? 'landscape'}`
);

function loadFullImage() {
  const image = new Image();
  image.src = props.work.coverImage;
  image.onload = () => {
    activeSrc.value = props.work.coverImage;
    isLoaded.value = true;
  };
}

onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.value?.disconnect();
        }
      });
    }, { rootMargin: '150px' });

    if (container.value) {
      observer.value.observe(container.value);
    }
  } else {
    isVisible.value = true;
  }
});

onBeforeUnmount(() => {
  observer.value?.disconnect();
});

watch(isVisible, (visible) => {
  if (visible) {
    loadFullImage();
  }
});

const currentLocale = () => (route.params.locale as Locale) ?? 'zh';
</script>

<template>
  <div class="photo-card-container" ref="container">
    <RouterLink
      :to="{ name: 'work-detail', params: { slug: work.slug, locale: currentLocale() } }"
      class="photo-card"
    >
      <div class="image-wrapper" :class="[orientationClass, { loaded: isLoaded }]">
        <img
          :src="activeSrc"
          :alt="work.title[currentLocale()]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="photo-meta">
        <span class="photo-title">{{ work.title[currentLocale()] }}</span>
        <span class="photo-location">{{ work.location[currentLocale()] }}</span>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>

.photo-card-container {
  display: block;
  break-inside: avoid;
}

.photo-card {
  display: block;
  position: relative;
  color: inherit;
}

.image-wrapper {
  position: relative;
  background: #f6f7f9;
  overflow: hidden;
  aspect-ratio: 3 / 2;
}

.image-wrapper.orientation-portrait {
  aspect-ratio: 2 / 3;
}

.image-wrapper.orientation-square {
  aspect-ratio: 1 / 1;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(14px) saturate(1.02);
  transform: scale(1.02);
  transition: filter 0.5s ease, transform 0.5s ease;
}

.image-wrapper.loaded img {
  filter: blur(0) saturate(1);
  transform: scale(1);
}

.photo-meta {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1rem 1.15rem 1.25rem;
  color: #1f232a;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.88) 60%,
    rgba(255, 255, 255, 0.96) 78%,
    #ffffff 100%
  );
}

.photo-title {
  font-size: 0.92rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
}

.photo-location {
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  color: var(--muted);
}
</style>
