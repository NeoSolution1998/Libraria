<template>
  <div class="posts-list">
    <!-- Featured post -->
    <article v-if="featuredPost" class="featured-post">
      <div class="featured-post__content">
        <div class="featured-post__top">
          <span class="featured-post__label">
            <i aria-hidden="true"></i>
            СВЕЖЕЕ В БЛОГЕ
          </span>
          <div v-if="postTags(featuredPost).length" class="featured-post__tags">
            <span
              v-for="tag in postTags(featuredPost).slice(0, 2)"
              :key="tag.id || tag.name"
              class="featured-post__tag"
            >
              #{{ tag.name }}
            </span>
          </div>
        </div>

        <h2 class="featured-post__title">
          <router-link :to="postLink(featuredPost)">{{ featuredPost.title }}</router-link>
        </h2>

        <p class="featured-post__excerpt">{{ excerpt(featuredPost.content, 260) }}</p>

        <div class="featured-post__footer">
          <div class="featured-post__author">
            <img
              class="featured-post__avatar"
              :src="avatar(featuredPost)"
              :alt="authorName(featuredPost)"
              loading="lazy"
            />
            <div class="featured-post__author-info">
              <span class="featured-post__author-name">{{ authorName(featuredPost) }}</span>
              <span class="featured-post__meta-line">
                {{ formatDate(featuredPost.created_at) }}
                <i aria-hidden="true"></i>
                {{ readingTime(featuredPost.content) }} мин чтения
              </span>
            </div>
          </div>

          <router-link :to="postLink(featuredPost)" class="featured-post__read">
            Читать
            <span class="icon-right-open" aria-hidden="true"></span>
          </router-link>
        </div>
      </div>

      <router-link
        :to="postLink(featuredPost)"
        class="featured-post__media"
        :style="coverStyle(featuredPost)"
        aria-label="Открыть пост"
      >
        <img
          v-if="featuredPost.image"
          :src="featuredPost.image"
          :alt="featuredPost.title"
          class="featured-post__image"
          loading="eager"
        />
        <template v-else>
          <span class="featured-post__quote" aria-hidden="true">“</span>
          <span class="featured-post__initial">{{ initial(featuredPost.title) }}</span>
          <span class="featured-post__media-caption">{{ firstTag(featuredPost) || 'Libraria' }}</span>
        </template>
        <span class="featured-post__media-glow" aria-hidden="true"></span>
      </router-link>
    </article>

    <!-- Post grid -->
    <div v-if="gridPosts.length" class="posts-grid">
      <article
        v-for="(post, index) in gridPosts"
        :key="post.id"
        class="post-card"
        :class="{
          'post-card--wide':
            index === gridPosts.length - 1 &&
            (gridPosts.length === 1 || gridPosts.length % 2 === 1)
        }"
      >
        <router-link
          :to="postLink(post)"
          class="post-card__cover"
          :style="coverStyle(post)"
          :aria-label="`Читать: ${post.title}`"
        >
          <img
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="post-card__cover-image"
            loading="lazy"
          />
          <template v-else>
            <span class="post-card__cover-quote" aria-hidden="true">“</span>
            <span class="post-card__cover-initial">{{ initial(post.title) }}</span>
          </template>
          <span v-if="firstTag(post)" class="post-card__cover-tag">{{ firstTag(post) }}</span>
        </router-link>

        <div class="post-card__body">
          <div class="post-card__meta">
            <time :datetime="formatDateTime(post.created_at)">{{ formatDate(post.created_at) }}</time>
            <i aria-hidden="true"></i>
            <span>{{ readingTime(post.content) }} мин</span>
          </div>

          <h3 class="post-card__title">
            <router-link :to="postLink(post)">{{ post.title }}</router-link>
          </h3>

          <p class="post-card__excerpt">{{ excerpt(post.content, 150) }}</p>

          <div v-if="postTags(post).length" class="post-card__tags">
            <span
              v-for="tag in postTags(post).slice(0, 2)"
              :key="tag.id || tag.name"
              class="post-card__tag"
            >
              #{{ tag.name }}
            </span>
          </div>

          <footer class="post-card__footer">
            <span class="post-card__author">
              <img
                class="post-card__avatar"
                :src="avatar(post)"
                :alt="authorName(post)"
                loading="lazy"
              />
              <span>{{ authorName(post) }}</span>
            </span>

            <div class="post-card__stats">
              <button
                type="button"
                class="post-card__stat"
                :class="{ 'is-liked': post.is_liked }"
                :aria-label="post.is_liked ? 'Убрать лайк' : 'Поставить лайк'"
                :aria-pressed="post.is_liked"
                @click.stop="handleLikeClick(post)"
              >
                <span :class="post.is_liked ? 'icon-heart' : 'icon-heart-empty'" aria-hidden="true"></span>
                <span>{{ post.likes_count || 0 }}</span>
              </button>

              <router-link
                :to="{ name: 'Post', params: { id: post.id }, hash: '#post-comments' }"
                class="post-card__stat"
                aria-label="Комментарии"
              >
                <span class="icon-chat" aria-hidden="true"></span>
                <span>{{ post.comments_count || 0 }}</span>
              </router-link>

              <span class="post-card__stat" aria-label="Просмотры">
                <span class="icon-eye" aria-hidden="true"></span>
                <span>{{ post.views_count || 0 }}</span>
              </span>
            </div>
          </footer>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

