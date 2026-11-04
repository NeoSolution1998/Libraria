<template>
  <div class="profile">
    <header-vue />

    <main class="profile-main">
      <div v-if="loading" class="shell profile-state">Открываем профиль…</div>

      <div v-else-if="error" class="shell profile-state">
        <h1>{{ errorTitle }}</h1>
        <p>{{ errorText }}</p>
        <router-link v-if="error === 'auth'" :to="{ name: 'Login', query: { redirect: $route.fullPath } }" class="btn btn--primary">
          Войти
        </router-link>
        <router-link v-else :to="{ name: 'Home' }" class="btn btn--outline">На главную</router-link>
      </div>

      <template v-else>
        <div class="shell">
          <section class="pf-hero">
            <span class="pf-hero__decor" aria-hidden="true"></span>

            <div class="pf-hero__avatar">
              <img
                v-if="profile.avatar && !isBroken('avatar')"
                :src="profile.avatar"
                :alt="profile.name"
                @error="markBroken('avatar')"
              />
              <span v-else>{{ initialsOf(profile.name) }}</span>
            </div>

            <div class="pf-hero__info">
              <h1>{{ profile.name }}</h1>
              <p>{{ memberSince }}</p>

              <dl class="pf-stats">
                <div>
                  <dd>{{ startedCount }}</dd>
                  <dt>начато</dt>
                </div>
                <div>
                  <dd>{{ finishedCount }}</dd>
                  <dt>завершено</dt>
                </div>
                <div>
                  <dd>{{ formatNumber(postsTotal) }}</dd>
                  <dt>{{ postWord(postsTotal) }}</dt>
                </div>
                <div>
                  <dd>{{ followersLabel }}</dd>
                  <dt>подписчиков</dt>
                </div>
              </dl>
            </div>

            <div class="pf-hero__actions">
              <button v-if="isOwn" type="button" class="pf-btn pf-btn--white" @click="openEdit">
                Редактировать профиль
              </button>
              <router-link v-else :to="{ name: 'Login' }" class="pf-btn pf-btn--white">
                Подписаться
              </router-link>

              <router-link v-if="isOwn" :to="{ name: 'Profile' }" class="pf-hero__link">
                Настройки аккаунта
              </router-link>
            </div>
          </section>

          <nav class="pf-actions" aria-label="Управление профилем">
            <router-link :to="{ name: 'ProfileBooks' }" class="pf-action">
              <span class="icon-bookmark" aria-hidden="true"></span>
              Мои книги <b>{{ counts.books }}</b>
            </router-link>
            <router-link :to="{ name: 'ProfilePosts' }" class="pf-action">
              <span class="icon-pencil" aria-hidden="true"></span>
              Мои посты <b>{{ counts.posts }}</b>
            </router-link>
            <router-link :to="{ name: 'ProfileWishlist' }" class="pf-action">
              <span class="icon-bookmark" aria-hidden="true"></span>
              Хочу прочитать <b>{{ wishlistBooks.length }}</b>
            </router-link>
            <router-link :to="{ name: 'BookCreate' }" class="pf-action pf-action--ghost">
              <span aria-hidden="true">+</span>
              Добавить книгу
            </router-link>
            <router-link :to="{ name: 'PostCreate' }" class="pf-action pf-action--ghost">
              <span aria-hidden="true">+</span>
              Написать пост
            </router-link>
          </nav>
        </div>

        <div class="shell pf-layout">
          <div class="pf-left">
            <section v-if="isOwn && reading.length" class="pf-section">
              <header class="pf-head">
                <h2>Читаю сейчас</h2>
                <router-link :to="{ name: 'Books' }" class="pf-head__link">Вся библиотека</router-link>
              </header>

              <div class="pf-reading">
                <router-link
                  v-for="(entry, index) in reading"
                  :key="entry.bookId"
                  :to="{ name: 'Chapter', params: { bookId: entry.bookId, chapterId: entry.chapterId } }"
                  class="pf-read"
                >
                  <span class="pf-read__cover" :style="coverStyle(entry, index)">
                    <img
                      v-if="entry.cover && !isBroken(`cover-${entry.bookId}`)"
                      :src="entry.cover"
                      :alt="entry.title"
                      @error="markBroken(`cover-${entry.bookId}`)"
                    />
                    <span v-else class="pf-read__cover-text">{{ entry.title }}</span>
                  </span>

                  <span class="pf-read__body">
                    <strong>{{ entry.title }}</strong>
                    <small>Глава {{ entry.chapterIndex }} из {{ entry.totalChapters || '—' }}</small>
                    <span class="pf-read__cta">
                      Продолжить чтение
                      <span class="icon-right-open" aria-hidden="true"></span>
                    </span>
                  </span>
                </router-link>
              </div>
            </section>

            <section class="pf-section">
              <header class="pf-head">
                <h2>{{ isOwn ? 'Мои посты' : 'Посты' }}</h2>
                <router-link
                  v-if="isOwn"
                  :to="{ name: 'Posts' }"
                  class="pf-head__link"
                >
                  Все мои публикации
                </router-link>
              </header>

              <div v-if="posts.length" class="pf-posts">
                <router-link
                  v-for="post in posts"
                  :key="post.id"
                  :to="{ name: 'Post', params: { id: post.id } }"
                  class="pf-post"
                >
                  <div class="pf-post__meta">
                    <span v-if="tagOf(post)" class="pf-chip">{{ tagOf(post) }}</span>
                    <time>{{ dateLabel(post) }}</time>
                  </div>
                  <h3>{{ post.title }}</h3>
                  <p>{{ excerptOf(post, 160) }}</p>
                  <div class="pf-post__stats">
                    <span><span class="icon-heart" aria-hidden="true"></span>{{ compactNumber(post.likes_count) }}</span>
                    <span><span class="icon-comment" aria-hidden="true"></span>{{ compactNumber(post.comments_count) }}</span>
                    <span><span class="icon-eye" aria-hidden="true"></span>{{ compactNumber(post.views_count) }}</span>
                  </div>
                </router-link>
              </div>

              <p v-else class="pf-empty">Публикаций пока нет.</p>
            </section>
          </div>

          <aside class="pf-side">
            <section v-if="aboutRows.length || contacts.length" class="pf-card">
              <header class="pf-card__head">
                <h3>О себе</h3>
              </header>

              <p v-if="profile.about" class="pf-about">{{ profile.about }}</p>

              <dl v-if="aboutRows.length" class="pf-facts">
                <div v-for="row in aboutRows" :key="row.label">
                  <dt>{{ row.label }}</dt>
                  <dd>{{ row.value }}</dd>
                </div>
              </dl>

              <ul v-if="contacts.length" class="pf-contacts">
                <li v-for="contact in contacts" :key="contact.label">
                  <a :href="contact.href" target="_blank" rel="noopener">
                    <span class="pf-contacts__label">{{ contact.label }}</span>
                    <span class="pf-contacts__value">{{ contact.value }}</span>
                  </a>
                </li>
              </ul>
            </section>

            <section v-if="isOwn" class="pf-card">
              <header class="pf-card__head">
                <h3>Активность</h3>
              </header>

              <div class="pf-activity">
                <p class="pf-activity__value">
                  <span class="icon-light-up" aria-hidden="true"></span>
                  {{ streakDays }} {{ dayWord(streakDays) }}
                </p>
                <p class="pf-activity__label">ударный режим чтения</p>

                <div class="pf-week" aria-hidden="true">
                  <span
                    v-for="(active, index) in weekActivity"
                    :key="index"
                    :class="{ 'is-active': active }"
                  ></span>
                </div>

                <p class="pf-activity__quote">
                  «Чтение — лучший способ путешествовать, не выходя из дома».
                </p>
              </div>
            </section>

            <section v-if="following.length" class="pf-card">
              <header class="pf-card__head">
                <h3>Подписки</h3>
              </header>

              <ul class="pf-following">
                <li v-for="author in following.slice(0, 4)" :key="author.id">
                  <router-link :to="{ name: 'Profile', params: { id: author.id } }" class="pf-following__user">
                    <span class="pf-following__avatar">
                      <img
                        v-if="author.avatar && !isBroken(`avatar-${author.id}`)"
                        :src="author.avatar"
                        :alt="author.name"
                        @error="markBroken(`avatar-${author.id}`)"
                      />
                      <span v-else>{{ initialsOf(author.name) }}</span>
                    </span>
                    <span class="pf-following__info">
                      <strong>{{ author.name }}</strong>
                      <small>{{ author.city || 'Читатель библиотеки' }}</small>
                    </span>
                  </router-link>

                  <button type="button" class="pf-following__btn" @click="unfollow(author)">Профиль</button>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </template>
    </main>

    <footer-vue />

    <div v-if="editOpen" class="pf-modal" @click.self="closeEdit">
      <form class="pf-modal__card" @submit.prevent="saveProfile">
        <h2>Редактировать профиль</h2>

        <label class="pf-field">
          <span>Имя</span>
          <input v-model.trim="edit.name" type="text" required />
        </label>

        <label class="pf-field">
          <span>Электронная почта</span>
          <input v-model.trim="edit.email" type="email" />
        </label>

        <div class="pf-modal__row">
          <label class="pf-field">
            <span>Город</span>
            <input v-model.trim="edit.city" type="text" />
          </label>
          <label class="pf-field">
            <span>Дата рождения</span>
            <input v-model="edit.birth_date" type="date" />
          </label>
        </div>

        <label class="pf-field">
          <span>О себе</span>
          <textarea v-model.trim="edit.about" rows="4"></textarea>
        </label>

        <div class="pf-modal__row">
          <label class="pf-field">
            <span>Telegram</span>
            <input v-model.trim="edit.telegram" type="text" placeholder="@nickname" />
          </label>
          <label class="pf-field">
            <span>Телефон</span>
            <input v-model.trim="edit.phone" type="text" placeholder="+7 …" />
          </label>
        </div>

        <div class="pf-modal__row">
          <label class="pf-field">
            <span>GitHub</span>
            <input v-model.trim="edit.github" type="text" />
          </label>
          <label class="pf-field">
            <span>ВКонтакте</span>
            <input v-model.trim="edit.vk" type="text" />
          </label>
        </div>

        <label class="pf-field">
          <span>Хабр</span>
          <input v-model.trim="edit.habr" type="text" />
        </label>

        <label class="pf-field pf-field--file">
          <span>Аватар</span>
          <input type="file" accept="image/*" @change="pickAvatar" />
          <small v-if="edit.avatarName">{{ edit.avatarName }}</small>
        </label>

        <p v-if="editError" class="pf-modal__error">{{ editError }}</p>

        <div class="pf-modal__actions">
          <button type="button" class="btn btn--outline" @click="closeEdit">Отмена</button>
          <button type="submit" class="btn btn--primary" :disabled="saving">
            {{ saving ? 'Сохраняем…' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapGetters } from 'vuex';

const COVER_COLORS = ['#36513F', '#24324A', '#A8843F', '#2B2B2B', '#7C8F74', '#6B2E2E'];

export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: null,
      posts: [],
      postsTotal: 0,
      following: [],
      reading: [],
      wishlistBooks: [],
      loading: true,
      error: false,
      editOpen: false,
      editing: false,
      saving: false,
      editError: '',
      edit: {
        name: '',
        email: '',
        city: '',
        birth_date: '',
        about: '',
        telegram: '',
        phone: '',
        github: '',
        vk: '',
        habr: '',
        avatar: null,
        avatarName: '',
      },
      broken: {},
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),

    targetId() {
      return this.$route.params.id ? Number(this.$route.params.id) : null;
    },

    isOwn() {
      if (!this.user) return false;
      return !this.targetId || Number(this.user.id) === this.targetId;
    },

    errorTitle() {
      return this.error === 'auth' ? 'Войдите, чтобы открыть профиль' : 'Профиль не найден';
    },

    errorText() {
      return this.error === 'auth'
        ? 'Профили доступны после входа в аккаунт.'
        : 'Возможно, пользователь удалил аккаунт.';
    },

    counts() {
      return {
        books: Number(this.profile?.books_count ?? this.profile?.books?.length ?? 0) || 0,
        posts: Number(this.profile?.posts_count ?? this.profile?.posts?.length ?? 0) || 0,
        followers: Number(this.profile?.followers_count ?? 0) || 0,
        following: Number(this.profile?.following_count ?? 0) || 0,
      };
    },

    aboutRows() {
      const rows = [];
      if (this.profile?.city) rows.push({ label: 'Город', value: this.profile.city });

      if (this.profile?.birth_date) {
        const date = new Date(this.profile.birth_date);
        if (!Number.isNaN(date.getTime())) {
          rows.push({
            label: 'Дата рождения',
            value: `${date.getDate()} ${this.monthName(date)} ${date.getFullYear()}`,
          });
        }
      }

      if (this.profile?.created_at) {
        const date = new Date(this.profile.created_at);
        if (!Number.isNaN(date.getTime())) {
          rows.push({
            label: 'На сайте с',
            value: `${this.monthName(date)} ${date.getFullYear()}`,
          });
        }
      }

      if (this.counts.followers) rows.push({ label: 'Подписчиков', value: String(this.counts.followers) });
      if (this.counts.following) rows.push({ label: 'Подписок', value: String(this.counts.following) });

      return rows;
    },

    contacts() {
      const list = [];
      const { telegram, github, vk, habr, phone, email } = this.profile || {};

      if (telegram) {
        const handle = String(telegram).replace(/^@/, '');
        list.push({ label: 'Telegram', value: telegram, href: `https://t.me/${handle}` });
      }
      if (github) {
        list.push({ label: 'GitHub', value: github, href: `https://github.com/${String(github).replace(/^@/, '')}` });
      }
      if (vk) {
        list.push({ label: 'ВКонтакте', value: vk, href: `https://vk.com/${String(vk).replace(/^@/, '')}` });
      }
      if (habr) {
        list.push({ label: 'Хабр', value: habr, href: `https://habr.com/ru/users/${String(habr).replace(/^@/, '')}` });
      }
      if (email) {
        list.push({ label: 'Почта', value: email, href: `mailto:${email}` });
      }
      if (phone) {
        list.push({ label: 'Телефон', value: phone, href: `tel:${String(phone).replace(/\s+/g, '')}` });
      }

      return list;
    },

    memberSince() {
      const raw = this.profile?.created_at;
      const date = raw ? new Date(raw) : null;
      if (!date || Number.isNaN(date.getTime())) return 'Читатель Libraria';
      return `Читатель Libraria с ${this.monthName(date)} ${date.getFullYear()}`;
    },

    startedCount() {
      return this.isOwn ? this.reading.length : 0;
    },

    finishedCount() {
      if (!this.isOwn) return 0;
      return this.reading.filter((entry) => entry.totalChapters && entry.chapterIndex >= entry.totalChapters).length;
    },

    followersLabel() {
      const value = Number(this.profile?.followers_count);
      return Number.isFinite(value) && value >= 0 ? this.formatNumber(value) : '—';
    },

    streakDays() {
      return Math.max(1, this.reading.length * 3);
    },

    weekActivity() {
      const active = Math.min(7, Math.max(1, this.reading.length));
      return Array.from({ length: 7 }, (_, index) => index >= 7 - active);
    },
  },
  watch: {
    '$route.params.id': 'loadAll',
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    ...mapActions('auth', ['fetchUser']),

    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    async loadAll() {
      this.loading = true;
      this.error = false;

      try {
        if (!this.user && Cookies.get('auth_token')) {
          await this.fetchUser();
        }

        const id = this.targetId || this.user?.id;
        if (!id) {
          this.error = 'auth';
          this.loading = false;
          return;
        }

        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/users/${id}`, {
          headers: this.authHeaders(),
        });
        this.profile = data?.data || data;

        await Promise.all([this.loadPosts(id), this.loadFollowing(id)]);

        if (this.isOwn) {
          this.loadWishlist();
        }
        this.readReadingHistory();
      } catch (e) {
        this.error = e?.response?.status === 401 ? 'auth' : 'notfound';
      } finally {
        this.loading = false;
      }
    },

    async loadPosts(id) {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/posts`, {
          params: { author_id: id, per_page: 3, sort: 'date_desc' },
          headers: this.authHeaders(),
        });
        this.posts = data.posts || [];
        this.postsTotal = Number(data.total_posts ?? this.posts.length);
      } catch (e) {
        this.posts = [];
        this.postsTotal = 0;
      }
    },

    async loadFollowing(id) {
      if (!this.isOwn) return;
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/feed`, {
          headers: this.authHeaders(),
        });
        this.following = data.following || [];
      } catch (e) {
        this.following = [];
      }
    },

    async loadWishlist() {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/wishlist`, {
          headers: this.authHeaders(),
        });
        const list = data?.data ?? data;
        this.wishlistBooks = Array.isArray(list) ? list : [];
      } catch (e) {
        this.wishlistBooks = [];
      }
    },

    readReadingHistory() {
      if (!this.isOwn) return;
      try {
        const raw = JSON.parse(localStorage.getItem('libraria:reading-history') || '[]');
        this.reading = Array.isArray(raw) ? raw.filter((entry) => entry?.title).slice(0, 2) : [];
      } catch (e) {
        this.reading = [];
      }
    },

    openEdit() {
      this.edit = {
        name: this.profile?.name || '',
        email: this.profile?.email || '',
        city: this.profile?.city || '',
        birth_date: this.profile?.birth_date || '',
        about: this.profile?.about || '',
        telegram: this.profile?.telegram || '',
        phone: this.profile?.phone || '',
        github: this.profile?.github || '',
        vk: this.profile?.vk || '',
        habr: this.profile?.habr || '',
        avatar: null,
        avatarName: '',
      };
      this.editError = '';
      this.editOpen = true;
    },

    closeEdit() {
      this.editOpen = false;
    },

    pickAvatar(event) {
      const [file] = event.target.files || [];
      if (!file) return;
      this.edit.avatar = file;
      this.edit.avatarName = file.name;
    },

    async saveProfile() {
      if (this.saving) return;
      this.saving = true;
      this.editError = '';

      try {
        const fields = {
          name: this.edit.name,
          email: this.edit.email,
          city: this.edit.city || null,
          birth_date: this.edit.birth_date || null,
          about: this.edit.about || null,
          telegram: this.edit.telegram || null,
          phone: this.edit.phone || null,
          github: this.edit.github || null,
          vk: this.edit.vk || null,
          habr: this.edit.habr || null,
        };

        let response;
        if (this.edit.avatar) {
          const data = new FormData();
          Object.entries(fields).forEach(([key, value]) => {
            if (value !== null && value !== '') data.append(key, value);
          });
          data.append('avatar', this.edit.avatar);
          data.append('_method', 'patch');
          response = await axios.post(
            `${process.env.VUE_APP_API_URL}/api/v1/users/${this.profile.id}`,
            data,
            { headers: this.authHeaders() }
          );
        } else {
          response = await axios.patch(
            `${process.env.VUE_APP_API_URL}/api/v1/users/${this.profile.id}`,
            fields,
            { headers: { ...this.authHeaders(), 'Content-Type': 'application/json' } }
          );
        }

        const payload = response.data?.data || response.data;
        this.profile = { ...this.profile, ...payload };
        this.editOpen = false;
      } catch (e) {
        const errors = e?.response?.data?.errors;
        this.editError = errors
          ? Object.values(errors).flat().join(' ')
          : (e?.response?.data?.message || 'Не удалось сохранить изменения.');
      } finally {
        this.saving = false;
      }
    },

    unfollow(author) {
      this.$router.push({ name: 'Profile', params: { id: author.id } });
    },

    /* presentation */
    monthName(date) {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
      ];
      return months[date.getMonth()];
    },

    markBroken(key) {
      this.broken = { ...this.broken, [key]: true };
    },

    isBroken(key) {
      return Boolean(this.broken[key]);
    },

    coverStyle(entry, index) {
      const seed = Number(entry?.bookId ?? index) || index;
      return { '--cover-color': COVER_COLORS[seed % COVER_COLORS.length] };
    },

    initialsOf(name) {
      return String(name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },

    tagOf(post) {
      return post?.tags?.[0]?.name || post?.categories?.[0]?.name || '';
    },

    dateLabel(post) {
      const raw = post?.created_at;
      const date = raw ? new Date(raw) : null;
      return date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
        : '';
    },

    excerptOf(post, limit = 160) {
      const text = String(post?.content || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text.length > limit ? `${text.slice(0, limit).replace(/\s+\S*$/, '')}…` : text;
    },

    formatNumber(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number.toLocaleString('ru-RU').replace(/\u00A0/g, ' ') : '—';
    },

    compactNumber(value) {
      const number = Number(value) || 0;
      if (number < 1000) return String(number);
      const thousands = number / 1000;
      const rounded = thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
      return `${String(rounded).replace('.', ',')} тыс.`;
    },

    postWord(count) {
      const value = Math.abs(Number(count) || 0);
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'пост';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'поста';
      return 'постов';
    },

    dayWord(count) {
      const value = Math.abs(Number(count) || 0);
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'день';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'дня';
      return 'дней';
    },
  },
};
</script>

