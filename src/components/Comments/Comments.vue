<template>
  <article class="comment" :class="commentClasses">
    <!-- Avatar -->
    <div class="comment__avatar">
      <img :src="comment.author?.avatar || '/images/user_default.jpg'" :alt="comment.author?.name || 'Пользователь'" class="comment__avatar-img" />
    </div>

    <!-- Content -->
    <div class="comment__body">
      <header class="comment__header">
        <div class="comment__header-info">
          <div class="comment__author-info">
            <span class="comment__author">{{ comment?.author?.name || 'Пользователь' }}</span>
            <time class="comment__time">{{ comment?.created_at ? timeSince(comment.created_at) : '' }}</time>
          </div>
          <div class="comment__rating">
            <button class="comment__vote comment__vote--up" :class="{ liked: isLiked }" @click="vote('up')" :aria-label="`${isLiked ? 'Убрать лайк' : 'Поставить лайк'} (${comment?.likes_count || 0})`" :aria-pressed="isLiked">
              <span class="vote-icon">+</span>
              <span class="vote-count">{{ comment?.likes_count || 0 }}</span>
            </button>
            <button class="comment__vote comment__vote--down" @click="vote('down')" :aria-label="`Поставить дизлайк`">
              <span class="vote-icon">-</span>
            </button>
          </div>
        </div>
        <div class="comment__actions" ref="actionsRef">
          <button v-if="canEditOrDelete" class="comment__action" @click="toggleMenu($event)" aria-label="Ещё действия">
            <span class="icon-dots">...</span>
          </button>
          <button
            v-if="user"
            class="comment__action comment__action--reply"
            @click="openReplyForm"
            aria-label="Ответить на комментарий"
          >
            <span class="icon-reply"></span> Ответить
          </button>
          <div v-if="menuOpen" class="comment__menu" :style="menuStyle" ref="menuRef">
            <button v-if="canEdit" class="comment__menu-item" @click="startEdit">
              Редактировать
            </button>
            <button v-if="canDelete" class="comment__menu-item comment__menu-item--danger" @click="confirmDelete">
              Удалить
            </button>
          </div>
        </div>
      </header>

      <div v-if="editing" class="comment__edit">
        <textarea v-model="editContent" class="comment__edit-text" :placeholder="editContent || 'Введите текст комментария…'" rows="2" @input="editContent = $event.target.value"></textarea>
        <div class="comment__edit-actions">
          <button class="btn btn-ghost btn-sm" @click="cancelEdit">Отмена</button>
          <button class="btn btn-primary btn-sm" @click="saveEdit" :disabled="!editContent.trim() || editingSaving">Сохранить</button>
        </div>
      </div>
      <div v-else-if="deleting" class="comment__edit">
        <p class="comment__delete-confirm">Удалить комментарий?</p>
        <div class="comment__edit-actions">
          <button class="btn btn-ghost btn-sm" @click="cancelDelete">Отмена</button>
          <button class="btn btn-danger btn-sm" @click="doDelete" :disabled="deletingSaving">Удалить</button>
        </div>
      </div>
      <div v-else class="comment__content">
        <p v-html="formatContent(comment?.content)" class="comment__text"></p>
      </div>

      <div v-if="showReplyForm" class="comment__reply-form">
        <textarea v-model="replyContent" placeholder="Написать ответ…" rows="2" class="comment__reply-textarea"></textarea>
        <div class="comment__reply-actions">
          <button class="btn btn-ghost btn-sm" @click="toggleReplyForm">Отмена</button>
          <button class="btn btn-primary btn-sm" @click="submitReply" :disabled="!replyContent.trim() || replySending">Отправить</button>
        </div>
      </div>

    </div>
  </article>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Comments',
  inject: ['commentMenu'],
  props: {
    comment: {
      type: Object,
      required: true,
    },
    commentableType: {
      type: String,
      required: true,
    },
    commentableId: {
      type: [String, Number],
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showReplyForm: false,
      replyContent: '',
      replySending: false,
      editing: false,
      editContent: '',
      editingSaving: false,
      deleting: false,
      deletingSaving: false,
      menuPosition: { top: 0, left: 0, right: 'auto' },
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    MAX_DEPTH() {
      return 2;
    },
    menuOpen() {
      return this.commentMenu.openId.value === this.comment.id;
    },
    commentClasses() {
      const classes = ['comment'];
      if (this.comment?.parent_id) {
        classes.push('comment--nested');
        classes.push(`comment--depth-${Math.min(this.depth, this.MAX_DEPTH)}`);
      }
      return classes;
    },
    canEditOrDelete() {
      const currentUserId = this.user ? this.user.id : null;
      return currentUserId && this.comment?.author?.id === currentUserId;
    },
    canEdit() {
      const currentUserId = this.user ? this.user.id : null;
      return currentUserId && this.comment?.author?.id === currentUserId;
    },
    canDelete() {
      const currentUserId = this.user ? this.user.id : null;
      return currentUserId && this.comment?.author?.id === currentUserId;
    },
    isLiked() {
      return !!this.comment?.is_liked;
    },
    likesCount() {
      return Number(this.comment?.likes_count || 0);
    },
    menuStyle() {
      return {
        top: this.menuPosition.top + 'px',
        left: this.menuPosition.left + 'px',
        right: this.menuPosition.right,
      };
    },
  },
  watch: {
    editing(val) {
      if (val) {
        this.editContent = this.comment?.content || '';
      }
    },
  },
  methods: {
    ...mapActions('comments', {
      addComment: 'addComment',
      updateComment: 'updateComment',
      deleteComment: 'deleteComment',
      getComment: 'getComment',
    }),
    ...mapActions('comments', {
      toggleCommentLike: 'toggleCommentLike',
    }),
    timeSince(date) {
      if (!date) return '';
      const now = new Date();
      const commentTime = new Date(date);
      const diffSeconds = Math.floor((now - commentTime) / 1000);

      if (diffSeconds < 60) return 'только что';
      if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} мин назад`;
      if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} ч назад`;

      const days = Math.floor(diffSeconds / 86400);
      if (days < 30) return `${days} дн назад`;

      return commentTime.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    },
    formatContent(content) {
      if (!content) return '';
      return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    },
    toggleMenu(event) {
      if (this.menuOpen) {
        this.commentMenu.setOpenId(null);
        return;
      }
      this.commentMenu.setOpenId(this.comment.id);
      this.$nextTick(() => {
        this.positionMenu(event.currentTarget);
      });
    },
    positionMenu(trigger) {
      const rect = trigger.getBoundingClientRect();
      const menuEl = this.$refs.menuRef;
      if (!menuEl) return;

      const menuRect = menuEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = rect.bottom + 8;
      let left = rect.right - menuRect.width;

      // Ensure left doesn't go below 0
      if (left < 0) {
        left = 0;
      }

      // Flip horizontally if menu would overflow the right edge.
      if (left + menuRect.width > viewportWidth - 8) {
        left = viewportWidth - menuRect.width - 8;
      }

      // Flip vertically if menu would overflow the bottom edge — show above the trigger.
      if (top + menuRect.height > viewportHeight - 8) {
        top = rect.top - menuRect.height - 8;
        if (top < 8) {
          top = 8;
        }
      }

      // Ensure top doesn't go above 0
      if (top < 8) {
        top = 8;
      }

      this.menuPosition = { top, left, right: 'auto' };
    },
    openReplyForm() {
      if (!this.user) {
        this.$emit('login-required');
        return;
      }
      this.commentMenu.setOpenId(null);
      this.showReplyForm = !this.showReplyForm;
    },
    startEdit() {
      this.commentMenu.setOpenId(null);
      this.editing = true;
    },
    cancelEdit() {
      this.editing = false;
      this.editContent = '';
    },
    async saveEdit() {
      if (!this.editContent.trim() || this.editingSaving) return;
      this.editingSaving = true;
      try {
        await this.updateComment({
          commentId: this.comment.id,
          content: this.editContent.trim(),
          commentableType: this.commentableType,
          commentableId: this.commentableId,
        });
        this.comment.content = this.editContent.trim();
        this.editing = false;
        this.editContent = '';
      } catch (error) {
        console.error('Ошибка при редактировании комментария:', error);
        alert('Не удалось отредактировать комментарий');
      } finally {
        this.editingSaving = false;
      }
    },
    confirmDelete() {
      this.commentMenu.setOpenId(null);
      this.deleting = true;
    },
    cancelDelete() {
      this.deleting = false;
    },
    async doDelete() {
      if (this.deletingSaving) return;
      this.deletingSaving = true;
      try {
        await this.deleteComment({
          commentId: this.comment.id,
          commentableType: this.commentableType,
          commentableId: this.commentableId,
        });
        this.$emit('deleted', this.comment.id);
      } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
        alert('Не удалось удалить комментарий');
      } finally {
        this.deleting = false;
        this.deletingSaving = false;
      }
    },
    async vote(type) {
      if (!this.user) {
        this.$emit('login-required');
        return;
      }
      const wasLiked = Boolean(this.comment.is_liked);
      const wasCount = Number(this.comment.likes_count || 0);
      // 'up' — поставить/убрать лайк, 'down' — убрать лайк
      const newLiked = type === 'up' ? !wasLiked : false;
      const delta = newLiked === wasLiked ? 0 : (newLiked ? 1 : -1);

      // Оптимистично обновляем только этот комментарий, а не весь блок
      this.comment.is_liked = newLiked;
      this.comment.likes_count = Math.max(0, wasCount + delta);

      try {
        await this.toggleCommentLike({
          type: 'comment',
          id: this.comment.id,
          action: type === 'up' ? 'like' : 'unlike',
        });
        // Серверный ответ уже применён мутацией updateCommentLike в стейте
        // (та же ссылка на объект прокинута через пропс), полный рефетч блока не нужен.
      } catch (error) {
        // При ошибке откатываем оптимистичное состояние
        this.comment.is_liked = wasLiked;
        this.comment.likes_count = wasCount;
        console.error('Ошибка при голосовании:', error);
        alert('Не удалось изменить лайк');
      }
    },
    toggleReplyForm() {
      if (!this.user) {
        this.$emit('login-required');
        return;
      }
      this.showReplyForm = !this.showReplyForm;
    },
    async submitReply() {
      if (!this.replyContent.trim() || this.replySending) return;
      this.replySending = true;

      try {
        await this.addComment({
          commentableType: this.commentableType,
          commentableId: this.commentableId,
          content: this.replyContent.trim(),
          parentId: this.comment.id,
        });
        this.replyContent = '';
        this.showReplyForm = false;
        await this.getComment({
          commentableType: this.commentableType,
          commentableId: this.commentableId,
        });
      } catch (error) {
        console.error('Ошибка при отправке ответа:', error);
        alert('Не удалось отправить ответ');
      } finally {
        this.replySending = false;
      }
    },
    handleLoginRequired() {
      this.$emit('login-required');
    },
    handleOutsideClick(event) {
      if (this.menuOpen && this.$el && !this.$el.contains(event.target)) {
        this.commentMenu.setOpenId(null);
      }
    },
  },
  mounted() {
    window.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
    this.commentMenu.setOpenId(null);
  },
};
</script>

