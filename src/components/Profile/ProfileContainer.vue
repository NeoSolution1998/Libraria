<template>
  <div class="pp-page">
    <!-- Loading -->
    <div v-if="(!authChecked || profileLoading) && !profileData && !error" class="container-wide pp-state-wrap">
      <div class="pp-skeleton">
        <div class="pp-skeleton__cover"></div>
        <div class="pp-skeleton__card">
          <span class="pp-skeleton__avatar"></span>
          <div class="pp-skeleton__lines">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div class="pp-skeleton__grid">
          <span v-for="item in 4" :key="item"></span>
        </div>
      </div>
    </div>

    <!-- Error / auth required -->
    <div v-else-if="error" class="container-wide pp-state-wrap">
      <div class="pp-state">
        <span class="pp-state__icon" :class="error === 'auth' ? 'icon-lock' : 'icon-attention-alt'" aria-hidden="true"></span>
        <span class="pp-state__kicker">ПРОФИЛЬ</span>
        <h1>{{ errorTitle }}</h1>
        <p>{{ errorText }}</p>
        <div class="pp-state__actions">
          <router-link
            v-if="error === 'auth'"
            :to="{ name: 'Login', query: { redirect: $route.fullPath } }"
            class="pp-btn pp-btn--primary"
          >
            Войти в библиотеку
          </router-link>
          <button v-else type="button" class="pp-btn pp-btn--primary" @click="loadProfile">
            Повторить
          </button>
          <router-link :to="{ name: 'Books' }" class="pp-btn pp-btn--ghost">
            К книгам
          </router-link>
        </div>
      </div>
    </div>

    <!-- Profile -->
    <template v-else-if="profileData">
      <section class="pp-cover">
        <img
          v-if="hasBanner"
          :src="profileData.banner_image"
          :alt="profileData.name"
          class="pp-cover__image"
          @error="bannerFailed = true"
        />
        <div v-else class="pp-cover__art" :style="coverStyle">
          <span class="pp-cover__initial" aria-hidden="true">{{ initials }}</span>
          <span class="pp-cover__quote" aria-hidden="true">“</span>
          <span class="pp-cover__art-word">Libraria</span>
        </div>
        <div class="pp-cover__shade" aria-hidden="true"></div>

        <div class="container-wide pp-cover__inner">
          <div class="pp-cover__top">
            <span class="pp-cover__kicker">LIBRARIA · ПРОФИЛЬ ЧИТАТЕЛЯ</span>
            <span v-if="isOwn" class="pp-cover__tag">это ваш профиль</span>
          </div>

          <div class="pp-cover__bottom">
            <button v-if="isOwn" type="button" class="pp-cover__edit" @click="openEdit">
              <span class="icon-camera" aria-hidden="true"></span>
              Изменить обложку
            </button>
          </div>
        </div>
      </section>

      <div class="container-wide pp-shell">
        <header class="pp-identity">
          <div class="pp-avatar-wrap">
            <div class="pp-avatar">
              <img
                v-if="profileData.avatar && !avatarFailed"
                :src="profileData.avatar"
                :alt="profileData.name"
                @error="avatarFailed = true"
              />
              <span v-else>{{ initials }}</span>
            </div>
            <button v-if="isOwn" type="button" class="pp-avatar__edit" aria-label="Редактировать профиль" @click="openEdit">
              <span class="icon-pencil" aria-hidden="true"></span>
            </button>
          </div>

          <div class="pp-identity__main">
            <div class="pp-identity__badges">
              <span class="pp-role">{{ roleLabel }}</span>
              <span class="pp-identity__since">
                участник с {{ joinedYear }}
              </span>
            </div>

            <h1 class="pp-name">{{ profileData.name }}</h1>

            <p class="pp-handle">
              @{{ handle }}
              <template v-if="profileData.city">
                <span aria-hidden="true">·</span>
                <span class="icon-pin" aria-hidden="true"></span>
                {{ profileData.city }}
              </template>
            </p>

            <p class="pp-bio">
              {{ profileData.about || 'Читатель Libraria. Здесь появятся книги, заметки и всё, что хочется обсудить.' }}
            </p>

            <div class="pp-actions">
              <button v-if="isOwn" type="button" class="pp-btn pp-btn--primary" @click="openEdit">
                <span class="icon-pencil" aria-hidden="true"></span>
                Редактировать профиль
              </button>

              <button
                v-else
                type="button"
                class="pp-btn"
                :class="isFollowing ? 'pp-btn--subtle' : 'pp-btn--primary'"
                :disabled="followLoading"
                @click="toggleFollow"
              >
                <span :class="isFollowing ? 'icon-ok' : 'icon-user-plus'" aria-hidden="true"></span>
                {{ isFollowing ? 'Вы подписаны' : 'Подписаться' }}
              </button>

              <button type="button" class="pp-btn pp-btn--ghost" @click="shareProfile">
                <span class="icon-share" aria-hidden="true"></span>
                Поделиться
              </button>
            </div>
          </div>

          <div class="pp-stats">
            <button type="button" class="pp-stat" @click="activeTab = 'posts'">
              <b>{{ stats.posts }}</b>
              <span>публикаций</span>
            </button>
            <button type="button" class="pp-stat" @click="activeTab = 'books'">
              <b>{{ stats.books }}</b>
              <span>книг</span>
            </button>
            <button type="button" class="pp-stat" @click="activeTab = 'liked'">
              <b>{{ stats.likes }}</b>
              <span>понравилось</span>
            </button>
            <div class="pp-stat">
              <b>{{ stats.followers }}</b>
              <span>подписчиков</span>
            </div>
          </div>
        </header>

        <div class="pp-layout">
          <main class="pp-main">
            <nav class="pp-tabs" role="tablist" aria-label="Разделы профиля">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="pp-tab"
                :class="{ 'is-active': activeTab === tab.id }"
                role="tab"
                :aria-selected="activeTab === tab.id"
                @click="activeTab = tab.id"
              >
                <span class="icon" :class="tab.icon" aria-hidden="true"></span>
                {{ tab.label }}
                <span v-if="tab.count" class="pp-tab__count">{{ tab.count }}</span>
              </button>
            </nav>

            <section class="pp-panel">
              <!-- Posts / liked -->
              <template v-if="activeTab === 'posts' || activeTab === 'liked'">
                <div v-if="feedPosts.length" class="pp-posts">
                  <article v-for="post in feedPosts" :key="post.id" class="pp-post">
                    <router-link
                      :to="postLink(post)"
                      class="pp-post__cover"
                      :style="postGradient(post)"
                      :aria-label="`Читать: ${post.title}`"
                    >
                      <img v-if="post.image" :src="post.image" :alt="post.title" loading="lazy" />
                      <span v-else class="pp-post__initial" aria-hidden="true">{{ initialOf(post.title) }}</span>
                      <span v-if="firstTag(post)" class="pp-post__tag">{{ firstTag(post) }}</span>
                    </router-link>

                    <div class="pp-post__body">
                      <div class="pp-post__meta">
                        <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
                        <span aria-hidden="true">·</span>
                        <span>{{ readingTime(post.content) }} мин</span>
                        <template v-if="activeTab === 'liked' && post.user">
                          <span aria-hidden="true">·</span>
                          <span>{{ post.user.name }}</span>
                        </template>
                      </div>

                      <h3>
                        <router-link :to="postLink(post)">{{ post.title }}</router-link>
                      </h3>

                      <p>{{ excerpt(post.content, 150) }}</p>

                      <footer class="pp-post__footer">
                        <span><span class="icon-heart" aria-hidden="true"></span> {{ post.likes_count || 0 }}</span>
                        <span><span class="icon-chat" aria-hidden="true"></span> {{ post.comments_count || 0 }}</span>
                        <span><span class="icon-eye" aria-hidden="true"></span> {{ post.views_count || 0 }}</span>
                      </footer>
                    </div>
                  </article>
                </div>

                <div v-else class="pp-empty">
                  <span class="pp-empty__icon" :class="activeTab === 'liked' ? 'icon-heart' : 'icon-chat'" aria-hidden="true"></span>
                  <h3>{{ activeTab === 'liked' ? 'Пока ничего не понравилось' : 'Публикаций пока нет' }}</h3>
                  <p v-if="activeTab === 'liked'">
                    Посты, которым {{ isOwn ? 'вы поставили лайк' : 'пользователь поставил лайк' }}, появятся здесь.
                  </p>
                  <p v-else-if="isOwn">Расскажите о книге, которая вас зацепила — начните с небольшой заметки.</p>
                  <p v-else>Как только появятся новые материалы, они будут здесь.</p>
                  <router-link v-if="isOwn && activeTab === 'posts'" :to="{ name: 'PostCreate' }" class="pp-btn pp-btn--primary">
                    Написать пост
                  </router-link>
                </div>
              </template>

              <!-- Books -->
              <template v-else-if="activeTab === 'books'">
                <div v-if="profileData.books?.length" class="pp-books">
                  <article v-for="book in profileData.books" :key="book.id" class="pp-book">
                    <router-link :to="bookLink(book)" class="pp-book__cover" :style="bookGradient(book)">
                      <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" loading="lazy" />
                      <span v-else class="pp-book__initial" aria-hidden="true">{{ initialOf(book.title) }}</span>
                    </router-link>
                    <div class="pp-book__body">
                      <h3><router-link :to="bookLink(book)">{{ book.title }}</router-link></h3>
                      <p>{{ book.author || 'Автор не указан' }}</p>
                      <div v-if="book.categories?.length" class="pp-book__tags">
                        <span v-for="category in book.categories.slice(0, 2)" :key="category.id">
                          #{{ category.name }}
                        </span>
                      </div>
                    </div>
                  </article>
                </div>

                <div v-else class="pp-empty">
                  <span class="pp-empty__icon icon-folder-open" aria-hidden="true"></span>
                  <h3>Книг пока нет</h3>
                  <p v-if="isOwn">Добавьте первую книгу в библиотеку — она появится в профиле.</p>
                  <p v-else>Пользователь пока не добавил ни одной книги.</p>
                  <router-link v-if="isOwn" :to="{ name: 'BookCreate' }" class="pp-btn pp-btn--primary">
                    Добавить книгу
                  </router-link>
                </div>
              </template>

              <!-- About -->
              <template v-else>
                <div class="pp-about">
                  <section class="pp-about__bio">
                    <span class="pp-kicker">О СЕБЕ</span>
                    <h2>{{ profileData.name }}</h2>
                    <p>
                      {{ profileData.about || 'Профиль только начинает заполняться. Читатель ещё не рассказал о себе.' }}
                    </p>
                  </section>

                  <section class="pp-about__details">
                    <span class="pp-kicker">ДЕТАЛИ</span>
                    <ul>
                      <li v-for="detail in details" :key="detail.label">
                        <span>{{ detail.label }}</span>
                        <b>{{ detail.value }}</b>
                      </li>
                    </ul>
                  </section>

                  <section v-if="socialLinks.length" class="pp-about__social">
                    <span class="pp-kicker">ССЫЛКИ</span>
                    <div class="pp-social">
                      <a
                        v-for="link in socialLinks"
                        :key="link.label"
                        :href="link.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="pp-social__link"
                      >
                        <span class="pp-social__mark">{{ link.mark }}</span>
                        <span>
                          <b>{{ link.label }}</b>
                          <small>{{ link.value }}</small>
                        </span>
                        <span class="icon-right-open" aria-hidden="true"></span>
                      </a>
                    </div>
                  </section>

                  <section v-if="isOwn" class="pp-about__manage">
                    <div>
                      <span class="pp-kicker">АККАУНТ</span>
                      <p>Обновите имя, город, соцсети или фотографии профиля.</p>
                    </div>
                    <button type="button" class="pp-btn pp-btn--primary" @click="openEdit">
                      <span class="icon-pencil" aria-hidden="true"></span>
                      Настроить профиль
                    </button>
                  </section>
                </div>
              </template>
            </section>
          </main>

          <aside class="pp-aside">
            <section class="pp-side">
              <header class="pp-side__head">
                <div>
                  <span class="pp-kicker">СООБЩЕСТВО</span>
                  <h3>Подписчики</h3>
                </div>
                <span class="pp-side__count">{{ stats.followers }}</span>
              </header>

              <div v-if="profileData.followers?.length" class="pp-people">
                <router-link
                  v-for="person in profileData.followers.slice(0, 5)"
                  :key="person.id"
                  :to="{ name: 'Profile', params: { id: person.id } }"
                  class="pp-person"
                >
                  <span class="pp-person__avatar">
                    <img v-if="person.avatar" :src="person.avatar" :alt="person.name" />
                    <span v-else>{{ initialsOf(person.name) }}</span>
                  </span>
                  <span class="pp-person__info">
                    <b>{{ person.name }}</b>
                    <small>{{ person.city || 'читатель' }}</small>
                  </span>
                  <span class="icon-right-open pp-person__arrow" aria-hidden="true"></span>
                </router-link>
              </div>
              <p v-else class="pp-side__empty">
                {{ isOwn ? 'У вас пока нет подписчиков.' : 'Пока нет подписчиков.' }}
              </p>
            </section>

            <section class="pp-side">
              <header class="pp-side__head">
                <div>
                  <span class="pp-kicker">ИНТЕРЕСЫ</span>
                  <h3>Подписки</h3>
                </div>
                <span class="pp-side__count">{{ stats.following }}</span>
              </header>

              <div v-if="profileData.following?.length" class="pp-people">
                <router-link
                  v-for="person in profileData.following.slice(0, 5)"
                  :key="person.id"
                  :to="{ name: 'Profile', params: { id: person.id } }"
                  class="pp-person"
                >
                  <span class="pp-person__avatar">
                    <img v-if="person.avatar" :src="person.avatar" :alt="person.name" />
                    <span v-else>{{ initialsOf(person.name) }}</span>
                  </span>
                  <span class="pp-person__info">
                    <b>{{ person.name }}</b>
                    <small>{{ person.city || 'читатель' }}</small>
                  </span>
                  <span class="icon-right-open pp-person__arrow" aria-hidden="true"></span>
                </router-link>
              </div>
              <p v-else class="pp-side__empty">
                {{ isOwn ? 'Вы пока ни на кого не подписаны.' : 'Пока нет подписок.' }}
              </p>
            </section>

            <section class="pp-side pp-side--details">
              <header class="pp-side__head">
                <div>
                  <span class="pp-kicker">КОРОТКО</span>
                  <h3>О читателе</h3>
                </div>
              </header>

              <ul class="pp-mini-details">
                <li>
                  <span>Роль</span>
                  <b>{{ roleLabel }}</b>
                </li>
                <li v-if="profileData.city">
                  <span>Город</span>
                  <b>{{ profileData.city }}</b>
                </li>
                <li v-if="profileData.birth_date">
                  <span>День рождения</span>
                  <b>{{ formatDate(profileData.birth_date) }}</b>
                </li>
                <li>
                  <span>С нами с</span>
                  <b>{{ joinedDate }}</b>
                </li>
              </ul>

              <button v-if="isOwn" type="button" class="pp-side__edit" @click="openEdit">
                <span class="icon-pencil" aria-hidden="true"></span>
                Редактировать
              </button>
            </section>
          </aside>
        </div>
      </div>
    </template>

    <EditProfileModal
      v-if="profileData && isOwn"
      :visible="editOpen"
      :user="profileData"
      @update:visible="editOpen = $event"
      @saved="handleProfileSaved"
    />

    <transition name="pp-toast">
      <div v-if="toastMessage" class="pp-toast" role="status">
        <span class="icon-ok" aria-hidden="true"></span>
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import EditProfileModal from '@/components/Profile/UserProfile/ProfileSections/EditProfileModal.vue';

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #18201e 0%, #26332d 48%, #8f6d3d 115%)',
  'linear-gradient(135deg, #1d2229 0%, #2a3038 45%, #9b6c3a 120%)',
  'linear-gradient(135deg, #241f20 0%, #3a2d2d 48%, #b07b3f 120%)',
  'linear-gradient(135deg, #1b2528 0%, #26363a 45%, #6f8a7d 120%)',
  'linear-gradient(135deg, #26231d 0%, #33302a 45%, #c18a42 120%)',
];

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #20262b 0%, #3a3025 58%, #a97436 140%)',
  'linear-gradient(135deg, #1e2a28 0%, #2e3a31 55%, #8b7a4a 140%)',
  'linear-gradient(135deg, #2a2024 0%, #3b2b2b 55%, #b8793d 140%)',
  'linear-gradient(135deg, #242a35 0%, #1e242c 55%, #6f7d64 140%)',
  'linear-gradient(135deg, #302a20 0%, #1f2326 55%, #c18a42 140%)',
];

