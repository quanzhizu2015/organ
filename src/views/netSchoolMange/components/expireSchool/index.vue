<template>
  <div class="wrap flex row ai-c jc-c">
    <div class="open_bg">
      <img class="w-p100" src="@/assets/school/expired_bg.png" />
      <div class="open_contain flex column jc-c">
        <div class="h-8"></div>
        <div class="mt-5" @click="goBuy">
          <img class="w-8" src="@/assets/school/expiredButton.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBuy() {
      this.$router.push({ path: "/productPage" });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: #fff;
  padding: 2rem 5rem 2rem 2rem;
  overflow-y: auto;
  z-index: 19999;
  .open_bg {
    width: 33rem;
    position: relative;
  }
  .open_contain {
    position: absolute;
    padding: 1rem;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    .open_title {
      width: 15rem;
    }
    .cancelButton {
      width: 6rem;
      cursor: pointer;
    }
    .confirmButton {
      width: 6rem;
      cursor: pointer;
    }
  }
}
</style>