<style scoped>
/* Кнопки в стиле редизайна (локально, чтобы не задеть старые компоненты) */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
}

.btn--primary:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
}

.btn--outline {
  color: var(--ink);
  background: var(--cream);
  border-color: var(--line);
}

.btn--outline:hover {
  color: var(--ink);
  background: var(--surface-hover);
}

.btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.profile {
  background: var(--paper);
}

.shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

.profile-state {
  padding: 90px 24px 120px;
}

.profile-state h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 500;
  color: var(--ink);
}

.profile-state p {
  margin: 10px 0 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Hero */
.profile-main {
  padding-top: 34px;
  padding-bottom: 72px;
}

.pf-hero {
  position: relative;
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  padding: 30px 34px;
  overflow: hidden;
  color: var(--cream);
  background: var(--accent);
  border-radius: 20px;
}

.pf-hero__decor {
  position: absolute;
  top: -80px;
  right: -40px;
  width: 320px;
  height: 320px;
  background: rgba(251, 248, 242, 0.06);
  border-radius: 50%;
  pointer-events: none;
}

.pf-hero__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: 32px;
  color: var(--accent);
  background: var(--accent-light);
  border: 3px solid rgba(251, 248, 242, 0.25);
  border-radius: 50%;
}

.pf-hero__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pf-hero__info h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--cream);
}

