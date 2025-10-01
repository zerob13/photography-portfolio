<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section class="page about">
    <header class="page-header">
      <h1>{{ t('about.title') }}</h1>
      <p>{{ t('about.subtitle') }}</p>
    </header>
    <div class="about-grid">
      <article class="bio">
        <h2>{{ t('about.storyTitle') }}</h2>
        <p>{{ t('about.story1') }}</p>
        <p>{{ t('about.story2') }}</p>
      </article>
      <aside class="highlights">
        <h2>{{ t('about.highlightTitle') }}</h2>
        <ul>
          <li>{{ t('about.highlight1') }}</li>
          <li>{{ t('about.highlight2') }}</li>
          <li>{{ t('about.highlight3') }}</li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2.2rem;
  letter-spacing: 0.16em;
}

.page-header p {
  max-width: 38rem;
  color: var(--muted);
}

.about-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.bio,
.highlights {
  background-color: #f9f9f9;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 12px 30px rgba(31, 31, 31, 0.08);
}

.bio p {
  line-height: 1.9;
}

.highlights ul {
  margin: 1.5rem 0 0;
  padding-left: 1.25rem;
  color: #424242;
  line-height: 1.8;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
