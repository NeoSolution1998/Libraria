<template>
  <div class="comment mb-5" :style="{ color: textColor, backgroundColor: backgroundColor, marginLeft: comment.parent ? '0' : '20px' }">
    <div class="row">
      <div class="col-1">
        <div class="img-user-icon float-left w-100">
          <img :src="'https://bootdey.com/img/Content/avatar/avatar6.png'" alt="" class="img-fluid rounded-circle" />
        </div>
      </div>

      <div class="col-11">
        <icon-vue class="float-right" name="dot-3"></icon-vue>
        <h6 class="m-0">{{ comment.author.name }}</h6>
        <span class="comment-data text-small">{{ timeSince(comment.created_at) }}</span>

        <div class="comment-content mt-3">
          <p v-if="comment.parent !== null" class="w-100">{{ "@" + comment.parent + ", " + comment.content }}</p>
          <p v-else class="w-100">{{ comment.content }}</p>

          <img v-if="comment.imageUrl" :src="comment.imageUrl" alt=""
               class="img-fluid img-comment img-thumbnail mb-3" />
          <div>
            <div v-if="showReplyForm" class="reply-form mt-2">
              <textarea v-model="replyContent" placeholder="Напишите ответ..." rows="2" class="form-control"></textarea>
              <button class="btn btn-outline-dark mb-2 test mt-2">Ответить</button>
            </div>
            <icon-vue name="reply" @click="toggleReplyForm"></icon-vue>
            <icon-vue name="heart-empty"></icon-vue>
          </div>
          <hr />
        </div>
        <div v-if="comment.children" class="child-comments">
          <comments v-for="child in comment.children" :key="child.id" :comment="child"
                    :textColor="textColor" :backgroundColor="backgroundColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "Comments",
  props: {
    comment: Object,
    textColor: String,
    backgroundColor: String
  },
  data() {
    return {
      showReplyForm: false,
      replyContent: ''
    };
  },
  methods: {
    timeSince(date) {
      const now = moment();
      const commentTime = moment(date);
      const duration = moment.duration(now.diff(commentTime));

      const days = Math.floor(duration.asDays());
      const hours = Math.floor(duration.asHours()) % 24;
      const minutes = Math.floor(duration.asMinutes()) % 60;

      let timeString = '';
      if (days > 0) timeString += `${days} day${days > 1 ? 's' : ''} `;
      if (hours > 0) timeString += `${hours} hour${hours > 1 ? 's' : ''} `;
      if (minutes > 0) timeString += `${minutes} minute${minutes > 1 ? 's' : ''}`;

      return timeString.trim() + " ago" || 'Just now';
    },
    toggleReplyForm() {
      this.showReplyForm = !this.showReplyForm;
    },
    submitReply() {
      if (this.replyContent.trim() === '') return;

      this.$emit('reply', {
        parentId: this.comment.id,
        content: this.replyContent
      });

      this.replyContent = '';
      this.showReplyForm = false;
    }
  }
};
</script>

<style scoped>
.img-comment {
  max-width: 150px;
  max-height: 100%;
  margin: 0%;
  padding: 0%;
}

.img-user-icon {
  max-width: 50px;
  margin-left: 20%;
  padding: 0%;
}

.comment-content {
  overflow: hidden;
}

.comment-content span.text-small {
  display: block;
  color: inherit; /* Унаследовать цвет от родителя */
  margin-bottom: 10px;
  font-size: 12px;
}

.child-comments {
  margin-left: 20px;
  /* Отступ для дочерних комментариев */
}
</style>