.pf-hero__info p {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(251, 248, 242, 0.7);
}

.pf-stats {
  display: flex;
  gap: 34px;
  margin: 22px 0 0;
}

.pf-stats dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--cream);
}

.pf-stats dt {
  margin-top: 2px;
  font-size: 11px;
  color: rgba(251, 248, 242, 0.65);
}

.pf-hero__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  margin-left: auto;
}

.pf-btn--white {
  height: 40px;
  padding: 0 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: var(--cream);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
}

.pf-hero__link {
  font-size: 12px;
  color: rgba(251, 248, 242, 0.75);
  text-decoration: none;
  border-bottom: 1px solid rgba(251, 248, 242, 0.35);
}

/* Actions */
.pf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.pf-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 18px;
  font-size: 13px;
  color: var(--ink);
  text-decoration: none;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 999px;
  transition: background-color 0.2s ease;
}

.pf-action:hover {
  color: var(--ink);
  background: var(--surface-hover);
}

.pf-action b {
  font-weight: 500;
  color: var(--text-muted);
}

.pf-action--ghost {
  background: transparent;
  border-style: dashed;
  color: var(--text-secondary);
}

.pf-action [class^='icon-'] {
  font-size: 12px;
  color: var(--text-secondary);
}

/* About card */
.pf-about {
  margin: 14px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.pf-facts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0 0;
}

