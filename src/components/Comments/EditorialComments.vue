<template>
  <section class="ec">
    <h2 class="ec__title">Комментарии ({{ total }})</h2>

    <form v-if="user" class="ec-form" @submit.prevent="submit">
      <span class="ec-form__avatar">
        <img v-if="user.avatar && !avatarFailed" :src="user.avatar" :alt="user.name" @error="avatarFailed = true" />
        <span v-else>{{ initialsOf(user.name) }}</span>
      </span>

      <div class="ec-form__body">
        <textarea
          v-model="draft"
          rows="4"
          placeholder="Поделитесь своим мнением…"
          aria-label="Новый комментарий"
          :disabled="sending"
        ></textarea>

        <div class="ec-form__actions">
          <button type="submit" class="ec-send" :disabled="sending">
            {{ sending ? 'Отправляем…' : 'Отправить' }}
          </button>
        </div>
      </div>
    </form>

    <p v-else class="ec-login">
      <router-link :to="{ name: 'Login', query: { redirect: $route.fullPath } }">Войдите</router-link>,
      чтобы оставить комментарий.
    </p>

    <p v-if="formError" class="ec-error">{{ formError }}</p>

    <div v-if="loading" class="ec-state">Загружаем комментарии…</div>

    <p v-else-if="!comments.length" class="ec-state">Пока никто не оставил комментарий.</p>

    <ul v-else class="ec-list">
      <li v-for="comment in comments" :key="comment.id" class="ec-item">
        <span class="ec-item__avatar">
          <img
            v-if="comment.author?.avatar && !isBroken(`a-${comment.author.id}`)"
            :src="comment.author.avatar"
            :alt="comment.author?.name"
            loading="lazy"
            @error="markBroken(`a-${comment.author.id}`)"
          />
          <span v-else>{{ initialsOf(comment.author?.name) }}</span>
        </span>

        <div class="ec-item__body">
          <strong class="ec-item__name">{{ comment.author?.name || 'Читатель' }}</strong>
          <time class="ec-item__time">{{ timeLabel(comment) }}</time>

          <div v-if="canManage(comment)" class="ec-menu">
            <button
              type="button"
              class="ec-menu__trigger"
              aria-label="Действия с комментарием"
              @click.stop="toggleMenu(comment)"
            >
              <span aria-hidden="true">⋯</span>
            </button>

            <div v-if="menuOpenId === comment.id" class="ec-menu__list">
              <button type="button" class="ec-menu__item" @click="startEditFromMenu(comment)">Изменить</button>
              <button type="button" class="ec-menu__item ec-menu__item--danger" @click="removeFromMenu(comment)">
                Удалить
              </button>
            </div>
          </div>

          <template v-if="editingId !== comment.id">
            <p class="ec-item__text">{{ comment.content }}</p>

            <div class="ec-item__actions">
              <button v-if="user" type="button" class="ec-action" @click="openReply(comment)">Ответить</button>

              <button
                type="button"
                class="ec-like"
                :class="{ 'is-liked': comment.is_liked }"
                @click="toggleLike(comment)"
              >
                <svg
                  class="ec-like__icon"
                  :class="{ 'is-filled': comment.is_liked }"
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  aria-hidden="true"
                >
                  <path
                    d="M12 20.2 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.2Z"
                    :fill="comment.is_liked ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ comment.likes_count || 0 }}
              </button>
            </div>
          </template>

          <form v-else class="ec-edit" @submit.prevent="saveEdit(comment)">
            <textarea v-model="editDraft" rows="3" aria-label="Редактировать комментарий"></textarea>
            <div class="ec-edit__actions">
              <button type="button" class="ec-action" @click="cancelEdit">Отмена</button>
              <button type="submit" class="ec-send ec-send--sm" :disabled="savingEdit || !editDraft.trim()">
                {{ savingEdit ? 'Сохраняем…' : 'Сохранить' }}
              </button>
            </div>
          </form>

          <form v-if="replyTo === comment.id" class="ec-edit" @submit.prevent="submitReply(comment)">
            <textarea v-model="replyDraft" rows="3" placeholder="Написать ответ…" aria-label="Ответ на комментарий"></textarea>
            <div class="ec-edit__actions">
              <button type="button" class="ec-action" @click="cancelReply">Отмена</button>
              <button type="submit" class="ec-send ec-send--sm" :disabled="replying || !replyDraft.trim()">
                {{ replying ? 'Отправляем…' : 'Ответить' }}
              </button>
            </div>
          </form>

          <ul v-if="comment.replies?.length" class="ec-list ec-list--nested">
            <li v-for="reply in comment.replies" :key="reply.id" class="ec-item ec-item--nested">
              <span class="ec-item__avatar ec-item__avatar--sm">
                <img
                  v-if="reply.author?.avatar && !isBroken(`a-${reply.author.id}`)"
                  :src="reply.author.avatar"
                  :alt="reply.author?.name"
                  loading="lazy"
                  @error="markBroken(`a-${reply.author.id}`)"
                />
                <span v-else>{{ initialsOf(reply.author?.name) }}</span>
              </span>

              <div class="ec-item__body">
                <strong class="ec-item__name">{{ reply.author?.name || 'Читатель' }}</strong>
                <time class="ec-item__time">{{ timeLabel(reply) }}</time>

                <div v-if="canManage(reply)" class="ec-menu">
                  <button
                    type="button"
                    class="ec-menu__trigger"
                    aria-label="Действия с комментарием"
                    @click.stop="toggleMenu(reply)"
                  >
                    <span aria-hidden="true">⋯</span>
                  </button>

                  <div v-if="menuOpenId === reply.id" class="ec-menu__list">
                    <button type="button" class="ec-menu__item" @click="startEditFromMenu(reply)">Изменить</button>
                    <button type="button" class="ec-menu__item ec-menu__item--danger" @click="removeFromMenu(reply)">
                      Удалить
                    </button>
                  </div>
                </div>

                <template v-if="editingId !== reply.id">
                  <p class="ec-item__text">{{ reply.content }}</p>

                  <div class="ec-item__actions">
                    <button v-if="user" type="button" class="ec-action" @click="openNestedReply(comment, reply)">
                      Ответить
                    </button>
                    <button
                      type="button"
                      class="ec-like"
                      :class="{ 'is-liked': reply.is_liked }"
                      @click="toggleLike(reply)"
                    >
                      <svg
                        class="ec-like__icon"
                        :class="{ 'is-filled': reply.is_liked }"
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 20.2 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.2Z"
                          :fill="reply.is_liked ? 'currentColor' : 'none'"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linejoin="round"
                        />
                      </svg>
                      {{ reply.likes_count || 0 }}
                    </button>
                  </div>
                </template>

                <form v-else class="ec-edit" @submit.prevent="saveEdit(reply)">
                  <textarea v-model="editDraft" rows="3" aria-label="Редактировать комментарий"></textarea>
                  <div class="ec-edit__actions">
                    <button type="button" class="ec-action" @click="cancelEdit">Отмена</button>
                    <button type="submit" class="ec-send ec-send--sm" :disabled="savingEdit || !editDraft.trim()">
                      {{ savingEdit ? 'Сохраняем…' : 'Сохранить' }}
                    </button>
                  </div>
                </form>

                <form v-if="replyTo === reply.id" class="ec-edit" @submit.prevent="submitReply(reply)">
                  <textarea v-model="replyDraft" rows="3" placeholder="Написать ответ…" aria-label="Ответ на комментарий"></textarea>
                  <div class="ec-edit__actions">
                    <button type="button" class="ec-action" @click="cancelReply">Отмена</button>
                    <button type="submit" class="ec-send ec-send--sm" :disabled="replying || !replyDraft.trim()">
                      {{ replying ? 'Отправляем…' : 'Ответить' }}
                    </button>
                  </div>
                </form>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>

    <button v-if="comments.length < total" type="button" class="ec-more" :disabled="loading" @click="load(page + 1)">
      Загрузить ещё комментарии
    </button>
  </section>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapGetters } from 'vuex';

