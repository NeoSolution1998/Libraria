<template>
  <div class="pf-page">
    <div v-if="profileLoading && !profileData" class="pf-state pf-state--loading" aria-live="polite">
      <span class="pf-spinner" aria-hidden="true"></span>
      <p>Открываем профиль…</p>
    </div>

    <div v-else-if="error" class="pf-state">
      <span class="pf-kicker">ПРОФИЛЬ</span>
      <h1>{{ errorTitle }}</h1>
      <p>{{ errorText }}</p>
      <div class="pf-state__actions">
        <router-link v-if="error === 'auth'" :to="{ name: 'Login', query: { redirect: $route.fullPath } }" class="pf-btn pf-btn--primary">Войти в библиотеку</router-link>
        <button v-else type="button" class="pf-btn pf-btn--primary" @click="loadProfile">Повторить</button>
        <router-link :to="{ name: 'Home' }" class="pf-btn pf-btn--ghost">На главную</router-link>
      </div>
    </div>

    <template v-else-if="profileData">
      <div class="pf-shell">
        <section class="pf-hero-card">
          <div class="pf-hero-card__decor" aria-hidden="true"><span class="pf-hero-card__circle"></span></div>
          <div class="pf-hero-card__inner">
            <div class="pf-avatar-wrap">
              <div class="pf-avatar">
                <img v-if="profileData.avatar && !avatarFailed" :src="profileData.avatar" :alt="profileData.name" @error="avatarFailed = true" />
                <span v-else>{{ initials }}</span>
              </div>
              <button v-if="isOwn" type="button" class="pf-avatar-edit" aria-label="Редактировать профиль" @click="openEdit">
                <span class="icon-camera" aria-hidden="true"></span>
              </button>
            </div>

            <div class="pf-identity">
              <h1>{{ profileData.name }}</h1>
              <p>Читатель Libraria{{ joinedLabel ? ` с ${joinedLabel}` : '' }}</p>
              <div class="pf-hero-stats">
                <div class="pf-hero-stat"><b>{{ stats.books }}</b><span>Книг</span></div>
                <div class="pf-hero-stat"><b>{{ stats.posts }}</b><span>Постов</span></div>
                <div class="pf-hero-stat"><b>{{ stats.followers }}</b><span>Подписчиков</span></div>
                <div class="pf-hero-stat"><b>{{ stats.following }}</b><span>Подписок</span></div>
              </div>
            </div>

            <div class="pf-hero-actions">
              <template v-if="isOwn">
                <button type="button" class="pf-btn pf-btn--paper" @click="openEdit">Редактировать профиль</button>
                <div ref="createMenu" class="pf-create">
                  <button type="button" class="pf-btn pf-btn--outline-paper" :aria-expanded="createOpen" @click.stop="createOpen = !createOpen">
                    <span class="icon-plus-squared" aria-hidden="true"></span> Создать
                  </button>
                  <transition name="pf-fade">
                    <div v-if="createOpen" class="pf-create__menu">
                      <router-link :to="{ name: 'PostCreate' }" @click="createOpen = false"><span class="icon-pencil" aria-hidden="true"></span><span><b>Пост</b><small>Мысли о книге</small></span></router-link>
                      <router-link :to="{ name: 'BookCreate' }" @click="createOpen = false"><span class="icon-folder-open" aria-hidden="true"></span><span><b>Книга</b><small>Добавить в библиотеку</small></span></router-link>
                    </div>
                  </transition>
                </div>
              </template>
              <button v-else type="button" class="pf-btn pf-btn--paper" :disabled="followLoading" @click="toggleFollow">
                {{ isFollowing ? 'Вы подписаны' : 'Подписаться' }}
              </button>
            </div>
          </div>
        </section>

        <div class="pf-columns">
          <main class="pf-left">
            <section class="pf-block">
              <div class="pf-block__head">
                <h2>Читаю сейчас</h2>
                <router-link :to="{ name: 'Books' }" class="pf-block__link">Вся библиотека <span class="icon-right-open" aria-hidden="true"></span></router-link>
              </div>
              <div v-if="readingBooks.length" class="pf-reading-grid">
                <article v-for="book in readingBooks" :key="book.id" class="pf-reading-card">
                  <router-link :to="bookLink(book)" class="pf-reading-cover" :style="bookGradient(book)">
                    <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" @error="book.cover_image = null" loading="lazy" />
                    <span v-else>{{ initialOf(book.title) }}</span>
                  </router-link>
                  <div class="pf-reading-body">
                    <div>
                      <h3><router-link :to="bookLink(book)">{{ book.title }}</router-link></h3>
                      <p>{{ book.author || 'Автор не указан' }} · {{ chapterLabelFor(book) }}</p>
                    </div>
                    <div class="pf-reading-progress">
                      <span class="pf-progress"><i :style="{ width: progressFor(book) + '%' }"></i></span>
                      <router-link :to="readLinkFor(book)" class="pf-reading-continue">Продолжить чтение <span class="icon-right-open" aria-hidden="true"></span></router-link>
                    </div>
                  </div>
                </article>
              </div>
              <div v-else class="pf-empty pf-empty--compact"><span class="icon-folder-open" aria-hidden="true"></span><h3>Пока нет книг</h3><p v-if="isOwn">Добавьте первую книгу — она появится здесь.</p></div>
            </section>

            <section class="pf-block">
              <div class="pf-block__head">
                <h2>Мои посты</h2>
                <router-link v-if="isOwn" :to="{ name: 'PostCreate' }" class="pf-block__link">Написать пост <span class="icon-plus-squared" aria-hidden="true"></span></router-link>
              </div>
              <div v-if="createdPosts.length" class="pf-post-list">
                <article v-for="post in createdPosts.slice(0, 3)" :key="post.id" class="pf-post-row">
                  <router-link :to="postLink(post)" class="pf-post-row__cover" :style="postGradient(post)">
                    <img v-if="post.image" :src="post.image" :alt="post.title" loading="lazy" />
                    <span v-else>{{ initialOf(post.title) }}</span>
                  </router-link>
                  <div class="pf-post-row__body">
                    <div class="pf-post-row__meta">
                      <span v-if="firstTag(post)" class="pf-tag">{{ firstTag(post) }}</span>
                      <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
                    </div>
                    <h3><router-link :to="postLink(post)">{{ post.title }}</router-link></h3>
                    <p>{{ excerpt(post.content, 180) }}</p>
                    <div class="pf-post-row__footer">
                      <span><span class="icon-heart" aria-hidden="true"></span>{{ post.likes_count || 0 }}</span>
                      <span><span class="icon-chat" aria-hidden="true"></span>{{ post.comments_count || 0 }}</span>
                      <span><span class="icon-eye" aria-hidden="true"></span>{{ post.views_count || 0 }}</span>
                      <span v-if="isOwn" class="pf-post-row__actions">
                        <router-link :to="{ name: 'PostEdit', params: { id: post.id } }" class="pf-icon-btn" aria-label="Редактировать пост"><span class="icon-pencil" aria-hidden="true"></span></router-link>
                        <button type="button" class="pf-icon-btn pf-icon-btn--danger" aria-label="Удалить пост" @click="askDelete('posts', post)"><span class="icon-trash" aria-hidden="true"></span></button>
                      </span>
                    </div>
                  </div>
                </article>
              </div>
              <div v-else class="pf-empty"><span class="icon-chat" aria-hidden="true"></span><h3>Публикаций пока нет</h3><p v-if="isOwn">Расскажите о книге, которая оставила след.</p><router-link v-if="isOwn" :to="{ name: 'PostCreate' }" class="pf-btn pf-btn--primary">Написать первый пост</router-link></div>
            </section>

          </main>

          <aside class="pf-right">
            <section class="pf-activity-card">
              <h3>Активность</h3>
              <div class="pf-activity-main">
                <span class="pf-activity-icon icon-star" aria-hidden="true"></span>
                <div><b>{{ stats.books + stats.posts }}</b><p>материалов в библиотеке</p></div>
              </div>
              <div class="pf-activity-weeks" aria-hidden="true">
                <i v-for="n in 7" :key="n" :class="'is-' + ((n * 3 + stats.posts) % 5)"></i>
              </div>
              <p class="pf-activity-quote">«Чтение — лучший способ путешествовать, не выходя из дома»</p>
            </section>

            <section class="pf-following-card">
              <div class="pf-block__head"><h3>Подписки</h3><span>{{ stats.following }}</span></div>
              <div v-if="profileData.following?.length" class="pf-people">
                <router-link v-for="person in profileData.following.slice(0, 4)" :key="person.id" :to="{ name: 'Profile', params: { id: person.id } }" class="pf-person">
                  <span class="pf-person__avatar"><img v-if="person.avatar" :src="person.avatar" :alt="person.name" loading="lazy" /><span v-else>{{ initialOf(person.name) }}</span></span>
                  <span><b>{{ person.name }}</b><small>{{ person.city || 'читатель' }}</small></span>
                  <span class="pf-person__link">Профиль</span>
                </router-link>
              </div>
              <p v-else class="pf-muted">Пока никого нет.</p>
              <router-link v-if="profileData.following?.length" :to="{ name: 'Profile', params: { id: profileData.id } }" class="pf-following-all">Показать все ({{ stats.following }})</router-link>
            </section>

          </aside>
        </div>

        <section class="pf-extra">
          <div class="pf-extra__grid">
            <section class="pf-block">
              <div class="pf-block__head">
                <h2>Понравилось</h2>
                <span class="pf-block__count">{{ likedPosts.length + likedBooks.length }}</span>
              </div>
              <div v-if="likedPosts.length" class="pf-liked-posts">
                <article v-for="post in likedPosts.slice(0, 2)" :key="post.id" class="pf-liked-post">
                  <router-link :to="postLink(post)" class="pf-liked-post__title">{{ post.title }}</router-link>
                  <span>{{ post.user?.name || 'Автор' }} · {{ formatDate(post.created_at) }}</span>
                </article>
              </div>
              <div v-if="likedBooks.length" class="pf-book-grid pf-book-grid--liked">
                <article v-for="book in likedBooks.slice(0, 4)" :key="book.id" class="pf-book-card">
                  <router-link :to="bookLink(book)" class="pf-book-card__cover" :style="bookGradient(book)">
                    <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" @error="book.cover_image = null" loading="lazy" />
                    <span v-else>{{ initialOf(book.title) }}</span>
                  </router-link>
                  <h3><router-link :to="bookLink(book)">{{ book.title }}</router-link></h3>
                </article>
              </div>
              <p v-if="!likedPosts.length && !likedBooks.length" class="pf-muted">Пока ничего не понравилось.</p>
            </section>

            <section v-if="profileData.about || socialLinks.length" class="pf-block pf-about">
              <div class="pf-block__head"><h2>О читателе</h2><button v-if="isOwn" type="button" class="pf-block__link" @click="openEdit">Редактировать</button></div>
              <p>{{ profileData.about || 'Читатель пока не рассказал о себе.' }}</p>
              <div v-if="socialLinks.length" class="pf-socials">
                <a v-for="link in socialLinks" :key="link.label" :href="link.href" target="_blank" rel="noopener"><span>{{ link.mark }}</span>{{ link.label }}</a>
              </div>
            </section>
          </div>
        </section>
      </div>

      <EditProfileModal :visible="editOpen" :user="profileData" @update:visible="editOpen = $event" @saved="handleProfileSaved" />
      <transition name="pf-fade">
        <div v-if="deleteTarget" class="pf-confirm" role="dialog" aria-modal="true" aria-labelledby="pf-confirm-title" @click.self="deleteTarget = null">
          <div class="pf-confirm__card">
            <span class="pf-confirm__icon icon-trash" aria-hidden="true"></span>
            <span class="pf-kicker">УДАЛЕНИЕ</span>
            <h2 id="pf-confirm-title">Удалить {{ deleteTarget.type === 'posts' ? 'пост' : 'книгу' }}?</h2>
            <p>«{{ deleteTarget.item.title }}» исчезнет из библиотеки. Это действие нельзя отменить.</p>
            <div class="pf-confirm__actions"><button type="button" class="pf-btn pf-btn--ghost" :disabled="deleting" @click="deleteTarget = null">Отмена</button><button type="button" class="pf-btn pf-btn--danger" :disabled="deleting" @click="confirmDelete">{{ deleting ? 'Удаляем…' : 'Удалить' }}</button></div>
          </div>
        </div>
      </transition>
      <transition name="pf-fade"><div v-if="toastMessage" class="pf-toast" role="status">{{ toastMessage }}</div></transition>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapGetters } from 'vuex';
