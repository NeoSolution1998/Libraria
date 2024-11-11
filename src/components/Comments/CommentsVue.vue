<template>
  <div class="container bg-white pl-4 pr-4 pb-4 pt-3 mb-3">
    <h6><icon-vue name="chat"></icon-vue> Комментарии {{ comments.length }}</h6>
    <hr class="pb-2" />

    <div v-if="comments.length > 0">
      {{ console.log(comments) }}
      <comments v-for="comment in comments" :key="comment.id" :comment="comment" @reply="handleReply"></comments>
    </div>
    <div v-else>
      <p>Нет комментариев.</p>
    </div>

    <div class="new-comment mt-3">
      <textarea v-model="newCommentContent" placeholder="Напишите комментарий..." rows="3" class="form-control"></textarea>
      <!-- <button @click="submitComment" class="btn btn-outline-dark mb-2 test mt-2">Добавить комментарий</button> -->
      <button class="btn btn-outline-dark mb-2 test mt-2">Добавить комментарий</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CommentsVue",
  components: {
    Comment
  },
  props: {
    commentableType: {
      type: String,
      required: true
    },
    commentableId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      newCommentContent: '',
      parentCommentId: null
    };
  },
  computed: {
    ...mapGetters('comments', {
      comments: 'comments'
    })
  },
  mounted() {
    this.fetchComments();
  },
  methods: {
    ...mapActions('comments', {
      getComment: "getComment",
      addComment: "addComment"
    }),
    fetchComments() {
      this.getComment({ commentableType: this.commentableType, commentableId: this.commentableId });
    },
    submitComment() {
      if (this.newCommentContent.trim() === '') return;
      this.addComment({
        commentableType: this.commentableType,
        commentableId: this.commentableId,
        content: this.newCommentContent,
        parentId: this.parentCommentId
      });
      this.newCommentContent = '';
      this.parentCommentId = null;
    },
    handleReply(parentId) {
      this.parentCommentId = parentId;
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

.container {
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* Добавление тени */
}

.post {
  background-color: rgb(245, 247, 246);
  border-radius: 3%;
  margin-bottom: 10px;
  padding: 10px;
}

.activity-list .float-left {
  margin-right: 10px;
  width: 40px;
  height: 40px;
  float: left;
  display: block;
  border-radius: 50%;
  background-color: #eee;
  font-size: 20px;
  line-height: 100%;
  line-height: 43px;
  text-align: center;
}

.activity-list .float-left a {
  display: inline-block;
  color: #999;
}

.comment-content {
  overflow: hidden;
}

.comment-content span.text-small {
  display: block;
  color: #999;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>