const PER_PAGE = 6;

export default {
  name: 'EditorialComments',
  props: {
    commentableType: { type: String, required: true },
    commentableId: { type: [String, Number], required: true },
  },
  data() {
    return {
      comments: [],
      total: 0,
      page: 1,
      loading: false,
      draft: '',
      sending: false,
      formError: '',
      replyTo: null,
      replyParentId: null,
      replyDraft: '',
      replying: false,
      editingId: null,
      editDraft: '',
      savingEdit: false,
      avatarFailed: false,
      menuOpenId: null,
      broken: {},
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  mounted() {
    document.addEventListener('click', this.closeMenu);
    document.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeMenu);
    document.removeEventListener('keydown', this.onKeydown);
  },
  watch: {
    commentableId: {
      immediate: true,
      handler() {
        this.comments = [];
        this.load(1);
      },
    },
  },
  methods: {
    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    async load(page = 1) {
      this.loading = true;
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/comments`, {
          params: {
            commentable_type: this.commentableType,
            commentable_id: this.commentableId,
            page,
            per_page: PER_PAGE,
          },
          headers: this.authHeaders(),
        });

        const list = data.data || [];
        this.total = Number(data.total ?? list.length);

        if (page === 1) {
          this.comments = list.map(this.normalizeComment);
        } else {
          // Догружаем и раскладываем по родителям
          list.map(this.normalizeComment).forEach((item) => {
            if (item.parent_id) {
              const parent = this.comments.find((c) => Number(c.id) === Number(item.parent_id));
              if (parent) {
                parent.replies = [...(parent.replies || []), item];
                return;
              }
            }
            this.comments.push(item);
          });
        }

        this.page = page;
      } catch (e) {
        if (page === 1) {
          this.comments = [];
          this.total = 0;
        }
      } finally {
        this.loading = false;
      }
    },

    /* Приводим флаги к настоящим boolean/number: бэкенд может отдать 0/1 */
    normalizeComment(comment) {
      return {
        ...comment,
        is_liked: comment.is_liked === true || comment.is_liked === 1 || comment.is_liked === '1',
        likes_count: Number(comment.likes_count) || 0,
        replies: (comment.replies || []).map(this.normalizeComment),
      };
    },

    async submit() {
      const content = this.draft.trim();
      if (!content) {
        this.formError = 'Напишите комментарий, прежде чем отправлять.';
        return;
      }
      if (this.sending) return;

      this.sending = true;
      this.formError = '';

      try {
        await axios.post(
          `${process.env.VUE_APP_API_URL}/api/v1/comments`,
          { content, commentable_type: this.commentableType, commentable_id: Number(this.commentableId) },
          { headers: this.authHeaders() }
        );
        this.draft = '';
        await this.load(1);
      } catch (e) {
        this.formError = 'Не удалось отправить комментарий.';
      } finally {
        this.sending = false;
      }
    },

    toggleMenu(comment) {
      this.menuOpenId = this.menuOpenId === comment.id ? null : comment.id;
    },

    closeMenu() {
      this.menuOpenId = null;
    },

    onKeydown(event) {
      if (event.key === 'Escape') this.closeMenu();
    },

    startEditFromMenu(comment) {
      this.closeMenu();
      this.startEdit(comment);
    },

    removeFromMenu(comment) {
      this.closeMenu();
      this.remove(comment);
    },

    openReply(comment) {
      this.cancelEdit();

      if (this.replyTo === comment.id) {
        this.cancelReply();
        return;
      }

      this.replyTo = comment.id;
      this.replyParentId = comment.id;
      this.replyDraft = '';
    },

    /* Ответ на вложенный комментарий остаётся в том же треде */
    openNestedReply(parent, reply) {
      this.cancelEdit();

      if (this.replyTo === reply.id) {
        this.cancelReply();
        return;
      }

      this.replyTo = reply.id;
      this.replyParentId = parent.id;
      this.replyDraft = '';
    },

    cancelReply() {
      this.replyTo = null;
      this.replyParentId = null;
      this.replyDraft = '';
    },

    async submitReply(comment) {
      const content = this.replyDraft.trim();
      if (!content || this.replying) return;

      this.replying = true;
      try {
        await axios.post(
          `${process.env.VUE_APP_API_URL}/api/v1/comments`,
          {
            content,
            commentable_type: this.commentableType,
            commentable_id: Number(this.commentableId),
            parent_id: this.replyParentId || comment.id,
          },
          { headers: this.authHeaders() }
        );
        this.cancelReply();
        await this.load(1);
      } catch (e) {
        this.formError = 'Не удалось отправить ответ.';
      } finally {
        this.replying = false;
      }
    },

    startEdit(comment) {
      this.cancelReply();
      this.editingId = comment.id;
      this.editDraft = comment.content || '';
    },

    cancelEdit() {
      this.editingId = null;
      this.editDraft = '';
    },

    async saveEdit(comment) {
      const content = this.editDraft.trim();
      if (!content || this.savingEdit) return;

      this.savingEdit = true;
      try {
        await axios.put(
          `${process.env.VUE_APP_API_URL}/api/v1/comments/${comment.id}`,
          { content },
          { headers: { ...this.authHeaders(), 'Content-Type': 'application/json' } }
        );
        comment.content = content;
        this.cancelEdit();
      } catch (e) {
        this.formError = 'Не удалось сохранить изменения.';
      } finally {
        this.savingEdit = false;
      }
    },

    async remove(comment) {
      if (!window.confirm('Удалить комментарий?')) return;

      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/v1/comments/${comment.id}`, {
          headers: this.authHeaders(),
        });

        this.comments = this.comments
          .filter((item) => item.id !== comment.id)
          .map((item) => ({
            ...item,
            replies: (item.replies || []).filter((reply) => reply.id !== comment.id),
          }));
        this.total = Math.max(0, this.total - 1);
      } catch (e) {
        this.formError = 'Не удалось удалить комментарий.';
      }
    },

    async toggleLike(comment) {
      if (!this.user) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }

      if (comment.liking) return;
      comment.liking = true;

      const liked = Boolean(comment.is_liked);

      const url = `${process.env.VUE_APP_API_URL}/api/v1/comments/${comment.id}/like`;
      const config = { headers: this.authHeaders() };

      try {
        // ВАЖНО: у axios.delete вторым аргументом идёт config, а не тело запроса,
        // поэтому post и delete вызываем по-разному — иначе теряются заголовки.
        const { data } = liked
          ? await axios.delete(url, config)
          : await axios.post(url, {}, config);

        // Бэкенд возвращает { liked, likes_count } — берём точные значения
        comment.is_liked = typeof data?.liked === 'boolean' ? data.liked : !liked;
        comment.likes_count = Number(data?.likes_count ?? (Number(comment.likes_count || 0) + (liked ? -1 : 1)));
      } catch (e) {
        this.formError = liked
          ? 'Не удалось убрать лайк. Попробуйте ещё раз.'
          : 'Не удалось поставить лайк. Попробуйте ещё раз.';
      } finally {
        comment.liking = false;
      }
    },

    canManage(comment) {
      return Boolean(this.user && comment?.author?.id && Number(comment.author.id) === Number(this.user.id));
    },

    timeLabel(comment) {
      const raw = comment?.created_at;
      if (!raw) return '';
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return '';

      const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
      if (minutes < 1) return 'только что';
      if (minutes < 60) return `${minutes} мин назад`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} ч назад`;

      const days = Math.floor(hours / 24);
      if (days === 1) return 'Вчера';
      if (days < 7) return `${days} дн назад`;

      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    },

    initialsOf(name) {
      return String(name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },

    markBroken(key) {
      this.broken = { ...this.broken, [key]: true };
    },

    isBroken(key) {
      return Boolean(this.broken[key]);
    },
  },
};
</script>

<style scoped>
.ec {
  font-family: var(--font-sans);
}

.ec__title {
  margin: 0 0 26px;
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
}

/* Form */
.ec-form {
  display: flex;
  gap: 18px;
  margin-bottom: 12px;
}

.ec-form__avatar {
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  overflow: hidden;
  font-size: 14px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 50%;
}

.ec-form__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ec-form__body {
  flex: 1;
  min-width: 0;
}

.ec-form textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 132px;
  padding: 16px 18px;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.5;
  color: var(--ink);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 12px;
  resize: vertical;
  outline: none;
}

.ec-form textarea::placeholder {
  color: var(--text-muted);
}

.ec-form textarea:focus {
  border-color: var(--line-strong);
}

.ec-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.ec-send {
  height: 46px;
  padding: 0 26px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-on-accent);
  background: var(--accent);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.ec-send:hover:not(:disabled) {
  background: var(--accent-hover);
}

.ec-send:disabled {
  opacity: 0.6;
  cursor: default;
}

.ec-send--sm {
  height: 36px;
  padding: 0 18px;
  font-size: 12px;
}

.ec-login,
.ec-state {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.ec-login a {
  color: var(--accent);
}

.ec-error {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--danger);
}

/* List */
.ec-list {
  display: flex;
  flex-direction: column;
  gap: 38px;
  margin: 42px 0 0;
  padding: 0;
  list-style: none;
}

.ec-list--nested {
  gap: 26px;
  margin-top: 22px;
  padding-left: 6px;
  border-left: 1px solid var(--line);
}

.ec-item {
  display: flex;
  gap: 16px;
}

.ec-item--nested {
  gap: 12px;
  padding-left: 18px;
}

.ec-item__avatar {
  display: flex;
  flex: 0 0 40px;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  overflow: hidden;
  font-size: 12px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 50%;
}

.ec-item__avatar--sm {
  flex-basis: 32px;
  width: 32px;
  height: 32px;
  font-size: 10px;
}

.ec-item__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ec-item__body {
  position: relative;
  min-width: 0;
  flex: 1;
}

/* Three-dot menu in the top-right corner */
.ec-menu {
  position: absolute;
  top: -6px;
  right: 0;
}

.ec-menu__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 1;
  color: var(--text-muted);
  background: none;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.ec-menu__trigger:hover {
  color: var(--ink);
  background: var(--paper);
}

.ec-menu__list {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 20;
  min-width: 150px;
  padding: 6px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 16px 34px rgba(30, 33, 36, 0.12);
}

.ec-menu__item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  text-align: left;
  background: none;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.ec-menu__item:hover {
  background: var(--paper);
}

.ec-menu__item--danger {
  color: var(--danger);
}

.ec-item__name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}

.ec-item__time {
  display: block;
  margin-top: 3px;
  font-size: 13px;
  color: var(--text-muted);
}

.ec-item__text {
  margin: 14px 0 0;
  font-size: 16px;
  line-height: 1.6;
  color: #303633;
  white-space: pre-line;
}

.ec-item__actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 14px;
}

.ec-action {
  padding: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-secondary);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.ec-action:hover {
  color: var(--ink);
}

.ec-action--danger:hover {
  color: var(--danger);
}

.ec-like {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-secondary);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.ec-like:hover {
  color: var(--ink);
}

.ec-like__icon {
  flex: 0 0 auto;
  color: currentColor;
  transition: transform 0.15s ease;
}

.ec-like:hover .ec-like__icon {
  transform: scale(1.12);
}

.ec-like.is-liked {
  color: var(--danger);
}

.ec-like.is-liked:hover {
  color: #842f28;
}

/* Inline edit / reply */
.ec-edit {
  margin-top: 14px;
}

.ec-edit textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 88px;
  padding: 12px 14px;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 10px;
  resize: vertical;
  outline: none;
}

.ec-edit textarea:focus {
  border-color: var(--line-strong);
}

.ec-edit__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 10px;
}

.ec-more {
  display: block;
  width: 100%;
  padding: 12px 0;
  margin-top: 32px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 10px;
  cursor: pointer;
}

@media (max-width: 760px) {
  .ec__title {
    font-size: 24px;
  }

  .ec-form {
    gap: 12px;
  }

  .ec-form__avatar {
    flex-basis: 38px;
    width: 38px;
    height: 38px;
  }

  .ec-form textarea {
    font-size: 15px;
  }

  .ec-item__text {
    font-size: 15px;
  }

  .ec-list {
    gap: 30px;
  }
}
</style>