import EditProfileModal from '@/components/Profile/UserProfile/ProfileSections/EditProfileModal.vue';

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #36513f 0%, #283d30 100%)',
  'linear-gradient(135deg, #274d4a 0%, #173533 100%)',
  'linear-gradient(135deg, #6f5133 0%, #42301f 100%)',
  'linear-gradient(135deg, #4c5a6d 0%, #293441 100%)',
  'linear-gradient(135deg, #6c3d43 0%, #3d2226 100%)',
];

export default {
  name: 'ProfileContainer',
  components: { EditProfileModal },
  data() {
    return {
      activeTab: 'created',
      editOpen: false,
      createOpen: false,
      authChecked: false,
      avatarFailed: false,
      bannerFailed: false,
      deleting: false,
      deleteTarget: null,
      readingBooksData: [],
      readingLoading: false,
      toastMessage: '',
      toastTimer: null,
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('profile', {
      profileData: 'profile',
      profileLoading: 'loading',
      profileError: 'error',
      followLoading: 'followLoading',
    }),
    targetId() {
      return this.$route.params.id || this.user?.id || null;
    },
    isOwn() {
      if (!this.profileData) return false;
      if (this.profileData.is_own_profile) return true;
      return Boolean(this.user && Number(this.profileData.id) === Number(this.user.id));
    },
    error() {
      if (this.profileError) return this.profileError;
      if (this.authChecked && !this.user) return 'auth';
      return null;
    },
    errorTitle() {
      if (this.error === 'auth') return 'Войдите, чтобы открыть профиль';
      if (this.error === 'notfound') return 'Профиль не найден';
      return 'Не удалось загрузить профиль';
    },
    errorText() {
      if (this.error === 'auth') return 'Профили читателей доступны после входа. Войдите, и мы вернём вас на эту страницу.';
      if (this.error === 'notfound') return 'Возможно, пользователь удалил аккаунт или ссылка устарела.';
      return 'Проверьте подключение к библиотеке и попробуйте ещё раз.';
    },
    initials() {
      return this.initialsOf(this.profileData?.name);
    },
    roleLabel() {
      const roles = this.profileData?.roles || [];
      if (roles.includes('admin')) return 'администратор';
      if (roles.includes('author')) return 'автор';
      return 'читатель';
    },
    joinedYear() {
      return this.profileData?.created_at ? new Date(this.profileData.created_at).getFullYear() : '';
    },
    joinedLabel() {
      if (!this.profileData?.created_at) return '';
      return new Date(this.profileData.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    },
    readingBooks() {
      return this.readingBooksData;
    },
    createdBookIds() {
      return new Set((this.createdBooks || []).map((book) => Number(book.id)));
    },
    hasBanner() {
      return Boolean(this.profileData?.banner_image) && !this.bannerFailed;
    },
    coverStyle() {
      if (this.hasBanner) return {};
      return { background: 'linear-gradient(135deg, #36513f 0%, #2d4637 58%, #253a2e 100%)' };
    },
    stats() {
      return {
        posts: Number(this.profileData?.posts_count ?? this.profileData?.posts?.length) || 0,
        books: Number(this.profileData?.books_count ?? this.profileData?.books?.length) || 0,
        followers: Number(this.profileData?.followers_count) || 0,
        following: Number(this.profileData?.following_count) || 0,
      };
    },
    isFollowing() {
      return Boolean(this.profileData?.is_following);
    },
    createdPosts() {
      return this.profileData?.posts || [];
    },
    createdBooks() {
      return this.profileData?.books || [];
    },
    likedPosts() {
      return this.profileData?.liked_posts || [];
    },
    likedBooks() {
      return this.profileData?.liked_books || [];
    },
    tabs() {
      return [
        { id: 'created', label: 'Созданное', count: this.createdPosts.length + this.createdBooks.length },
        { id: 'liked', label: 'Понравилось', count: this.likedPosts.length + this.likedBooks.length },
        { id: 'about', label: 'О себе', count: 0 },
      ];
    },
    details() {
      const data = this.profileData || {};
      const rows = [];
      if (data.birth_date) rows.push({ label: 'Дата рождения', value: this.formatDate(data.birth_date) });
      if (data.city) rows.push({ label: 'Город', value: data.city });
      if (data.telegram) rows.push({ label: 'Telegram', value: `@${this.cleanHandle(data.telegram)}` });
      if (data.phone && this.isOwn) rows.push({ label: 'Телефон', value: data.phone });
      if (data.created_at) rows.push({ label: 'В библиотеке', value: this.formatDate(data.created_at, { year: 'numeric', month: 'long' }) });
      return rows;
    },
    socialLinks() {
      const data = this.profileData || {};
      const links = [];
      if (data.telegram) links.push({ label: 'Telegram', mark: 'TG', value: `@${this.cleanHandle(data.telegram)}`, href: `https://t.me/${this.cleanHandle(data.telegram)}` });
      if (data.github) links.push({ label: 'GitHub', mark: 'GH', value: `@${this.cleanHandle(data.github)}`, href: `https://github.com/${this.cleanHandle(data.github)}` });
      if (data.vk) links.push({ label: 'VK', mark: 'VK', value: `@${this.cleanHandle(data.vk)}`, href: `https://vk.com/${this.cleanHandle(data.vk)}` });
      if (data.habr) links.push({ label: 'Habr', mark: 'H', value: `@${this.cleanHandle(data.habr)}`, href: `https://habr.com/ru/users/${this.cleanHandle(data.habr)}/` });
      return links;
    },
  },
  watch: {
    '$route.params.id'() { this.loadProfile(); },
    'profileData.avatar'() { this.avatarFailed = false; },
    'profileData.banner_image'() { this.bannerFailed = false; },
  },
  async mounted() {
    document.addEventListener('click', this.handleOutsideCreate);
    await this.loadProfile();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideCreate);
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  },
  methods: {
    ...mapActions('auth', ['fetchUser']),
    ...mapActions('profile', ['fetchProfile', 'followUser', 'unfollowUser']),
    async loadProfile() {
      this.authChecked = false;
      if (!this.user) await this.fetchUser();
      this.authChecked = true;
      if (!this.user) return;
      await this.fetchProfile(this.targetId);
      await this.loadReadingHistory();
      if (!['created', 'liked', 'about'].includes(this.activeTab)) this.activeTab = 'created';
    },
    handleOutsideCreate(event) {
      if (this.createOpen && !this.$refs.createMenu?.contains(event.target)) this.createOpen = false;
    },
    openEdit() { if (this.isOwn) this.editOpen = true; },
    async handleProfileSaved() {
      this.editOpen = false;
      await this.fetchProfile(this.targetId);
      this.showToast('Профиль обновлён');
    },
    async toggleFollow() {
      if (this.followLoading || !this.profileData) return;
      try {
        if (this.isFollowing) await this.unfollowUser(this.profileData.id);
        else await this.followUser(this.profileData.id);
        await this.fetchProfile(this.profileData.id);
        this.showToast(this.isFollowing ? 'Вы подписались' : 'Вы отписались');
      } catch (error) {
        this.showToast('Не удалось изменить подписку');
      }
    },
    askDelete(type, item) {
      this.deleteTarget = { type, item };
    },
    async confirmDelete() {
      if (!this.deleteTarget || this.deleting) return;
      this.deleting = true;
      const { type, item } = this.deleteTarget;
      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/v1/${type}/${item.id}`, { headers: this.authHeaders() });
        this.deleteTarget = null;
        await this.fetchProfile(this.targetId);
        this.showToast(type === 'posts' ? 'Пост удалён' : 'Книга удалена');
      } catch (error) {
        this.showToast(error.response?.data?.message || 'Не удалось удалить запись');
      } finally {
        this.deleting = false;
      }
    },
    authHeaders() {
      return { Authorization: `Bearer ${Cookies.get('auth_token') || ''}`, Accept: 'application/json' };
    },
    shareProfile() {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: `${this.profileData?.name || 'Читатель'} — Libraria`, url }).catch(() => {});
        return;
      }
      navigator.clipboard?.writeText(url).then(() => this.showToast('Ссылка на профиль скопирована')).catch(() => this.showToast('Не удалось скопировать ссылку'));
    },
    showToast(message) {
      this.toastMessage = message;
      if (this.toastTimer) window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => { this.toastMessage = ''; }, 2600);
    },
    cleanHandle(value) { return String(value || '').replace(/^@/, '').trim(); },
    initialsOf(name) {
      return String(name || 'L').trim().split(/\s+/).slice(0, 2).map((part) => part.slice(0, 1).toUpperCase()).join('');
    },
    initialOf(title) { return String(title || 'L').trim().slice(0, 1).toUpperCase(); },
    postLink(post) { return { name: 'Post', params: { id: post.id } }; },
    bookLink(book) { return { name: 'Book', params: { id: book.id } }; },
    async loadReadingHistory() {
      this.readingLoading = true;

      try {
        const keys = Object.keys(window.localStorage)
          .filter((key) => key.startsWith('libraria:last-chapter:'));

        const ids = keys
          .map((key) => Number(key.replace('libraria:last-chapter:', '')))
          .filter((id) => id && !this.createdBookIds.has(id))
          .reverse()
          .slice(0, 4);

        const books = await Promise.all(ids.map(async (id) => {
          try {
            const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/books/${id}`, {
              headers: { Accept: 'application/json', Authorization: `Bearer ${Cookies.get('auth_token') || ''}` },
            });
            const book = response.data?.data || response.data;
            const chapterId = window.localStorage.getItem(`libraria:last-chapter:${id}`);
            return { ...book, _chapterId: Number(chapterId) || null };
          } catch (e) {
            return null;
          }
        }));

        this.readingBooksData = books.filter(Boolean);
      } finally {
        this.readingLoading = false;
      }
    },
    chapterLabelFor(book) {
      const chapters = Array.isArray(book.chapters) ? book.chapters : [];
      const index = chapters.findIndex((chapter) => Number(chapter.id) === Number(book._chapterId));
      if (index < 0) return 'В библиотеке';
      return `Глава ${index + 1} / ${chapters.length}`;
    },
    readLinkFor(book) {
      try {
        const chapterId = window.localStorage.getItem(`libraria:last-chapter:${book.id}`);
        if (chapterId) return { name: 'Chapter', params: { bookId: book.id, chapterId } };
      } catch (e) { /* localStorage may be disabled */ }
      return this.bookLink(book);
    },
    progressFor(book) {
      const chapters = Array.isArray(book.chapters) ? book.chapters : [];
      const index = chapters.findIndex((chapter) => Number(chapter.id) === Number(book._chapterId));
      if (index < 0 || !chapters.length) return 0;
      return Math.max(5, Math.round(((index + 1) / chapters.length) * 100));
    },
    postGradient(post) { return { background: CARD_GRADIENTS[Math.abs(Number(post.id) || 0) % CARD_GRADIENTS.length] }; },
    bookGradient(book) { return { background: CARD_GRADIENTS[Math.abs(Number(book.id) || 0) % CARD_GRADIENTS.length] }; },
    postTags(post) {
      if (Array.isArray(post.tags) && post.tags.length) return post.tags;
      if (Array.isArray(post.categories)) return post.categories;
      return [];
    },
    firstTag(post) { return this.postTags(post)[0]?.name || ''; },
    stripHtml(html) {
      if (!html) return '';
      if (typeof DOMParser === 'undefined') return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      return (new DOMParser().parseFromString(String(html), 'text/html').body.textContent || '').replace(/\s+/g, ' ').trim();
    },
    excerpt(html, maxLength) {
      const text = this.stripHtml(html);
      return text.length <= maxLength ? text : `${text.slice(0, maxLength).trim()}…`;
    },
    readingTime(html) {
      const words = this.stripHtml(html).split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 180));
    },
    formatDate(value, options = { day: 'numeric', month: 'short' }) {
      if (!value) return '';
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ru-RU', options);
    },
    plural(value, forms) {
      const n = Math.abs(Number(value) || 0);
      const n10 = n % 10;
      const n100 = n % 100;
      if (n10 === 1 && n100 !== 11) return forms[0];
      if ([2, 3, 4].includes(n10) && ![12, 13, 14].includes(n100)) return forms[1];
      return forms[2];
    },
  },
};
</script>