.pf-facts div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.pf-facts dt {
  font-size: 12px;
  color: var(--text-muted);
}

.pf-facts dd {
  margin: 0;
  font-size: 12.5px;
  color: var(--ink);
  text-align: right;
}

.pf-contacts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.pf-contacts a {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

.pf-contacts a:hover .pf-contacts__value {
  color: var(--accent);
  text-decoration: underline;
}

.pf-contacts__label {
  font-size: 12px;
  color: var(--text-muted);
}

.pf-contacts__value {
  overflow: hidden;
  font-size: 12.5px;
  color: var(--ink);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Layout */
.pf-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 44px;
  align-items: start;
  margin-top: 46px;
}

.pf-section + .pf-section {
  margin-top: 46px;
}

.pf-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.pf-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.pf-head__link {
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
}

.pf-head__link:hover {
  color: var(--accent);
}

/* Reading */








.pf-reading {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.pf-read {
  display: flex;
  gap: 16px;
  padding: 16px;
  text-decoration: none;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pf-read:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(30, 33, 36, 0.08);
}

.pf-read__cover {
  display: flex;
  flex: 0 0 64px;
  align-items: flex-end;
  width: 64px;
  height: 96px;
  padding: 8px;
  overflow: hidden;
  border-radius: 6px;
  background: var(--cover-color, var(--accent));
}

.pf-read__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pf-read__cover-text {
  font-family: var(--font-display);
  font-size: 9px;
  line-height: 1.15;
  color: rgba(251, 248, 242, 0.9);
}

.pf-read__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pf-read__body strong {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
}

.pf-read__body small {
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-muted);
}

.pf-read__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

/* Posts */
.pf-posts {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.pf-post {
  display: block;
  padding: 22px 24px;
  text-decoration: none;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pf-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(30, 33, 36, 0.08);
}

.pf-post__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--text-muted);
}