const ART_GRADIENTS = [
  'linear-gradient(135deg, #20262b 0%, #3a3025 58%, #a97436 140%)',
  'linear-gradient(135deg, #1e2a28 0%, #2e3a31 55%, #8b7a4a 140%)',
  'linear-gradient(135deg, #2a2024 0%, #3b2b2b 55%, #b8793d 140%)',
  'linear-gradient(135deg, #242a35 0%, #1e242c 55%, #6f7d64 140%)',
  'linear-gradient(135deg, #302a20 0%, #1f2326 55%, #c18a42 140%)',
];

export default {
  name: 'PostsListComponent',
  computed: {
    ...mapState('posts', ['posts', 'currentPage']),
    ...mapGetters('auth', ['user']),
    ...mapGetters('posts', ['hasActiveFilters', 'hasActiveSearch']),
    showFeatured() {
      return false;
    },
    featuredPost() {
      return this.showFeatured ? this.posts[0] : null;
    },
    gridPosts() {
      return this.showFeatured ? this.posts.slice(1) : this.posts;
    },
  },
  methods: {
    ...mapActions('posts', ['togglePostLike']),
    postLink(post) {
      return { name: 'Post', params: { id: post.id } };
    },
    postTags(post) {
      if (Array.isArray(post.tags) && post.tags.length) return post.tags;
      if (Array.isArray(post.categories) && post.categories.length) return post.categories;
      return [];
    },
    firstTag(post) {
      return this.postTags(post)[0]?.name || '';
    },
    authorName(post) {
      return post.user?.name || 'Неизвестный автор';
    },
    avatar(post) {
      return post.user?.avatar || '/images/user_default.jpg';
    },
    initial(title) {
      return String(title || 'L').trim().slice(0, 1).toUpperCase();
    },
    coverStyle(post) {
      const index = Math.abs(Number(post.id) || 0) % ART_GRADIENTS.length;
      return { background: ART_GRADIENTS[index] };
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
    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    },
    formatDateTime(value) {
      if (!value) return '';
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '' : date.toISOString();
    },
    async handleLikeClick(post) {
      if (!this.user) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }

      try {
        await this.togglePostLike(post.id);
      } catch (error) {
        console.error('Не удалось изменить лайк:', error);
      }
    },
  },
};
</script>

<style scoped>
.posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  min-width: 0;
}

/* ============================================================
   Featured post
   ============================================================ */
.featured-post {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.85fr);
  min-height: 340px;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base), border-color var(--transition-base), transform var(--transition-base);
}

.featured-post:hover {
  border-color: rgba(231, 165, 74, 0.55);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.featured-post__content {
  display: flex;
  flex-direction: column;
  padding: var(--space-6) var(--space-6) var(--space-5);
  min-width: 0;
}

.featured-post__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.featured-post__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: #9d6d33;
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.featured-post__label i {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.16);
}

.featured-post__tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.featured-post__tag {
  padding: 3px 7px;
  color: var(--text-secondary);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 9px;
}