export default {
  name: 'ProfileContainer',
  components: {
    EditProfileModal,
  },
  data() {
    return {
      activeTab: 'posts',
      editOpen: false,
      authChecked: false,
      avatarFailed: false,
      bannerFailed: false,
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
      const routeId = this.$route.params.id;
      return routeId || this.user?.id || null;
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
      if (this.error === 'auth') {
        return 'Профили читателей доступны после входа. Войдите в аккаунт, и мы вернём вас на эту страницу.';
      }
      if (this.error === 'notfound') {
        return 'Возможно, пользователь удалил аккаунт или ссылка устарела.';
      }
      return 'Проверьте подключение к библиотеке и попробуйте ещё раз.';
    },

    initials() {
      return this.initialsOf(this.profileData?.name);
    },
    handle() {
      return String(this.profileData?.name || 'reader')
        .toLocaleLowerCase('ru-RU')
        .replace(/\s+/g, '_');
    },
    roleLabel() {
      const roles = this.profileData?.roles || [];
      if (roles.includes('admin')) return 'Администратор';
      if (roles.includes('author')) return 'Автор';
      if (roles.includes('reader')) return 'Читатель';
      return 'Читатель';
    },
    joinedYear() {
      if (!this.profileData?.created_at) return '';
      return new Date(this.profileData.created_at).getFullYear();
    },
    joinedDate() {
      if (!this.profileData?.created_at) return '';
      return this.formatDate(this.profileData.created_at, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
    hasBanner() {
      return Boolean(this.profileData?.banner_image) && !this.bannerFailed;
    },
    coverStyle() {
      const index = Math.abs(Number(this.profileData?.id) || 0) % COVER_GRADIENTS.length;
      return { background: COVER_GRADIENTS[index] };
    },
    stats() {
      return {
        posts: Number(this.profileData?.posts_count) || 0,
        books: Number(this.profileData?.books_count) || 0,
        likes: Number(this.profileData?.liked_posts?.length) || 0,
        followers: Number(this.profileData?.followers_count) || 0,
        following: Number(this.profileData?.following_count) || 0,
      };
    },
    isFollowing() {
      return Boolean(this.profileData?.is_following);
    },
    tabs() {
      return [
        { id: 'posts', label: 'Публикации', icon: 'icon-chat', count: this.profileData?.posts?.length || 0 },
        { id: 'books', label: 'Книги', icon: 'icon-folder-open', count: this.profileData?.books?.length || 0 },
        { id: 'liked', label: 'Понравилось', icon: 'icon-heart', count: this.profileData?.liked_posts?.length || 0 },
        { id: 'about', label: 'Обо мне', icon: 'icon-user-circle-o', count: 0 },
      ];
    },
    feedPosts() {
      if (this.activeTab === 'posts') return this.profileData?.posts || [];
      if (this.activeTab === 'liked') return this.profileData?.liked_posts || [];
      return [];
    },
    details() {
      const rows = [];
      if (this.profileData?.birth_date) {
        rows.push({ label: 'Дата рождения', value: this.formatDate(this.profileData.birth_date) });
      }
      if (this.profileData?.city) {
        rows.push({ label: 'Город', value: this.profileData.city });
      }
      if (this.profileData?.telegram) {
        rows.push({ label: 'Telegram', value: `@${this.cleanHandle(this.profileData.telegram)}` });
      }
      if (this.profileData?.phone && this.isOwn) {
        rows.push({ label: 'Телефон', value: this.profileData.phone });
      }
      if (this.profileData?.created_at) {
        rows.push({ label: 'Регистрация', value: this.joinedDate });
      }
      return rows;
    },
    socialLinks() {
      const links = [];
      const data = this.profileData || {};

      if (data.telegram) {
        links.push({
          label: 'Telegram',
          mark: 'TG',
          value: `@${this.cleanHandle(data.telegram)}`,
          href: `https://t.me/${this.cleanHandle(data.telegram)}`,
        });
      }
      if (data.github) {
        links.push({
          label: 'GitHub',
          mark: 'GH',
          value: `@${this.cleanHandle(data.github)}`,
          href: `https://github.com/${this.cleanHandle(data.github)}`,
        });
      }
      if (data.vk) {
        links.push({
          label: 'VK',
          mark: 'VK',
          value: this.cleanHandle(data.vk),
          href: `https://vk.com/${this.cleanHandle(data.vk)}`,
        });
      }
      if (data.habr) {
        links.push({
          label: 'Habr',
          mark: 'H',
          value: `@${this.cleanHandle(data.habr)}`,
          href: `https://habr.com/ru/users/${this.cleanHandle(data.habr)}/`,
        });
      }

      return links;
    },
  },
  watch: {
    '$route.params.id'() {
      this.loadProfile();
    },
    'profileData.avatar'() {
      this.avatarFailed = false;
    },
    'profileData.banner_image'() {
      this.bannerFailed = false;
    },
  },
  async mounted() {
    await this.loadProfile();
  },
  beforeUnmount() {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  },
  methods: {
    ...mapActions('auth', ['fetchUser']),
    ...mapActions('profile', ['fetchProfile', 'followUser', 'unfollowUser']),

    async loadProfile() {
      this.authChecked = false;

      if (!this.user) {
        await this.fetchUser();
      }

      this.authChecked = true;

      if (!this.user) return;

      await this.fetchProfile(this.targetId);
      this.activeTab = 'posts';
    },

    openEdit() {
      if (this.isOwn) this.editOpen = true;
    },
    async handleProfileSaved() {
      this.editOpen = false;
      await this.fetchProfile(this.targetId);
      this.showToast('Профиль обновлён');
    },
    async toggleFollow() {
      if (!this.user) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }

      if (this.followLoading || !this.profileData) return;

      try {
        if (this.isFollowing) {
          await this.unfollowUser(this.profileData.id);
          this.showToast('Вы отписались');
        } else {
          await this.followUser(this.profileData.id);
          this.showToast('Вы подписались на читателя');
        }

        await this.fetchProfile(this.profileData.id);
      } catch (error) {
        console.error('Не удалось изменить подписку:', error);
        this.showToast('Не удалось изменить подписку');
      }
    },
    async shareProfile() {
      const url = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `${this.profileData?.name || 'Читатель'} — Libraria`,
            text: 'Профиль читателя в Libraria',
            url,
          });
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }

      try {
        await navigator.clipboard.writeText(url);
        this.showToast('Ссылка на профиль скопирована');
      } catch (error) {
        this.showToast('Не удалось скопировать ссылку');
      }
    },
    showToast(message) {
      this.toastMessage = message;
      if (this.toastTimer) window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.toastMessage = '';
      }, 2600);
    },
    cleanHandle(value) {
      return String(value || '').replace(/^@/, '').trim();
    },
    initialsOf(name) {
      return String(name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },
    initialOf(title) {
      return String(title || 'L').trim().slice(0, 1).toUpperCase();
    },
    postLink(post) {
      return { name: 'Post', params: { id: post.id } };
    },
    bookLink(book) {
      return { name: 'Book', params: { id: book.id } };
    },
    postGradient(post) {
      const index = Math.abs(Number(post.id) || 0) % CARD_GRADIENTS.length;
      return { background: CARD_GRADIENTS[index] };
    },
    bookGradient(book) {
      const index = Math.abs(Number(book.id) || 0) % CARD_GRADIENTS.length;
      return { background: CARD_GRADIENTS[index] };
    },
    postTags(post) {
      if (Array.isArray(post.tags) && post.tags.length) return post.tags;
      if (Array.isArray(post.categories)) return post.categories;
      return [];
    },
    firstTag(post) {
      return this.postTags(post)[0]?.name || '';
    },
    stripHtml(html) {
      if (!html) return '';
      if (typeof DOMParser === 'undefined') {
        return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      const doc = new DOMParser().parseFromString(String(html), 'text/html');
      return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    },
    excerpt(html, maxLength) {
      const text = this.stripHtml(html);
      if (text.length <= maxLength) return text;
      return `${text.slice(0, maxLength).trim()}…`;
    },
    readingTime(html) {
      const words = this.stripHtml(html).split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 180));
    },
    formatDate(value, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
      if (!value) return '';
      const date = new Date(`${value}`.length === 10 ? `${value}T00:00:00` : value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ru-RU', options);
    },
  },
};
</script>