.pf-chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  font-size: 10px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 999px;
}

.pf-post h3 {
  margin: 10px 0 0;
  font-family: var(--font-display);
  font-size: 23px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
}

.pf-post p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.pf-post__stats {
  display: flex;
  gap: 16px;
  margin-top: 14px;
  font-size: 12px;
  color: var(--text-muted);
}

.pf-post__stats span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.pf-empty {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}

/* Side */
.pf-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pf-card {
  padding: 24px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
}

.pf-card__head h3 {
  margin: 0;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.pf-activity__value {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0;
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--ink);
}

.pf-activity__value .icon-light-up {
  font-size: 16px;
  color: var(--gold);
}

.pf-activity__label {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.pf-week {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
  margin-top: 18px;
}

.pf-week span {
  height: 22px;
  background: var(--line);
  border-radius: 4px;
}

.pf-week span.is-active {
  background: var(--accent);
}

.pf-activity__quote {
  margin: 18px 0 0;
  font-family: var(--font-display);
  font-size: 12px;
  font-style: italic;
  line-height: 1.5;
  color: var(--text-muted);
}

.pf-following {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.pf-following li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pf-following__user {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.pf-following__avatar {
  display: flex;
  flex: 0 0 34px;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  overflow: hidden;
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 50%;
}

.pf-following__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pf-following__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pf-following__info strong {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}

.pf-following__info small {
  font-size: 11px;
  color: var(--text-muted);
}

.pf-following__btn {
  padding: 0;
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--text-secondary);
  background: none;
  border: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Modal */
.pf-modal {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(30, 33, 36, 0.45);
}

.pf-modal__card {
  width: 460px;
  max-width: 100%;
  padding: 28px;
  background: #fff;
  border-radius: 18px;
}

.pf-modal__card h2 {
  margin: 0 0 20px;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  color: var(--ink);
}

.pf-field {
  display: block;
  margin-bottom: 14px;
}

.pf-field span {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.pf-modal__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pf-field--file input {
  padding: 8px;
  background: var(--paper);
}

.pf-field--file small {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: var(--accent);
}

.pf-field input,
.pf-field textarea {
  width: 100%;
  padding: 10px 12px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
  resize: vertical;
}

.pf-field input:focus,
.pf-field textarea:focus {
  border-color: var(--accent);
}

.pf-modal__error {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--danger);
}

.pf-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.pf-modal__actions .btn {
  height: 40px;
  padding: 0 18px;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 1024px) {
  .pf-hero {
    grid-template-columns: 80px minmax(0, 1fr);
    row-gap: 18px;
  }

  .pf-hero__avatar {
    width: 80px;
    height: 80px;
    font-size: 26px;
  }

  .pf-hero__info h1 {
    font-size: 30px;
  }

  .pf-hero__actions {
    grid-column: span 2;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  .pf-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 760px) {



  .profile-main {
    padding-top: 18px;
    padding-bottom: 48px;
  }

  .pf-hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    padding: 20px;
    text-align: left;
  }

  .pf-hero__avatar {
    width: 72px;
    height: 72px;
    font-size: 24px;
  }

  .pf-hero__info h1 {
    font-size: 26px;
  }

  .pf-hero__info p {
    font-size: 12px;
  }

  .pf-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 0;
    margin-top: 16px;
  }

  .pf-hero__actions {
    grid-column: auto;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-left: 0;
  }

  .pf-btn--white {
    width: 100%;
    text-align: center;
  }

  .pf-hero__link {
    text-align: center;
  }

  .pf-actions {
    margin-top: 14px;
  }

  .pf-action {
    height: 36px;
    padding: 0 14px;
    font-size: 12px;
  }

  .pf-layout {
    margin-top: 30px;
    gap: 26px;
  }

  .pf-head h2 {
    font-size: 24px;
  }

  .pf-post {
    padding: 16px;
  }

  .pf-post h3 {
    font-size: 19px;
  }

  .pf-card {
    padding: 20px;
  }

  .pf-modal__row {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 760px) {
  .pf-stats {
    flex-wrap: wrap;
    gap: 18px;
  }

  .pf-reading {
    grid-template-columns: minmax(0, 1fr);
  }

  .pf-head h2 {
    font-size: 26px;
  }
}
</style>
