import axios from 'axios';
import Cookies from 'js-cookie';

export const paginationModule = {
  state: () => ({
    totalPages: 0,
    currentPage: 1,
  }),
  getters: {

  },
  mutations: {

  },
  actions: {
    handlePageChanged(pageNumber) {
      console.log("Страница которая отправляется в запрос", pageNumber);
      this.fetchBooks();
      $store.state.pagination.currentPage = pageNumber;
    },
  },

};