<style scoped>
.pp-page {
  min-height: 100vh;
  padding-bottom: var(--space-16);
  background:
    radial-gradient(900px 340px at 90% 0%, rgba(231, 165, 74, 0.06), transparent 60%),
    var(--paper);
}

/* States */
.pp-state-wrap {
  padding-top: var(--space-10);
  padding-bottom: var(--space-16);
}

.pp-state {
  max-width: 560px;
  margin: var(--space-8) auto;
  padding: var(--space-10) var(--space-8);
  text-align: center;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
}

.pp-state__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: var(--space-4);
  color: #fff;
  background: var(--ink);
  border-radius: 50%;
  font-size: var(--text-xl);
}

.pp-state__kicker {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.pp-state h1 {
  margin: 0 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.pp-state p {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.pp-state__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

/* Skeleton */
.pp-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-4);
}

.pp-skeleton__cover {
  height: 230px;
  background: linear-gradient(90deg, #ebe6dc 25%, #f7f3ea 50%, #ebe6dc 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-2xl);
  animation: pp-shimmer 1.25s linear infinite;
}

.pp-skeleton__card {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-top: -48px;
  padding: var(--space-5);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
}

.pp-skeleton__avatar {
  width: 100px;
  height: 100px;
  margin-top: -48px;
  background: #ebe6dc;
  border: 5px solid var(--paper);
  border-radius: 50%;
}

.pp-skeleton__lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.pp-skeleton__lines span,
.pp-skeleton__grid span {
  display: block;
  height: 12px;
  background: linear-gradient(90deg, #ebe6dc 25%, #f7f3ea 50%, #ebe6dc 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: pp-shimmer 1.25s linear infinite;
}

.pp-skeleton__lines span:nth-child(1) { width: 24%; height: 9px; }
.pp-skeleton__lines span:nth-child(2) { width: 46%; height: 24px; }
.pp-skeleton__lines span:nth-child(3) { width: 70%; }

.pp-skeleton__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.pp-skeleton__grid span {
  height: 120px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
}

@keyframes pp-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Cover */
.pp-cover {
  position: relative;
  height: 260px;
  overflow: hidden;
  background: var(--ink);
}

.pp-cover__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pp-cover__art {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.pp-cover__art::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(420px 260px at 80% 10%, rgba(255, 255, 255, 0.13), transparent 70%),
    radial-gradient(300px 220px at 10% 90%, rgba(231, 165, 74, 0.22), transparent 70%);
}

.pp-cover__initial {
  position: absolute;
  top: 50%;
  right: 8%;
  color: rgba(255, 255, 255, 0.07);
  font-family: var(--font-display);
  font-size: clamp(160px, 20vw, 280px);
  font-weight: 700;
  line-height: 1;
  transform: translateY(-52%);
  letter-spacing: -0.08em;
}

.pp-cover__quote {
  position: absolute;
  bottom: -28px;
  left: 6%;
  color: rgba(231, 165, 74, 0.34);
  font-family: var(--font-serif);
  font-size: 200px;
  line-height: 0.7;
}

.pp-cover__art-word {
  position: absolute;
  top: var(--space-6);
  right: var(--space-8);
  color: rgba(246, 239, 226, 0.28);
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

.pp-cover__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(10, 12, 13, 0.18) 0%, rgba(10, 12, 13, 0.02) 42%, rgba(10, 12, 13, 0.62) 100%);
}

.pp-cover__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-top: var(--space-5);
  padding-bottom: 74px;
}

.pp-cover__top,
.pp-cover__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.pp-cover__bottom {
  justify-content: flex-end;
}

.pp-cover__kicker {
  color: rgba(245, 239, 227, 0.7);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.pp-cover__tag {
  padding: 5px 10px;
  color: #17191b;
  background: var(--accent);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
}

.pp-cover__edit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 var(--space-3);
  color: #f5efe3;
  background: rgba(15, 17, 18, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.pp-cover__edit:hover {
  border-color: var(--accent);
  background: rgba(15, 17, 18, 0.62);
}

.pp-cover__edit span {
  color: var(--accent);
  font-size: 10px;
}

/* Identity */
.pp-shell {
  position: relative;
  z-index: 3;
  margin-top: -54px;
}

.pp-identity {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-5);
  padding: 0 var(--space-6) var(--space-5);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: 0 20px 50px rgba(25, 27, 28, 0.1);
}

.pp-avatar-wrap {
  position: relative;
  align-self: start;
  margin-top: -56px;
}

.pp-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 132px;
  overflow: hidden;
  color: #17191b;
  background: linear-gradient(135deg, #f2ca8a, var(--accent));
  border: 5px solid #fff;
  border-radius: 50%;
  box-shadow: 0 14px 34px rgba(25, 27, 28, 0.2);
  font-family: var(--font-display);
  font-size: 38px;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.pp-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pp-avatar__edit {
  position: absolute;
  right: 2px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #17191b;
  background: var(--accent);
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: var(--shadow-md);
  font-size: 11px;
  cursor: pointer;
  transition: transform var(--transition-fast), background-color var(--transition-fast);
}

.pp-avatar__edit:hover {
  background: var(--accent-hover);
  transform: scale(1.06);
}

.pp-identity__main {
  min-width: 0;
  padding-top: var(--space-4);
}

.pp-identity__badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.pp-role {
  padding: 3px 9px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.12);
  border: 1px solid rgba(231, 165, 74, 0.28);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.pp-identity__since {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.pp-name {
  margin: 0 0 2px;
  overflow: hidden;
  overflow-wrap: anywhere;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(32px, 3.4vw, 46px);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.05;
  text-overflow: ellipsis;
}

.pp-handle {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0 0 var(--space-3);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.pp-handle span[aria-hidden] {
  color: var(--line-strong);
}

.pp-handle .icon-pin {
  color: #b08a55;
  font-size: 10px;
}

.pp-bio {
  display: -webkit-box;
  max-width: 560px;
  margin: 0 0 var(--space-4);
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.65;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.pp-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.pp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}

.pp-btn span {
  font-size: 10px;
}

.pp-btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.pp-btn--primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
}

.pp-btn--ghost {
  color: var(--text-secondary);
  background: transparent;
  border-color: var(--line);
}

.pp-btn--ghost:hover {
  color: var(--ink);
  border-color: var(--ink);
  background: var(--paper);
}

.pp-btn--subtle {
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.1);
  border-color: rgba(231, 165, 74, 0.34);
}

.pp-btn--subtle:hover {
  background: rgba(231, 165, 74, 0.16);
}

.pp-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.pp-stats {
  display: flex;
  align-items: stretch;
  align-self: stretch;
  border-left: 1px solid var(--line);
  padding-left: var(--space-4);
}

.pp-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 82px;
  padding: var(--space-2);
  background: transparent;
  border: 0;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.pp-stat:hover {
  background: var(--paper);
}

div.pp-stat {
  cursor: default;
}

.pp-stat b {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.pp-stat span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  letter-spacing: 0.04em;
  text-align: center;
  white-space: nowrap;
}

/* Content layout */
.pp-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 306px;
  align-items: start;
  gap: var(--space-5);
  margin-top: var(--space-5);
}

.pp-main {
  min-width: 0;
}

.pp-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.pp-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 var(--space-4);
  color: var(--text-muted);
  background: transparent;
  border: 0;
  border-radius: 9px;
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.pp-tab:hover {
  color: var(--ink);
  background: var(--paper);
}

.pp-tab.is-active {
  color: #17191b;
  background: var(--accent);
  font-weight: 600;
}

.pp-tab .icon {
  font-size: 10px;
}

.pp-tab__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  color: var(--text-muted);
  background: var(--paper);
  border-radius: 999px;
  font-size: 8.5px;
  font-weight: 700;
}

.pp-tab.is-active .pp-tab__count {
  color: #17191b;
  background: rgba(255, 255, 255, 0.55);
}

.pp-panel {
  margin-top: var(--space-3);
  padding: var(--space-5);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  min-height: 280px;
}

/* Posts */
.pp-posts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.pp-post {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.pp-post:hover {
  border-color: rgba(231, 165, 74, 0.5);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.pp-post:only-child {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: 260px minmax(0, 1fr);
}

.pp-post:only-child .pp-post__cover {
  height: 100%;
  min-height: 190px;
}

.pp-post__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 138px;
  overflow: hidden;
  color: #f6efe2;
  text-decoration: none;
}

.pp-post__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(10, 12, 13, 0.4));
}

