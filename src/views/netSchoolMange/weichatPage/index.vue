<template>
  <div>
    <div class="ptd-1 plr-2">
      <el-button type="primary" @click="onBuy">立即购买</el-button>
    </div>

    <div class="plr-2">
      <span class="tx-1 tx-wb txc-60"> 开通微信小程序须知： </span>
      <br />
      <span> 1、开通微信小程序前提是拥有一个企业主体的微信小程序 </span>
      <br />
      <span>
        2、根据微信相关规定，微信小程序所运营的服务需与微信小程序类目对应，否则无法通过微信审核
      </span>
      <div v-for="item in images" :key="item">
        <img class="w-p100" :src="item" />
      </div>
    </div>

    <ExpireSchoolPage v-show="expired"></ExpireSchoolPage>
  </div>
</template>

<script>
import ExpireSchoolPage from "@/views/netSchoolMange/components/expireSchool";
export default {
  components: {
    ExpireSchoolPage,
  },
  data() {
    return {
      expired: false,
      images: [
        "/img/1.jpg",
        "/img/2.jpg",
        "/img/3.jpg",
        "/img/4.jpg",
        "/img/5.jpg",
        "/img/6.jpg",
        "/img/7.jpg",
        "/img/8.jpg",
      ],
    };
  },

  created() {
    this.serverDate();
  },

  methods: {
    onBuy() {
      this.$router.push("/productPage");
    },
    serverDate() {
      this.$axios
        .get(this.API.newNetSchool.schoolPage.serverDate)
        .then((res) => {
          if (res) {
            if (res.code == 0) {
              if (res.data.expire) {
                this.expired = true;
              } else {
                this.expired = false;
              }
            }
          }
        });
    },
  },
};
</script>


<style lang="scss" scoped>
</style>