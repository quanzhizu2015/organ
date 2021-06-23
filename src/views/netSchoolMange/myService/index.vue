<template>
  <div>
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
    };
  },

  created() {
    this.serverDate();
  },

  methods: {
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