.pp-post__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pp-post__initial {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.1);
  font-family: var(--font-display);
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
}

.pp-post__tag {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 2;
  max-width: calc(100% - 16px);
  padding: 3px 7px;
  overflow: hidden;
  color: #f6efe2;
  background: rgba(15, 17, 18, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pp-post__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-3) var(--space-4) var(--space-3);
}

.pp-post__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

.pp-post__body h3 {
  display: -webkit-box;
  margin: 0 0 5px;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pp-post__body h3 a {
  color: inherit;
  text-decoration: none;
}

.pp-post__body h3 a:hover {
  color: var(--accent-hover);
}

.pp-post__body > p {
  display: -webkit-box;
  margin: 0 0 var(--space-2);
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 9.5px;
  line-height: 1.55;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pp-post__footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
  padding-top: var(--space-2);
  border-top: 1px solid var(--line);
}

.pp-post__footer span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

/* Books */
.pp-books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: var(--space-4);
}

.pp-book {
  min-width: 0;
}

.pp-book__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4.2;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 24px rgba(25, 27, 28, 0.14);
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.pp-book:hover .pp-book__cover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(25, 27, 28, 0.2);
}

.pp-book__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pp-book__initial {
  font-family: var(--font-display);
  font-size: 68px;
  font-weight: 700;
  line-height: 1;
}