.featured-post__title {
  margin: 0 0 var(--space-3);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(25px, 2.4vw, 34px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.12;
}

.featured-post__title a {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.featured-post__title a:hover {
  color: var(--accent-hover);
}

.featured-post__excerpt {
  display: -webkit-box;
  margin: 0 0 var(--space-5);
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.featured-post__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.featured-post__author {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.featured-post__avatar {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  object-fit: cover;
  background: var(--surface-hover);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
}

.featured-post__author-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.featured-post__author-name {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.featured-post__meta-line {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
  white-space: nowrap;
}

.featured-post__meta-line i {
  width: 2px;
  height: 2px;
  background: currentColor;
  border-radius: 50%;
}

.featured-post__read {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 2px;
  transition: color var(--transition-fast);
}

.featured-post__read:hover {
  color: var(--accent-hover);
}

.featured-post__read span {
  font-size: 9px;
}

.featured-post__media {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100%;
  overflow: hidden;
  color: #f6efe2;
  text-decoration: none;
}

.featured-post__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(10, 12, 13, 0.06) 0%, rgba(10, 12, 13, 0.55) 100%),
    radial-gradient(220px 180px at 80% 10%, rgba(255, 255, 255, 0.14), transparent 70%);
  pointer-events: none;
}

.featured-post__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.featured-post:hover .featured-post__image {
  transform: scale(1.03);
}

.featured-post__quote {
  position: relative;
  z-index: 1;
  display: block;
  margin: 0 auto;
  color: rgba(231, 165, 74, 0.9);
  font-family: var(--font-serif);
  font-size: 170px;
  line-height: 0.7;
  transform: translateY(18px);
  pointer-events: none;
}

.featured-post__initial {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  color: rgba(255, 255, 255, 0.08);
  font-family: var(--font-display);
  font-size: 220px;
  font-weight: 700;
  line-height: 1;
  transform: translate(-50%, -54%);
}

.featured-post__media-caption {
  position: relative;
  z-index: 1;
  padding: var(--space-4) var(--space-5);
  color: rgba(246, 239, 226, 0.7);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.featured-post__media-glow {
  position: absolute;
  right: -40px;
  bottom: -60px;
  z-index: 0;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(231, 165, 74, 0.35), transparent 68%);
  pointer-events: none;
}

/* ============================================================
   Post grid
   ============================================================ */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.post-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  transition: box-shadow var(--transition-base), border-color var(--transition-base), transform var(--transition-base);
}

.post-card:hover {
  border-color: rgba(231, 165, 74, 0.55);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.post-card__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 164px;
  overflow: hidden;
  color: #f6efe2;
  text-decoration: none;
}

.post-card__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(10, 12, 13, 0.02) 45%, rgba(10, 12, 13, 0.42) 100%),
    radial-gradient(160px 120px at 85% 15%, rgba(255, 255, 255, 0.12), transparent 70%);
  pointer-events: none;
}

.post-card__cover-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.post-card:hover .post-card__cover-image {
  transform: scale(1.04);
}

.post-card__cover-quote {
  color: rgba(231, 165, 74, 0.85);
  font-family: var(--font-serif);
  font-size: 116px;
  line-height: 0.7;
  transform: translateY(10px);
}

.post-card__cover-initial {
  position: absolute;
  top: 50%;
  left: 50%;
  color: rgba(255, 255, 255, 0.08);
  font-family: var(--font-display);
  font-size: 150px;
  font-weight: 700;
  line-height: 1;
  transform: translate(-50%, -54%);
}

.post-card__cover-tag {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  z-index: 2;
  max-width: calc(100% - 24px);
  padding: 4px 8px;
  overflow: hidden;
  color: #f6efe2;
  background: rgba(15, 17, 18, 0.46);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
  font-family: var(--font-sans);
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-4) var(--space-4) var(--space-3);
}

.post-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.post-card__meta i {
  width: 2px;
  height: 2px;
  background: currentColor;
  border-radius: 50%;
}

