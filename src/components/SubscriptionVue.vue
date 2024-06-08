<template>
  <section class="pricing">
    <section class="pricing-section">
      <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-xl-5 col-lg-6 col-md-8">
          <div class="section-title text-center title-ex1">
            <h2>Выберите план подписки</h2>
            <p>Inventore cillum soluta inceptos eos platea, soluta class laoreet repellendus imperdiet optio.</p>
          </div>
        </div>
      </div>

      <!-- Pricing Table starts -->
      <div class="row">
        <div class="col-md-3" v-for="subscription in subscriptions">
          <div class="price-card featured">
            <h2>{{subscription.name}}</h2>
            <p>Most popular choice</p>
            <p class="price"><span>{{subscription.price}}</span>/ Month</p>
            <ul class="pricing-offers">
              <li>6 Domain Names</li>
              
              <li>10GB Disk Space</li>
              <li>Monthly Bandwidth</li>
              <li>Powerful Admin Panel</li>
            </ul>
            <a href="#" @click.prevent="showDialog" class="btn btn-primary btn-mid">Buy Now</a>
          </div>
        </div>
      </div>
    </div>

    
  </section>
    <DialogVue :show="showDialog" @update:show="showDialog = $event">
      <div class="row">
        <input-vue class="col-mg-6"></input-vue>
        <input-vue class="col-mg-6"></input-vue>
        <button-vue>BUY</button-vue>
      </div>
    </DialogVue>
  </section>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {
  name: "SubscriptionVue",
  data() {
    return {
      showDialog: false,
      subscriptions: [],
    };
  },
  methods: {
    async getSubscriptions() {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get("http://127.0.0.1:8000/api/v1/subscriptions/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        this.subscriptions = response.data.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
  mounted() {
    this.getSubscriptions();
  },
};
</script>

<style scoped>
body{margin-top:20px;}
.section-title {
    position: relative;
}
.section-title h2 {
    color: #1d2025;
    position: relative;
    margin: 0;
    font-size: 24px;
}
@media (min-width: 768px) {
    .section-title h2 {
        font-size: 28px;
    }
}
@media (min-width: 992px) {
    .section-title h2 {
        font-size: 34px;
    }
}
.section-title.title-ex1 h2 {
    padding-bottom: 20px;
}
@media (min-width: 768px) {
    .section-title.title-ex1 h2 {
        padding-bottom: 30px;
    }
}
@media (min-width: 992px) {
    .section-title.title-ex1 h2 {
        padding-bottom: 40px;
    }
}
.section-title.title-ex1 h2:before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 12px;
    width: 110px;
    height: 1px;
    background-color: #d6dbe2;
}
@media (min-width: 768px) {
    .section-title.title-ex1 h2:before {
        bottom: 17px;
    }
}
@media (min-width: 992px) {
    .section-title.title-ex1 h2:before {
        bottom: 25px;
    }
}
.section-title.title-ex1 h2:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 12px;
    width: 40px;
    height: 1px;
    background-color: #0cc652;
}
@media (min-width: 768px) {
    .section-title.title-ex1 h2:after {
        bottom: 17px;
    }
}
@media (min-width: 992px) {
    .section-title.title-ex1 h2:after {
        bottom: 25px;
    }
}
.section-title.title-ex1.text-center h2:before {
    left: 50%;
    transform: translateX(-50%);
}
.section-title.title-ex1.text-center h2:after {
    left: 50%;
    transform: translateX(-50%);
}
.section-title.title-ex1.text-right h2:before {
    left: auto;
    right: 0;
}
.section-title.title-ex1.text-right h2:after {
    left: auto;
    right: 0;
}
.section-title.title-ex1 p {
    font-family: "Montserrat", sans-serif;
    color: #8b8e93;
    font-size: 14px;
    font-weight: 300;
}


.price-card {
    background: #f5f5f6;
    padding: 40px 35px;
    position: relative;
    border-radius: 2px;
    overflow: hidden;
}
.price-card:before {
    position: absolute;
    content: "";
    top: 0;
    right: -35px;
    width: 88px;
    height: 88px;
    background: #0cc652;
    opacity: 0.2;
    border-radius: 8px;
    transform: rotate(45deg);
}
.price-card:after {
    position: absolute;
    content: "";
    top: 30px;
    right: -35px;
    width: 88px;
    height: 88px;
    background: #0cc652;
    opacity: 0.2;
    border-radius: 8px;
    transform: rotate(45deg);
}
.price-card h2 {
    font-size: 26px;
    font-weight: 600;
}
.price-card .btn {
    font-size: 11px;
    border-radius: 100px;
    padding: 0 25px;
    border: 0;
    color: #fff;
    float: right;
}
.price-card .btn.btn-primary {
    border: 0 !important;
}
.price-card.featured {
    background: #fff;
    border: 1px solid #ebebeb;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
.price-card:hover .btn {
    background: #0cc652;
    border-color: #0cc652;
}
p.price span {
    display: inline-block;
    padding: 45px 15px 50px;
    padding-right: 0;
    font-size: 50px;
    font-weight: 600;
    color: #0cc652;
    position: relative;
}
p.price span:before {
    position: absolute;
    content: "$";
    font-size: 16px;
    top: 25px;
    font-weight: 300;
    left: 0;
}
.pricing-offers {
    padding: 0 0 10px;
}
.pricing-offers li {
    padding: 0 0 16px;
    line-height: 18px;
}
ul li {
    list-style-type: none;
}
.btn.btn-mid {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
}
</style>