<style scoped>
.pf-page { min-height: 100vh; padding: 40px 0 80px; background: var(--paper); }
.pf-shell { width: 100%; max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-padding); }
.pf-kicker { color: var(--text-muted); font-family: var(--font-sans); font-size: 9px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
.pf-state { display: flex; min-height: 60vh; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; }
.pf-state h1 { margin: 0; font-family: var(--font-display); font-size: 40px; }
.pf-state p { max-width: 500px; margin: 0; color: var(--text-secondary); }
.pf-state__actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.pf-state--loading { color: var(--text-secondary); }
.pf-spinner { width: 26px; height: 26px; border: 2px solid var(--line); border-top-color: var(--accent); border-radius: 50%; animation: pspin .7s linear infinite; }
@keyframes pspin { to { transform: rotate(360deg); } }

/* Hero exactly like the profile mockup */
.pf-hero-card { position: relative; z-index: 10; overflow: visible; margin-bottom: 48px; padding: 48px; color: #f6f1e7; background: var(--accent); border-radius: 32px; box-shadow: var(--shadow-sm); }
.pf-hero-card__decor { position: absolute; inset: 0; overflow: hidden; border-radius: 32px; pointer-events: none; }
.pf-hero-card__circle { position: absolute; top: -48px; right: -48px; width: 290px; height: 290px; background: rgba(246,241,231,.055); border-radius: 50%; }
.pf-hero-card__inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 32px; }
.pf-avatar-wrap { position: relative; flex-shrink: 0; }
.pf-avatar { display: flex; width: 160px; height: 160px; align-items: center; justify-content: center; overflow: hidden; color: var(--accent); background: #efe7d9; border: 4px solid rgba(246,241,231,.25); border-radius: 50%; font-family: var(--font-display); font-size: 42px; }
.pf-avatar img { width: 100%; height: 100%; object-fit: cover; }
.pf-avatar-edit { position: absolute; right: 3px; bottom: 5px; display: flex; width: 40px; height: 40px; align-items: center; justify-content: center; color: var(--ink); background: var(--gold, #d7b36a); border: 2px solid var(--accent); border-radius: 50%; cursor: pointer; }
.pf-identity { flex: 1; min-width: 0; }
.pf-identity h1 { margin: 0; color: #fff; font-family: var(--font-display); font-size: 48px; font-weight: 700; letter-spacing: -.035em; line-height: 1; }
.pf-identity > p { margin: 10px 0 0; color: rgba(246,241,231,.7); font-size: 16px; line-height: 1.4; }
.pf-identity__city { display: inline-flex; align-items: center; gap: 5px; }
.pf-identity__city .icon-pin { font-size: 12px; }
.pf-hero-stats { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px; }
.pf-hero-stat { display: flex; flex-direction: column; gap: 1px; }
.pf-hero-stat b { color: #fff; font-family: var(--font-display); font-size: 24px; line-height: 1; }
.pf-hero-stat span { color: rgba(246,241,231,.58); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; }
.pf-hero-actions { display: flex; flex-direction: column; align-items: stretch; gap: 12px; flex-shrink: 0; min-width: 220px; }
.pf-btn { display: inline-flex; height: 44px; align-items: center; justify-content: center; gap: 7px; padding: 0 24px; border: 1px solid transparent; border-radius: 999px; font-family: var(--font-sans); font-size: 14px; font-weight: 600; text-decoration: none; cursor: pointer; transition: .2s ease; }
.pf-btn:disabled { opacity: .6; cursor: wait; }
.pf-btn--primary { color: #fff; background: var(--accent); border-color: var(--accent); }
.pf-btn--ghost { color: var(--text-secondary); background: transparent; border-color: var(--line); }
.pf-btn--light, .pf-btn--paper { color: var(--ink); background: var(--paper); border-color: var(--paper); }
.pf-btn--light:hover, .pf-btn--paper:hover { background: #fff; }
.pf-btn--outline-light, .pf-btn--outline-paper { color: #fff; background: transparent; border-color: rgba(246,241,231,.35); }
.pf-btn--outline-light:hover, .pf-btn--outline-paper:hover { background: rgba(246,241,231,.1); }
.pf-btn--danger { color: #fff; background: var(--danger); border-color: var(--danger); }
.pf-share { align-self: center; display: flex; width: 34px; height: 34px; align-items: center; justify-content: center; color: rgba(246,241,231,.75); background: transparent; border: 1px solid rgba(246,241,231,.25); border-radius: 50%; cursor: pointer; }
.pf-share:hover { color: #fff; background: rgba(246,241,231,.1); }
.pf-create { position: relative; z-index: 30; }
.pf-create__menu { position: absolute; top: calc(100% + 8px); right: 0; z-index: 100; width: 218px; padding: 6px; background: var(--cream); border: 1px solid var(--line); border-radius: 12px; box-shadow: var(--shadow-lg); }
.pf-create__menu a { display: flex; align-items: center; gap: 10px; padding: 10px; color: var(--ink); border-radius: 8px; text-decoration: none; }
.pf-create__menu a:hover { background: var(--accent-light); }
.pf-create__menu a > span:first-child { color: var(--accent); }
.pf-create__menu a > span:last-child { display: flex; flex-direction: column; }
.pf-create__menu b { font-size: 12px; }
.pf-create__menu small { color: var(--text-muted); font-size: 10px; }

/* Two-column content */
.pf-columns { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 40px; align-items: start; }
.pf-left, .pf-right { display: flex; min-width: 0; flex-direction: column; gap: 48px; }
.pf-block { min-width: 0; }
.pf-block__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.pf-block__head h2 { margin: 0; color: var(--ink); font-family: var(--font-display); font-size: 24px; line-height: 1.3; font-weight: 600; letter-spacing: -.025em; }
.pf-block__head h3 { margin: 0; color: var(--ink); font-family: var(--font-sans); font-size: 11px; font-weight: 700; letter-spacing: .11em; text-transform: uppercase; }
.pf-block__link { display: inline-flex; align-items: center; gap: 4px; padding: 0; color: var(--accent); background: none; border: 0; font-family: var(--font-sans); font-size: 14px; font-weight: 600; text-decoration: none; cursor: pointer; }
.pf-block__link:hover { text-decoration: underline; }
.pf-block__count { color: var(--text-muted); font-size: 11px; }

.pf-reading-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.pf-reading-card { display: flex; min-width: 0; gap: 16px; padding: 16px; background: var(--cream); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--shadow-sm); }
.pf-reading-cover { display: flex; width: 80px; height: 128px; flex-shrink: 0; align-items: center; justify-content: center; overflow: hidden; color: rgba(255,255,255,.7); border-radius: 5px 8px 8px 5px; font-family: var(--font-display); font-size: 30px; text-decoration: none; box-shadow: 0 10px 20px rgba(30,33,36,.16); }
.pf-reading-cover img { width: 100%; height: 100%; object-fit: cover; }
.pf-reading-body { display: flex; min-width: 0; flex: 1; flex-direction: column; justify-content: space-between; padding: 2px 0; }
.pf-reading-body h3 { display: -webkit-box; overflow: hidden; margin: 0; color: var(--ink); font-family: var(--font-display); font-size: 18px; line-height: 1.16; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.pf-reading-body h3 a { color: inherit; text-decoration: none; }
.pf-reading-body p { margin: 5px 0 0; color: var(--text-muted); font-size: 12px; }
.pf-reading-progress { display: flex; flex-direction: column; gap: 6px; }
.pf-progress { display: block; height: 6px; overflow: hidden; background: var(--line); border-radius: 99px; }
.pf-progress i { display: block; height: 100%; background: var(--accent); border-radius: inherit; }
.pf-reading-continue { display: inline-flex; align-items: center; gap: 4px; color: var(--accent); font-size: 12px; font-weight: 700; letter-spacing: .05em; text-decoration: none; text-transform: uppercase; }
.pf-reading-continue:hover { color: var(--accent-hover); }

.pf-post-list { display: flex; flex-direction: column; gap: 9px; }
.pf-post-row { display: grid; grid-template-columns: 105px minmax(0, 1fr); gap: 16px; padding: 16px; background: var(--cream); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--shadow-sm); }
.pf-post-row__cover { display: flex; min-height: 118px; align-items: center; justify-content: center; overflow: hidden; color: rgba(255,255,255,.6); border-radius: 8px; font-family: var(--font-display); font-size: 40px; }
.pf-post-row__cover img { width: 100%; height: 100%; object-fit: cover; }
.pf-post-row__body { min-width: 0; padding: 4px 2px; }
.pf-post-row__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: var(--text-muted); font-size: 12px; }
.pf-tag { padding: 3px 8px; color: var(--accent); background: var(--accent-light); border-radius: 999px; font-size: 12px; font-weight: 600; }
.pf-post-row h3 { margin: 8px 0 6px; font-family: var(--font-display); font-size: 20px; line-height: 1.15; }
.pf-post-row h3 a { color: var(--ink); text-decoration: none; }
.pf-post-row h3 a:hover { color: var(--accent); }
.pf-post-row p { display: -webkit-box; overflow: hidden; margin: 0; color: var(--text-secondary); font-size: 14px; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.pf-post-row__footer { display: flex; align-items: center; gap: 13px; margin-top: 16px; color: var(--text-muted); font-size: 12px; }
.pf-post-row__footer > span { display: inline-flex; align-items: center; gap: 4px; }
.pf-post-row__actions { margin-left: auto; gap: 4px !important; }
.pf-icon-btn { display: inline-flex; width: 27px; height: 27px; align-items: center; justify-content: center; padding: 0; color: var(--text-secondary); background: transparent; border: 1px solid var(--line); border-radius: 6px; font-size: 10px; cursor: pointer; }
.pf-icon-btn:hover { color: var(--accent); border-color: var(--accent); background: var(--accent-light); }
.pf-icon-btn--danger:hover { color: var(--danger); border-color: var(--danger); background: #fbeeec; }

.pf-liked-posts { display: flex; flex-direction: column; gap: 7px; margin-bottom: 13px; }
.pf-liked-post { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; padding: 11px 0; border-bottom: 1px solid var(--line); }
.pf-liked-post__title { color: var(--ink); font-family: var(--font-display); font-size: 16px; text-decoration: none; }
.pf-liked-post__title:hover { color: var(--accent); }
.pf-liked-post > span { color: var(--text-muted); font-size: 9px; white-space: nowrap; }
.pf-book-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.pf-book-card { min-width: 0; }
.pf-book-card__cover { display: flex; height: 160px; align-items: center; justify-content: center; overflow: hidden; color: rgba(255,255,255,.65); border-radius: 8px; font-family: var(--font-display); font-size: 42px; text-decoration: none; }
.pf-book-card__cover img { width: 100%; height: 100%; object-fit: cover; }
.pf-book-card h3 { overflow: hidden; margin: 8px 0 0; font-family: var(--font-display); font-size: 14px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.pf-book-card h3 a { color: var(--ink); text-decoration: none; }
.pf-about > p { max-width: 650px; margin: 0; color: var(--text-secondary); font-size: 12px; line-height: 1.7; }
.pf-socials { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
.pf-socials a { display: inline-flex; align-items: center; gap: 5px; padding: 5px 9px; color: var(--accent); background: var(--accent-light); border-radius: 999px; font-size: 9px; font-weight: 600; text-decoration: none; }
.pf-muted { margin: 0; color: var(--text-muted); font-size: 11px; }

.pf-activity-card { padding: 32px; background: var(--cream); border: 1px solid var(--line); border-radius: 28px; box-shadow: var(--shadow-sm); }
.pf-activity-card h3 { margin: 0 0 24px; color: var(--text-muted); font-family: var(--font-sans); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.pf-activity-main { display: flex; align-items: center; gap: 18px; }
.pf-activity-icon { display: flex; width: 64px; height: 64px; align-items: center; justify-content: center; color: var(--gold, #a8843f); background: rgba(168,132,63,.12); border-radius: 50%; font-size: 23px; }
.pf-activity-main b { color: var(--ink); font-family: var(--font-display); font-size: 30px; line-height: 1; }
.pf-activity-main p { margin: 4px 0 0; color: var(--text-muted); font-size: 14px; }
.pf-activity-weeks { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin-top: 24px; }
.pf-activity-weeks i { height: 32px; background: rgba(54,81,63,.1); border-radius: 4px; }
.pf-activity-weeks i.is-1 { background: rgba(54,81,63,.22); }
.pf-activity-weeks i.is-2 { background: rgba(54,81,63,.42); }
.pf-activity-weeks i.is-3 { background: rgba(54,81,63,.65); }
.pf-activity-weeks i.is-4 { background: var(--accent); }
.pf-activity-quote { margin: 16px 0 0; color: var(--text-muted); font-family: var(--font-serif); font-size: 11px; font-style: italic; line-height: 1.55; text-align: center; }
.pf-following-card { padding: 0; }
.pf-following-card .pf-block__head { margin-bottom: 16px; }
.pf-following-card .pf-block__head > span { color: var(--text-muted); font-size: 12px; }
.pf-people { display: flex; flex-direction: column; gap: 0; }
.pf-person { display: flex; align-items: center; gap: 12px; padding: 10px 0; color: var(--ink); border-bottom: 1px solid var(--line); text-decoration: none; }
.pf-person:last-child { border-bottom: 0; }
.pf-person:hover .pf-person__link { color: var(--accent-hover); }
.pf-person__avatar { display: flex; width: 36px; height: 36px; flex-shrink: 0; align-items: center; justify-content: center; overflow: hidden; color: #fff; background: var(--accent); border-radius: 50%; font-family: var(--font-display); font-size: 13px; }
.pf-person__avatar img { width: 100%; height: 100%; object-fit: cover; }
.pf-person > span:nth-child(2) { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 2px; }
.pf-person b { overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
.pf-person small { color: var(--text-muted); font-size: 12px; }
.pf-person__link { color: var(--accent); font-size: 12px; font-weight: 600; }
.pf-following-all { display: block; width: 100%; margin-top: 12px; padding: 12px 0 0; color: var(--text-muted); background: transparent; border: 0; border-top: 1px solid var(--line); font-size: 12px; font-weight: 700; letter-spacing: .06em; text-align: center; text-decoration: none; text-transform: uppercase; cursor: pointer; }
.pf-following-all:hover { color: var(--ink); }

.pf-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 28px 20px; color: var(--text-muted); background: var(--cream); border: 1px dashed var(--line-strong); border-radius: 14px; text-align: center; }
.pf-empty > span:first-child { color: var(--accent); font-size: 22px; }
.pf-empty h3 { margin: 0; color: var(--ink); font-size: 18px; }
.pf-empty p { margin: 0; font-size: 10px; }
.pf-empty .pf-btn { margin-top: 6px; }

.pf-confirm { position: fixed; inset: 0; z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(30,33,36,.42); backdrop-filter: blur(4px); }
.pf-confirm__card { width: min(390px, 100%); padding: 25px; background: var(--cream); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--shadow-xl); text-align: center; }
.pf-confirm__icon { display: flex; width: 40px; height: 40px; margin: 0 auto 12px; align-items: center; justify-content: center; color: var(--danger); background: #fbeeec; border-radius: 50%; }
.pf-confirm h2 { margin: 5px 0 8px; font-family: var(--font-display); font-size: 25px; }
.pf-confirm p { margin: 0 0 18px; color: var(--text-secondary); font-size: 12px; line-height: 1.6; }
.pf-confirm__actions { display: flex; justify-content: center; gap: 8px; }
.pf-toast { position: fixed; right: 20px; bottom: 20px; z-index: 3100; padding: 11px 16px; color: #fff; background: var(--accent); border-radius: 8px; box-shadow: var(--shadow-lg); font-size: 12px; }
.pf-fade-enter-active, .pf-fade-leave-active { transition: opacity .18s ease, transform .18s ease; }
.pf-fade-enter-from, .pf-fade-leave-to { opacity: 0; transform: translateY(5px); }

.pf-extra { margin-top: 48px; }
.pf-extra__grid { display: grid; grid-template-columns: minmax(0, 2.1fr) minmax(270px, 1fr); gap: 40px; }
.pf-extra .pf-book-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
@media (max-width: 1080px) {
  .pf-shell { width: 100%; max-width: 900px; padding: 0 20px; }
  .pf-hero-card { padding: 32px; }
  .pf-hero-card__inner { gap: 24px; }
  .pf-avatar { width: 112px; height: 112px; font-size: 32px; }
  .pf-hero-actions { min-width: 180px; }
  .pf-columns { grid-template-columns: 1fr; gap: 38px; }
  .pf-right { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
}
@media (max-width: 720px) {
  .pf-page { padding: 18px 0 44px; }
  .pf-shell { width: 100%; padding: 0 18px; }
  .pf-hero-card { padding: 24px 20px; border-radius: 24px; margin-bottom: 30px; }
  .pf-hero-card__inner { flex-wrap: wrap; gap: 16px; }
  .pf-avatar { width: 84px; height: 84px; font-size: 25px; }
  .pf-identity { flex: 1 1 calc(100% - 110px); }
  .pf-identity h1 { font-size: 34px; }
  .pf-identity > p { font-size: 11px; }
  .pf-hero-stats { gap: 18px; margin-top: 16px; }
  .pf-hero-stat b { font-size: 20px; }
  .pf-hero-stat span { font-size: 8px; }
  .pf-hero-actions { width: 100%; min-width: 0; flex-direction: row; flex-wrap: wrap; }
  .pf-hero-actions .pf-btn { flex: 1; }
  .pf-share { flex: 0 0 34px; }
  .pf-right, .pf-extra__grid { grid-template-columns: 1fr; }
  .pf-block__head h2 { font-size: 24px; }
  .pf-reading-grid { grid-template-columns: 1fr; }
  .pf-post-row { grid-template-columns: 82px minmax(0, 1fr); gap: 10px; padding: 9px; }
  .pf-post-row__cover { min-height: 100px; font-size: 30px; }
  .pf-post-row h3 { font-size: 16px; }
  .pf-post-row p { -webkit-line-clamp: 2; }
  .pf-book-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pf-book-card__cover { height: 180px; }
  .pf-liked-post { flex-direction: column; gap: 4px; }
}
</style>