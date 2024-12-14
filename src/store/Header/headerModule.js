export const headerModule = {
  state: () => ({
    logoSrc: "/images/logo.png",
    defaultAvatar: "/images/default-avatar.png",
  }),

  getters: {
    user: state => state.user,

  },

  mutations: {

  },

  actions: {
    
  },
  namespaced: true
};
