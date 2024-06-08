<template>
  <div class="pagination-wrap">
    <nav class="pagination-outer" aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" @click="goToPage(1)" aria-label="First">
            <span aria-hidden="true">«</span>
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="prevPage" aria-label="Previous">
            <span aria-hidden="true">Назад</span>
          </a>
        </li>
        <li class="page-item" v-for="page in pagesToShow" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" @click="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="nextPage" aria-label="Next">
            <span aria-hidden="true">Вперед</span>
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="goToPage(totalPages)" aria-label="Last">
            <span aria-hidden="true">»</span>
          </a>
        </li>
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
      inputPage: this.currentPage,
    };
  },
  computed: {
    pagesToShow() {
      const range = [];
      const start = Math.max(1, this.currentPage - 1);
      const end = Math.min(this.totalPages, this.currentPage + 3);

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      return range;
    },
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit("page-changed", this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("page-changed", this.currentPage + 1);
      }
    },
    goToPage(page) {
      this.$emit("page-changed", page);
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
  margin: 0 5px;
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
  margin: 0;
}

.pagination-outer {
  text-align: center;
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
}

.pagination:before {
  content: "";
  width: 100%;
  height: 2px;
  background: #e8e8e8;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.pagination li a.page-link {
  padding: 5px 10px;
  margin: 5px;
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  box-shadow: 0 8px 6px -9px #5b5f5f;
  font-size: 17px;
  color: #686c6c;
}

.pagination li.active a.page-link,
.pagination li a.page-link:hover {
  background: #2b4157;
  border-color: #34485b;
  color: #fff;
}

@media only screen and (max-width: 479px) {
  .pagination {
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .pagination li {
    display: inline-block;
  }
  .pagination li a.page-link {
    font-size: 14px;
    padding: 4px 10px;
    margin: 2px;
  }
}
</style>