.pp-book__body {
  padding-top: var(--space-2);
}

.pp-book__body h3 {
  display: -webkit-box;
  margin: 0 0 2px;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pp-book__body h3 a {
  color: inherit;
  text-decoration: none;
}

.pp-book__body h3 a:hover {
  color: var(--accent-hover);
}

.pp-book__body > p {
  margin: 0 0 5px;
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pp-book__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.pp-book__tags span {
  padding: 2px 5px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.1);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 7.5px;
}

/* About */
.pp-about {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: var(--space-6);
  align-items: start;
}

.pp-about__bio h2 {
  margin: var(--space-2) 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.pp-about__bio p {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.75;
}

.pp-about__details ul {
  margin: var(--space-3) 0 0;
  padding: 0;
  list-style: none;
}

.pp-about__details li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}

.pp-about__details li:last-child {
  border-bottom: 0;
}

.pp-about__details li span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.pp-about__details li b {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 500;
  text-align: right;
}

.pp-about__social {
  grid-column: 1 / -1;
  margin-top: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.pp-social {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.pp-social__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 9px var(--space-3);
  color: var(--text-secondary);
  background: var(--paper);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.pp-social__link:hover {
  background: #fff;
  border-color: var(--accent);
}

.pp-social__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.14);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 8px;
  font-weight: 700;
}

.pp-social__link > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.pp-social__link b {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
}

.pp-social__link small {
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pp-social__link > span:last-child {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 8px;
}

.pp-about__manage {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--paper);
  border-radius: var(--radius-lg);
}

.pp-about__manage p {
  margin: 3px 0 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 10px;
}

.pp-kicker {
  display: block;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* Empty */
.pp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 250px;
  padding: var(--space-8) var(--space-5);
  text-align: center;
}

.pp-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: var(--space-1);
  color: var(--text-muted);
  background: var(--paper);
  border-radius: 50%;
  font-size: var(--text-lg);
}

