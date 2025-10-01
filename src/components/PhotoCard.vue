<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Work } from '@/data/gallery';

type Locale = 'zh' | 'en';

const props = defineProps<{ work: Work }>();

const route = useRoute();
const isVisible = ref(false);
const isLoaded = ref(false);
const observer = ref<IntersectionObserver>();
const container = ref<HTMLElement>();
const activeSrc = ref(props.work.previewImage);

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
      <div class="image-wrapper" :class="{ loaded: isLoaded }">
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
}

.photo-card {
  display: block;
  background-color: var(--surface);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 14px 32px rgba(31, 31, 31, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photo-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(31, 31, 31, 0.12);
}

.image-wrapper {
  position: relative;
  padding-bottom: 130%;
  background: #f0f0f0;
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(12px);
  transform: scale(1.02);
  transition: filter 0.6s ease, transform 0.6s ease;
}

.image-wrapper.loaded img {
  filter: blur(0);
  transform: scale(1);
}

.photo-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem 1.5rem 1.75rem;
}

.photo-title {
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.photo-location {
  font-size: 0.85rem;
  color: var(--muted);
}
</style>
