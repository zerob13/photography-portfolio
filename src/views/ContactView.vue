<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const form = reactive({
  name: '',
  email: '',
  message: ''
});

function submit() {
  alert(t('contact.toast'));
  form.name = '';
  form.email = '';
  form.message = '';
}
</script>

<template>
  <section class="page contact">
    <header class="page-header">
      <h1>{{ t('contact.title') }}</h1>
      <p>{{ t('contact.subtitle') }}</p>
    </header>
    <div class="contact-grid">
      <article class="contact-info">
        <h2>{{ t('contact.infoTitle') }}</h2>
        <p>{{ t('contact.infoDescription') }}</p>
        <ul>
          <li><strong>{{ t('contact.emailLabel') }}:</strong> hello@example.com</li>
          <li><strong>{{ t('contact.phoneLabel') }}:</strong> +86 138 0000 0000</li>
          <li><strong>{{ t('contact.locationLabel') }}:</strong> {{ t('contact.locationValue') }}</li>
        </ul>
      </article>
      <form class="contact-form" @submit.prevent="submit">
        <label>
          {{ t('contact.form.name') }}
          <input v-model="form.name" type="text" required />
        </label>
        <label>
          {{ t('contact.form.email') }}
          <input v-model="form.email" type="email" required />
        </label>
        <label>
          {{ t('contact.form.message') }}
          <textarea v-model="form.message" rows="5" required></textarea>
        </label>
        <button type="submit">{{ t('contact.form.submit') }}</button>
      </form>
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
  max-width: 36rem;
  color: var(--muted);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
}

.contact-info,
.contact-form {
  background-color: #f9f9f9;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 12px 30px rgba(31, 31, 31, 0.08);
}

.contact-info ul {
  margin: 1.5rem 0 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

input,
textarea {
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  font: inherit;
  background-color: #fff;
}

button[type='submit'] {
  align-self: flex-start;
  padding: 0.85rem 2.5rem;
  border-radius: 999px;
  border: none;
  background-color: var(--accent);
  color: #463a32;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

button[type='submit']:hover {
  transform: translateY(-2px);
  background-color: #e6ccb6;
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
