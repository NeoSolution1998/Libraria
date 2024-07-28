<template>
  <header-vue></header-vue>

  <div><profile-vue :user="user"></profile-vue></div>

  <footer-vue></footer-vue>
</template>
<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {
  data() {
    return {
      user: {}
    }
  },
  methods: {
    async getUser() {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get("http://127.0.0.1:8000/api/v1/auth/user" , {
          params: {},
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("USER", response.data);
        this.user = response.data
      } catch (e) {
        console.error(e);
      }
    },
  },
  mounted() {
    this.getUser();
  },
};
</script>
<style scoped></style>
