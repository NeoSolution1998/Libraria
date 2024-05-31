<template>
  <div class="pagination-wrap">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" @click="goToPage(1)">Первая</a></li>
        <li class="page-item"><a class="page-link" @click="prevPage">Назад</a></li>
        <li class="page-item"><a class="page-link" @click="nextPage">Вперед</a></li>
        <li class="page-item"><a class="page-link" @click="goToPage(totalPages)">Последняя</a></li>
        <input type="number" v-model="inputPage" @keydown.enter="jumpToPage" class="form-control" style="width: 70px; display: inline;">
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "PaginationVue",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      inputPage: 1,
    };
  },
  computed: {
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit("page-changed", this.currentPage - 1);
      }
    },
    nextPage() {
      /* console.log('nexpage', this.currentPage); */
      if (this.currentPage < this.totalPages) {
        this.$emit("page-changed", this.currentPage + 1);
      }
    },
    goToPage(page) {
      this.$emit("page-changed", page);
    },
    jumpToPage() {
      const pageNumber = parseInt(this.inputPage);
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.$emit("page-changed", pageNumber);
      }
    },
  }, 
};
</script>

<style scoped>
.pagination > .active > a,
.pagination > .active > a:focus,
.pagination > .active > a:hover,
.pagination > .active > span,
.pagination > .active > span:focus,
.pagination > .active > span:hover {
  background-color: #3b4952;
  border-color: #3b4952;
}

.pagination > li > a,
.pagination > li > span {
  color: #2c3840;
  margin: 0px 5px;
  border-radius: 3px;
  -webkit-box-shadow: 0px 1px 3px 0px rgba(44, 56, 64, 0.2);
  -moz-box-shadow: 0px 1px 3px 0px rgba(44, 56, 64, 0.2);
  box-shadow: 0px 1px 3px 0px rgba(44, 56, 64, 0.2);
  border: none;
  font-size: 16px;
}

.pagination > li > a:focus,
.pagination > li > a:hover,
.pagination > li > span:focus,
.pagination > li > span:hover {
  background-color: #2756ad;
  border-color: #e74c3c;
  color: #fff;
}

.pagination-wrap {
  width: 100%;
  float: left;
  margin-bottom: 35px;
}

.pagination {
  margin: 0px;
}
</style>