.pp-empty h3 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
}

.pp-empty p {
  max-width: 380px;
  margin: 0 0 var(--space-2);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: 1.55;
}

/* Aside */
.pp-aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.pp-side {
  padding: var(--space-4);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.pp-side__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.pp-side__head h3 {
  margin: 2px 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
}

.pp-side__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.1);
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
}

.pp-people {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pp-person {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.pp-person:hover {
  background: var(--paper);
}

.pp-person__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  overflow: hidden;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.14);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
}

.pp-person__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pp-person__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.pp-person__info b {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pp-person__info small {
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pp-person__arrow {
  color: var(--line-strong);
  font-size: 8px;
}

.pp-side__empty {
  margin: 0;
  padding: var(--space-3) 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
  line-height: 1.5;
}

.pp-side--details {
  background:
    radial-gradient(220px 120px at 100% 0%, rgba(231, 165, 74, 0.08), transparent 70%),
    #fff;
}

.pp-mini-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pp-mini-details li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.pp-mini-details li b {
  color: var(--ink);
  font-weight: 500;
  text-align: right;
}

.pp-side__edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  height: 32px;
  margin-top: var(--space-3);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 500;
  cursor: pointer;
}

.pp-side__edit:hover {
  color: var(--ink);
  border-color: var(--accent);
}

/* Toast */
.pp-toast {
  position: fixed;
  bottom: max(var(--space-6), env(safe-area-inset-bottom));
  left: 50%;
  z-index: 2200;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  color: var(--text-on-dark);
  background: var(--ink);
  border-radius: 999px;
  box-shadow: var(--shadow-xl);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  transform: translateX(-50%);
}

.pp-toast span {
  color: var(--accent);
  font-size: 10px;
}

.pp-toast-enter-active,
.pp-toast-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.pp-toast-enter-from,
.pp-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

/* Responsive */
@media (max-width: 1100px) {
  .pp-identity {
    grid-template-columns: 116px minmax(0, 1fr);
  }

  .pp-avatar {
    width: 116px;
    height: 116px;
    font-size: 33px;
  }

  .pp-stats {
    grid-column: 1 / -1;
    justify-content: space-between;
    padding: var(--space-3) 0 0;
    border-left: 0;
    border-top: 1px solid var(--line);
  }
}

@media (max-width: 1024px) {
  .pp-layout {
    grid-template-columns: 1fr;
  }

  .pp-aside {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pp-side--details {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .pp-cover {
    height: 200px;
  }

  .pp-cover__initial {
    font-size: 170px;
  }

  .pp-cover__quote {
    font-size: 150px;
  }

  .pp-cover__bottom {
    display: none;
  }

  .pp-shell {
    margin-top: -42px;
  }

  .pp-identity {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: var(--space-4);
    padding: 0 var(--space-4) var(--space-4);
    border-radius: var(--radius-xl);
  }

  .pp-avatar-wrap {
    margin-top: -38px;
  }

  .pp-avatar {
    width: 84px;
    height: 84px;
    border-width: 4px;
    font-size: 24px;
  }

  .pp-avatar__edit {
    right: -2px;
    bottom: 2px;
    width: 28px;
    height: 28px;
    border-width: 2px;
    font-size: 9px;
  }

  .pp-identity__main {
    padding-top: var(--space-3);
  }

  .pp-name {
    font-size: 30px;
  }

  .pp-bio {
    -webkit-line-clamp: 3;
    font-size: 12px;
  }

  .pp-actions {
    grid-column: 1 / -1;
    flex-direction: column;
    align-items: stretch;
  }

  .pp-actions .pp-btn {
    width: 100%;
  }

  .pp-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    padding: var(--space-2) 0 0;
  }

  .pp-stat {
    min-width: 0;
    padding: 6px 2px;
  }

  .pp-stat b {
    font-size: var(--text-xl);
  }

  .pp-stat span {
    font-size: 7.5px;
    white-space: normal;
  }

  .pp-panel {
    padding: var(--space-3);
  }

  .pp-posts {
    grid-template-columns: 1fr;
  }

  .pp-post:only-child {
    display: flex;
    grid-column: auto;
  }

  .pp-post:only-child .pp-post__cover {
    height: 138px;
    min-height: 0;
  }

  .pp-about {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .pp-about__social,
  .pp-about__manage {
    grid-column: auto;
  }

  .pp-about__manage {
    flex-direction: column;
    align-items: flex-start;
  }

  .pp-aside {
    grid-template-columns: 1fr;
  }

  .pp-side--details {
    grid-column: auto;
  }

  .pp-tabs {
    gap: 2px;
  }

  .pp-tab {
    padding: 0 10px;
    font-size: 9.5px;
  }
}

@media (max-width: 440px) {
  .pp-cover {
    height: 170px;
  }

  .pp-cover__kicker {
    max-width: 180px;
    font-size: 8px;
    line-height: 1.4;
  }

  .pp-cover__edit {
    padding: 0 9px;
    font-size: 8px;
  }

  .pp-identity {
    grid-template-columns: 72px minmax(0, 1fr);
  }

  .pp-avatar {
    width: 72px;
    height: 72px;
    font-size: 20px;
  }

  .pp-name {
    font-size: 26px;
  }

  .pp-handle {
    font-size: 9px;
  }

  .pp-btn {
    height: 36px;
    padding: 0 10px;
    font-size: 9px;
  }

  .pp-tab {
    height: 34px;
    padding: 0 8px;
    font-size: 9px;
  }

  .pp-tab .icon {
    display: none;
  }

  .pp-tab__count {
    display: none;
  }
}
</style>
