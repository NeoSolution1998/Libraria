import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.VUE_APP_API_URL;

// Abort the previous list request so a slow response cannot overwrite newer filters.
let booksRequestController = null;
let booksRequestSequence = 0;

const cleanParams = (params) => {
    Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return params;
};

export const booksModule = {
  state: () => ({
    books: [],
    book: {},
    category: [],
    totalBooks: 0,
    totalPages: 0,
    currentPage: 1,
    perPage: 12,
    searchQuery: '',
    selectedCategory: '',
    selectedCategoryIds: [],
    authorName: '',
    sort: 'date_desc',
    sortByDate: '',
    sortByName: '',
    startDate: null,
    endDate: null,
    minRating: 0,
    selectedTags: [],
    categories: [],
    authors: [],
    categoriesLoading: false,
    authorsLoading: false,
    filterOptionsError: null,
    loading: false,
    error: null,
    bookLoading: false,
    bookError: null,
  }),

  getters: {
    books: state => state.books,
    totalBooks: state => state.totalBooks,
    totalPages: state => state.totalPages,
    currentPage: state => state.currentPage,
    book: state => state.book,
    category: state => state.category,
    searchQuery: state => state.searchQuery,
    selectedCategory: state => state.selectedCategory,
    selectedCategoryIds: state => state.selectedCategoryIds,
    authorName: state => state.authorName,
    sort: state => state.sort,
    sortByDate: state => state.sortByDate,
    sortByName: state => state.sortByName,
    startDate: state => state.startDate,
    endDate: state => state.endDate,
    minRating: state => state.minRating,
    selectedTags: state => state.selectedTags,
    categories: state => state.categories,
    authors: state => state.authors,
    categoriesLoading: state => state.categoriesLoading,
    authorsLoading: state => state.authorsLoading,
    filterOptionsError: state => state.filterOptionsError,
    loading: state => state.loading,
    error: state => state.error,
    bookLoading: state => state.bookLoading,
    bookError: state => state.bookError,
    activeFiltersCount: (state) => {
      return [
        state.selectedCategoryIds.length > 0 || Boolean(state.selectedCategory),
        Boolean(state.authorName),
        Boolean(state.startDate || state.endDate),
        state.minRating > 0,
        state.selectedTags.length > 0,
      ].filter(Boolean).length;
    },
  },

  mutations: {
    setBooks(state, books) {
      state.books = Array.isArray(books) ? books : [];
    },
    setTotalBooks(state, total) {
      state.totalBooks = Number(total) || 0;
    },
    setTotalPages(state, totalPages) {
      state.totalPages = Number(totalPages) || 0;
    },
    setCurrentPage(state, currentPage) {
      state.currentPage = Number(currentPage) || 1;
    },
    setPerPage(state, perPage) {
      state.perPage = Number(perPage) || 12;
    },
    setBook(state, book) {
      state.book = book && typeof book === 'object' ? book : {};
    },
    setCategory(state, category) {
      state.category = Array.isArray(category) ? category : [];
    },
    setSelectedCategory(state, category) {
      state.selectedCategory = category || '';
    },
    setSelectedCategoryIds(state, ids) {
      state.selectedCategoryIds = Array.isArray(ids)
        ? [...new Set(ids.map((id) => Number(id)).filter(Boolean))]
        : [];
      state.selectedCategory = '';
    },
    setAuthorName(state, name) {
      state.authorName = String(name || '');
    },
    setSort(state, sort) {
      state.sort = String(sort || 'date_desc');
    },
    setCategories(state, categories) {
      state.categories = Array.isArray(categories) ? categories : [];
    },
    setAuthors(state, authors) {
      state.authors = Array.isArray(authors) ? authors : [];
    },
    setCategoriesLoading(state, loading) {
      state.categoriesLoading = Boolean(loading);
    },
    setAuthorsLoading(state, loading) {
      state.authorsLoading = Boolean(loading);
    },
    setFilterOptionsError(state, error) {
      state.filterOptionsError = error || null;
    },
    setFilters(state, filters) {
      state.selectedCategoryIds = Array.isArray(filters.categoryIds)
        ? [...new Set(filters.categoryIds.map((id) => Number(id)).filter(Boolean))]
        : [];
      state.selectedCategory = '';
      state.authorName = String(filters.authorName || '');
      state.startDate = filters.startDate || null;
      state.endDate = filters.endDate || null;
      state.minRating = Math.min(5, Math.max(0, Number(filters.minRating) || 0));
      state.selectedTags = [];
    },
    clearFilters(state) {
      state.selectedCategoryIds = [];
      state.selectedCategory = '';
      state.authorName = '';
      state.startDate = null;
      state.endDate = null;
      state.minRating = 0;
      state.selectedTags = [];
      state.searchQuery = '';
      state.sort = 'date_desc';
    },
    setSearchQuery(state, query) {
      state.searchQuery = String(query ?? '');
    },
    setSortByDate(state, order) {
      state.sortByDate = order || '';
    },
    setSortByName(state, order) {
      state.sortByName = order || '';
    },
    setStartDate(state, date) {
      state.startDate = date || null;
    },
    setEndDate(state, date) {
      state.endDate = date || null;
    },
    setMinRating(state, rating) {
      state.minRating = Math.min(5, Math.max(0, Number(rating) || 0));
    },
    setSelectedTags(state, tags) {
      state.selectedTags = Array.isArray(tags)
        ? [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))]
        : [];
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.selectedCategoryIds = [];
      state.authorName = '';
      state.sort = 'date_desc';
      state.sortByDate = '';
      state.sortByName = '';
      state.startDate = null;
      state.endDate = null;
      state.minRating = 0;
      state.selectedTags = [];
    },
    setLoading(state, loading) {
      state.loading = Boolean(loading);
    },
    setError(state, error) {
      state.error = error;
    },
    setBookLoading(state, loading) {
      state.bookLoading = Boolean(loading);
    },
    setBookError(state, error) {
      state.bookError = error;
    },
  },

  actions: {
    async fetchBooks({ commit, state }, page = state.currentPage, perPage = state.perPage) {
      const sequence = ++booksRequestSequence;

      if (booksRequestController) {
        booksRequestController.abort();
      }
      const controller = new AbortController();
      booksRequestController = controller;

      commit('setLoading', true);
      commit('setError', null);

      try {
        const authToken = Cookies.get('auth_token') ?? '';

        const params = cleanParams({
          page,
          per_page: perPage,
          search: state.searchQuery || undefined,
          category: state.selectedCategory || undefined,
          category_ids: state.selectedCategoryIds.length > 0 ? state.selectedCategoryIds.join(',') : undefined,
          author: state.authorName || undefined,
          sort: state.sort || undefined,
          sortDate: state.sortByDate || undefined,
          sortName: state.sortByName || undefined,
          startDate: state.startDate || undefined,
          endDate: state.endDate || undefined,
          minRating: state.minRating > 0 ? state.minRating : undefined,
          tags: state.selectedTags.length > 0 ? state.selectedTags.join(',') : undefined,
        });

        const response = await axios.get(`${apiUrl}/api/v1/books`, {
          params,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (sequence !== booksRequestSequence) {
          return;
        }

        const data = response.data || {};

        commit('setBooks', data.books);
        commit('setCategory', data.category);
        commit('setTotalBooks', data.total_books);
        commit('setTotalPages', data.last_page ?? Math.ceil((data.total_books || 0) / (data.per_page || perPage)));
        commit('setCurrentPage', data.current_page ?? page);
        commit('setPerPage', data.per_page ?? perPage);
      } catch (error) {
        if (sequence !== booksRequestSequence) {
          return;
        }

        console.error('Ошибка при получении данных о книгах:', error);
        commit(
          'setError',
          error.response?.data?.message || 'Не удалось загрузить каталог книг. Попробуйте ещё раз.'
        );
      } finally {
        if (sequence === booksRequestSequence) {
          commit('setLoading', false);
        }
      }
    },

    async getBook({ commit }, bookId) {
      commit('setBookLoading', true);
      commit('setBookError', null);

      try {
        const authToken = Cookies.get('auth_token') ?? '';
        const response = await axios.get(`${apiUrl}/api/v1/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        });

        commit('setBook', response.data?.data || response.data);
      } catch (error) {
        const status = error.response?.status;
        commit('setBook', {});
        commit('setBookError', status === 401 ? 'auth' : status === 404 ? 'notfound' : 'network');
        console.error('Ошибка при получении книги:', error);
      } finally {
        commit('setBookLoading', false);
      }
    },

    async createBook({ commit }, bookData) {
      try {
        const authToken = Cookies.get('auth_token') ?? '';
        const formData = new FormData();

        // Add basic fields
        for (const key of ['title', 'author', 'description', 'author_bio', 'language', 'is_published']) {
          if (bookData[key] !== null && bookData[key] !== '') {
            formData.append(key, bookData[key]);
          }
        }

        // Add rating (0-10 scale, backend validates min:0|max:10)
        if (bookData.rating !== null && bookData.rating !== '') {
          formData.append('rating', bookData.rating);
        }

        // Add number_of_pages
        if (bookData.number_of_pages !== null && bookData.number_of_pages !== '') {
          formData.append('number_of_pages', bookData.number_of_pages);
        }

        // Add categories as array indices (Laravel expects categories[0], categories[1], etc.)
        if (Array.isArray(bookData.categories) && bookData.categories.length) {
          bookData.categories.forEach((catId, index) => {
            formData.append(`categories[${index}]`, catId);
          });
        }

        // Add cover_image if present
        if (bookData.cover_image instanceof File) {
          formData.append('cover_image', bookData.cover_image);
        }

        const response = await axios.post(`${apiUrl}/api/v1/books`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        });

        commit('setBook', response.data?.data || response.data);
      } catch (error) {
        console.error('Ошибка при создании книги:', error);
        throw error.response?.data || error;
      }
    },

    async fetchCategories({ commit }) {
      commit('setCategoriesLoading', true);
      commit('setFilterOptionsError', null);

      try {
        const response = await axios.get(`${apiUrl}/api/v1/categories`, {
          headers: { Accept: 'application/json' },
        });
        const categories = response.data?.categories ?? response.data?.data ?? response.data;
        commit('setCategories', Array.isArray(categories) ? categories : []);
      } catch (error) {
        commit('setFilterOptionsError', 'Не удалось загрузить категории.');
        console.error('Ошибка при получении категорий:', error);
      } finally {
        commit('setCategoriesLoading', false);
      }
    },

    async fetchAuthors({ commit }) {
      commit('setAuthorsLoading', true);
      commit('setFilterOptionsError', null);

      try {
        const response = await axios.get(`${apiUrl}/api/v1/books/authors`, {
          headers: { Accept: 'application/json' },
        });
        commit('setAuthors', Array.isArray(response.data?.authors) ? response.data.authors : []);
      } catch (error) {
        commit('setFilterOptionsError', 'Не удалось загрузить авторов.');
        console.error('Ошибка при получении авторов:', error);
      } finally {
        commit('setAuthorsLoading', false);
      }
    },

    async fetchFilterOptions({ dispatch }) {
      await Promise.allSettled([
        dispatch('fetchCategories'),
        dispatch('fetchAuthors'),
      ]);
    },

    initializeStateFromURL({ commit, dispatch }) {
      const url = new URL(window.location.href);
      const page = parseInt(url.searchParams.get('page')) || 1;
      const searchQuery = url.searchParams.get('search') || '';
      const selectedCategory = url.searchParams.get('category') || '';
      const sortByDate = url.searchParams.get('sortDate') || '';
      const sortByName = url.searchParams.get('sortName') || '';
      const startDate = url.searchParams.get('startDate') || null;
      const endDate = url.searchParams.get('endDate') || null;
      const minRating = parseInt(url.searchParams.get('minRating')) || 0;
      const selectedTags = url.searchParams.get('tags') ? url.searchParams.get('tags').split(',') : [];

      commit('setCurrentPage', page);
      commit('setSearchQuery', searchQuery);
      commit('setSelectedCategory', selectedCategory);
      commit('setSortByDate', sortByDate);
      commit('setSortByName', sortByName);
      commit('setStartDate', startDate);
      commit('setEndDate', endDate);
      commit('setMinRating', minRating);
      commit('setSelectedTags', selectedTags);

      return dispatch('fetchBooks', page);
    },
  },

  namespaced: true,
};
