<template>
  <div class="comments-container">
    <div class="comments-header">
      <h6 class="comments-title">
        <icon-vue name="chat"></icon-vue>
        Комментарии <span class="comments-count">{{ total }}</span>
      </h6>
    </div>

    <div v-if="loading" class="comments-loading">Загрузка комментариев…</div>
    <div v-else-if="error" class="comments-error">{{ error }}</div>

    <div v-if="!loading && !error && flatComments.length > 0" class="comments-list">
      <comments
        v-for="comment in flatComments"
        :key="comment.id"
        :comment="comment"
        :commentable-type="commentableType"
        :commentable-id="commentableId"
        :depth="comment.parent_id ? 1 : 0"
        @deleted="handleCommentDeleted"
        @login-required="handleLoginRequired"
      />
    </div>

    <div v-else-if="!loading && !error && flatComments.length === 0" class="comments-empty">
      <p>Комментариев пока нет. Будьте первым!</p>
    </div>

    <!-- Comment pagination -->
    <div v-if="!loading && !error && lastPage > 1" class="comments-pagination">
      <button
        class="btn btn-ghost btn-sm"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        aria-label="Предыдущая страница"
      >
        ← Предыдущая
      </button>
      <span class="comments-pagination__info">
        Страница {{ currentPage }} из {{ lastPage }}
      </span>
      <button
        class="btn btn-ghost btn-sm"
        :disabled="currentPage === lastPage"
        @click="changePage(currentPage + 1)"
        aria-label="Следующая страница"
      >
        Следующая →
      </button>
    </div>

    <!-- Add comment form -->
    <div v-if="user" class="comments-new">
      <textarea
        v-model="newCommentContent"
        placeholder="Напишите комментарий…"
        rows="3"
        class="comment__new-textarea"
        :disabled="submitting"
      ></textarea>
      <div class="comments-new-actions">
        <button
          class="btn btn-ghost btn-sm"
          @click="newCommentContent = ''"
          :disabled="submitting"
        >
          Отмена
        </button>
        <button
          class="btn btn-primary btn-sm"
          @click="submitComment"
          :disabled="submitting || !newCommentContent.trim()"
        >
          {{ submitting ? 'Отправляем…' : 'Отправить' }}
        </button>
      </div>
      <div v-if="submitError" class="comments-new-error">{{ submitError }}</div>
    </div>

    <div v-if="!user && !submitting" class="comments-login-prompt">
      <p>Чтобы оставлять комментарии, <a @click="handleLoginRequired" style="color: var(--accent); cursor: pointer;">войдите в аккаунт</a>.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { computed } from 'vue';
import IconVue from '@/components/Icons/IconVue.vue';
import Comments from '@/components/Comments/Comments.vue';

export default {
  name: 'CommentsVue',
  components: {
    IconVue,
    Comments,
  },
  props: {
    commentableType: {
      type: String,
      required: true,
    },
    commentableId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      newCommentContent: '',
      submitting: false,
      submitError: '',
      _openMenuId: null,
    };
  },
  provide() {
    return {
      commentMenu: {
        openId: computed(() => this._openMenuId),
        setOpenId: (id) => {
          this._openMenuId = id;
        },
      },
    };
  },
  computed: {
    ...mapGetters('comments', {
      comments: 'comments',
      total: 'total',
      currentPage: 'currentPage',
      lastPage: 'lastPage',
      perPage: 'perPage',
      loading: 'loading',
      error: 'error',
    }),
    ...mapGetters('auth', ['user']),
    flatComments() {
      const result = [];
      const flatten = (list) => {
        for (const comment of list) {
          result.push(comment);
          if (comment.replies && comment.replies.length) {
            flatten(comment.replies);
          }
        }
      };
      flatten(this.comments);
      return result;
    },
  },
  watch: {
    commentableId: {
      immediate: true,
      handler() {
        this.fetchComments(1);
      },
    },
  },
  mounted() {
    this.fetchComments(1);
  },
  methods: {
    ...mapActions('comments', {
      addComment: 'addComment',
      getComment: 'getComment',
    }),
    async fetchComments(page = 1) {
      try {
        await this.getComment({
          commentableType: this.commentableType,
          commentableId: this.commentableId,
          page,
          perPage: 6,
        });
      } catch (err) {
        console.error('Ошибка загрузки комментариев:', err);
      }
    },
    async changePage(page) {
      if (page < 1 || page > this.lastPage) return;
      await this.fetchComments(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async submitComment() {
      if (!this.newCommentContent.trim() || this.submitting || !this.user) return;

      this.submitting = true;
      this.submitError = '';

      try {
        await this.addComment({
          commentableType: this.commentableType,
          commentableId: this.commentableId,
          content: this.newCommentContent.trim(),
          parentId: null,
        });
        this.newCommentContent = '';
        await this.fetchComments(1);
      } catch (error) {
        this.submitError = error.response?.data?.message || 'Не удалось отправить комментарий';
        console.error('Ошибка при отправке комментария:', error);
      } finally {
        this.submitting = false;
      }
    },
    handleCommentDeleted(commentId) {
      this.$emit('deleted', commentId);
    },
    handleLoginRequired() {
      this.$emit('login-required');
    },
  },
};
</script>

<style scoped>
.comments-container {
  width: 100%;
}

.comments-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.comments-title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--ink);
  font-family: var(--font-sans);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.comments-count {
  font-weight: 500;
  color: var(--accent);
}

.comments-loading,
.comments-empty,
.comments-error {
  padding: var(--space-6);
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.comments-error {
  color: var(--danger);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.comments-new {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.comment__new-textarea {
  width: 100%;
  min-height: 100px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--reader-text);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  resize: vertical;
  box-sizing: border-box;
}

.comment__new-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.comment__new-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.comments-new-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.comments-new-error {
  margin-top: var(--space-2);
  color: var(--danger);
  font-size: var(--text-sm);
}

.comments-login-prompt {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: var(--surface-hover);
  border-radius: var(--radius-md);
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.comments-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.comments-pagination__info {
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-sans);
  min-width: 140px;
  text-align: center;
}

@media (max-width: 640px) {
  .comments-pagination {
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .comments-pagination__info {
    order: -1;
    width: 100%;
    min-width: 0;
  }

  .comments-pagination .btn {
    flex: 1;
    min-width: 0;
    padding-right: var(--space-2);
    padding-left: var(--space-2);
    font-size: 10px;
  }
}
</style>