<style scoped>
.comment {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-1);
  animation: comment-fade 0.2s ease-out;
  position: relative;
  overflow: visible;
}

.comment--nested {
  margin-left: var(--space-2);
  border-left: 2px solid var(--line-strong);
}

.comment--depth-1 { margin-left: var(--space-1); }
.comment--depth-2 { margin-left: var(--space-2); }

@keyframes comment-fade {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
}

.comment__avatar {
  flex-shrink: 0;
}

.comment__avatar-img {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  object-fit: cover;
  background: var(--surface-hover);
}

.comment__body {
  flex: 1;
  min-width: 0;
  position: relative;
}

.comment__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.comment__header-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
  min-width: 0;
}

.comment__author {
  font-weight: 600;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
}

.comment__time {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-sans);
}

.comment__rating {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.comment__vote {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: none;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: color var(--transition-fast);
  padding: 0;
}

.comment__vote:hover {
  color: var(--ink);
}

.comment__vote--up:hover {
  color: var(--success);
}

.comment__vote--up.liked {
  color: var(--success);
}

.comment__vote--up.liked .vote-icon {
  font-weight: 700;
}

.comment__vote--down:hover {
  color: var(--danger);
}

.comment__vote .vote-icon {
  font-weight: 700;
}

.comment__vote .vote-count {
  font-size: var(--text-xs);
}

.comment__actions {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-shrink: 0;
  position: relative;
}

.comment__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
  font-size: var(--text-sm);
  white-space: nowrap;
}

