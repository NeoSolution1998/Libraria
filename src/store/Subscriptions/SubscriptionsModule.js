import axios from 'axios';
import Cookies from 'js-cookie';

export const SubscriptionsModule = {
  state: () => ({
    subscriptions: [],
  }),

  getters: {
    subscriptions: state => state.subscriptions,
  },

  mutations: {
    setSubscriptions(state, subscriptions) {
      state.subscriptions = subscriptions;
    },
  },

  actions: {
    async getSubscriptions({ commit, state, rootState }) {
        try {
            console.log(11111111111111);
            
            const authToken = Cookies.get("auth_token") ?? "";
        const apiUrl = `${process.env.VUE_APP_API_URL}/api/v1/subscriptions/`;

            const response = await axios.get(apiUrl, {
                params: {

                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            console.log('sadsadsad');
            
            commit('setSubscriptions', response.data.data.slice(0, 3));
        } catch (e) {
            console.error(e);
        }
    },
  },
  namespaced: true,
};