.post-card__title {
  display: -webkit-box;
  margin: 0 0 var(--space-2);
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.28;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-card__title a {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.post-card__title a:hover {
  color: var(--accent-hover);
}

.post-card__excerpt {
  display: -webkit-box;
  margin: 0 0 var(--space-3);
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: 1.65;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.post-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: var(--space-3);
}

.post-card__tag {
  padding: 3px 7px;
  color: var(--text-muted);
  background: var(--paper);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 9px;
}

.post-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--line);
}

.post-card__author {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
}

.post-card__author span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-card__avatar {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  object-fit: cover;
  background: var(--surface-hover);
  border-radius: var(--radius-full);
}

.post-card__stats {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
}

.post-card__stat {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 26px;
  padding: 0 5px;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 9.5px;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

span.post-card__stat {
  cursor: default;
}

.post-card__stat:hover {
  color: var(--ink);
  background: var(--paper);
}

.post-card__stat.is-liked {
  color: var(--danger);
}

/* Fill the last row when the grid has an odd number of cards */
.post-card--wide {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: 300px minmax(0, 1fr);
}

.post-card--wide .post-card__cover {
  height: 100%;
  min-height: 240px;
}

.post-card--wide .post-card__body {
  padding: var(--space-5) var(--space-5) var(--space-4);
}

.post-card--wide .post-card__title {
  font-size: var(--text-2xl);
  -webkit-line-clamp: 3;
}

.post-card--wide .post-card__excerpt {
  font-size: var(--text-sm);
  -webkit-line-clamp: 4;
}

@media (max-width: 1180px) {
  .featured-post {
    grid-template-columns: minmax(0, 1.2fr) minmax(200px, 0.8fr);
  }
}

@media (max-width: 900px) {
  .featured-post {
    grid-template-columns: minmax(0, 1fr) 210px;
    min-height: 300px;
  }

  .featured-post__content {
    padding: var(--space-5);
  }

  .featured-post__title {
    font-size: 24px;
  }

  .posts-grid {
    gap: var(--space-4);
  }
}

@media (max-width: 640px) {
  .featured-post {
    grid-template-columns: 1fr;
  }

  .featured-post__media {
    order: -1;
    min-height: 180px;
    max-height: 200px;
  }

  .featured-post__quote {
    font-size: 130px;
    transform: translateY(10px);
  }

  .featured-post__initial {
    font-size: 170px;
  }

  .featured-post__content {
    padding: var(--space-4);
  }

  .featured-post__title {
    font-size: 22px;
  }

  .featured-post__excerpt {
    -webkit-line-clamp: 3;
    font-size: var(--text-xs);
  }

  .featured-post__footer {
    gap: var(--space-2);
  }

  .featured-post__read {
    font-size: 10px;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .post-card--wide {
    display: flex;
    grid-column: auto;
  }

  .post-card--wide .post-card__cover {
    height: 180px;
    min-height: 0;
  }

  .post-card--wide .post-card__body {
    padding: var(--space-4);
  }

  .post-card--wide .post-card__title {
    font-size: var(--text-lg);
    -webkit-line-clamp: 2;
  }

  .post-card--wide .post-card__excerpt {
    font-size: var(--text-xs);
    -webkit-line-clamp: 3;
  }

  .post-card__cover {
    height: 180px;
  }

  .post-card__body {
    padding: var(--space-4);
  }
}

/* ── Redesign: editorial rows like the mockup ── */
@media (min-width: 1025px) {
  .posts-grid { display: flex; flex-direction: column; gap: 12px; }
  .post-card, .post-card--wide {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    min-height: 190px;
    overflow: hidden;
    background: var(--cream);
    border: 1px solid var(--line);
    border-radius: 12px;
  }
  .post-card__cover, .post-card--wide .post-card__cover {
    width: 100%;
    height: 100%;
    min-height: 190px;
    border-radius: 0;
  }
  .post-card__body { padding: 20px 22px; }
  .post-card__title { margin: 7px 0 5px; font-family: var(--font-display); font-size: 24px; line-height: 1.14; }
  .post-card__excerpt { max-width: 620px; margin: 0; font-size: 12px; }
  .post-card__tags { margin-top: 8px; }
  .post-card__footer { margin-top: auto; padding-top: 14px; }
  .featured-post { min-height: 260px; }
}
</style>