.comment__action:hover {
  background: var(--surface-hover);
  color: var(--ink);
}

.comment__action--reply {
  width: auto;
  padding: 0 var(--space-3);
  font-size: var(--text-xs);
  color: var(--accent);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.comment__action--reply:hover {
  background: var(--accent);
  color: var(--text-on-accent);
  border-color: var(--accent);
}

.comment__menu {
  position: fixed;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  min-width: 140px;
  padding: var(--space-3);
  animation: menu-fade 0.15s ease-out;
  overflow: hidden;
  transform-origin: top right;
  font-family: var(--font-sans);
}

@keyframes menu-fade {
  from { opacity: 0; transform: translateY(-2px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.comment__menu-item {
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: none;
  border: none;
  text-align: left;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
  margin-bottom: var(--space-1);
  border-radius: var(--radius-sm);
}

.comment__menu-item:hover {
  background: var(--surface-hover);
  color: var(--accent);
}

.comment__menu-item--danger {
  color: var(--danger);
}

.comment__menu-item--danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.comment__menu-item:last-child {
  margin-bottom: 0;
}

.comment__content {
  margin-bottom: var(--space-3);
}

.comment__content p {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

.comment__reply-prefix {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-1);
}

.comment__reply-form {
  margin-top: var(--space-1);
  padding-top: var(--space-1);
  border-top: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.comment__reply-textarea {
  width: 100%;
  min-height: 60px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  resize: vertical;
  box-sizing: border-box;
}

.comment__reply-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.comment__reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.comment__replies {
  margin-top: var(--space-1);
  padding-left: var(--space-2);
  border-left: 2px solid var(--line-strong);
}

.comment__edit {
  margin-top: var(--space-2);
  padding: var(--space-3);
  background: var(--surface-hover);
  border-radius: var(--radius-md);
}

.comment__edit-text {
  width: 100%;
  min-height: 80px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  resize: vertical;
  margin-bottom: var(--space-2);
  box-sizing: border-box;
}

.comment__edit-text:focus {
  outline: none;
  border-color: var(--accent);
}

.comment__edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.comment__delete-confirm {
  margin: 0 0 var(--space-2);
  color: var(--ink);
  font-size: var(--text-sm);
}

@media (max-width: 640px) {
  .comment {
    padding: var(--space-3);
  }

  .comment__action--reply {
    font-size: var(--text-xs);
    padding: 0 var(--space-2);
  }

  .comment__replies {
    padding-left: var(--space-4);
  }

  .comment__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-1);
  }

  .comment__actions {
    margin-top: var(--space-1);
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .comment__action {
    width: auto;
    padding: 0 var(--space-3);
  }
}
</style>
