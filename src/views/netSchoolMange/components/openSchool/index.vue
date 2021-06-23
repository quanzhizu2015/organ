<template>
  <div class="wrap flex row ai-c jc-c">
    <div class="open_bg">
      <!-- <div class="ta-c w-p100 mt-2">
        <span class="tx-09 tx-wb"
          >尚未开通账号，可以选择免费试用，也可以联系客服够买正式账号，如果您已有账号请关联后再使用，谢谢！</span
        >
      </div>

      <div class="pd-2 ta-c w-p100">
        <el-button type="primary" @click="openSchool">免费试用</el-button>
        <el-button type="primary" @click="linkAccount">绑定账号</el-button>
      </div> -->
      <img class="w-p100" src="@/assets/school/open_bg.png" />
      <div class="open_contain flex column jc-c">
        <div class="h-8"></div>
        <img class="open_title" src="@/assets/school/open_title.png" />
        <div class="pd-1 ta-c w-p100 flex row">
          <div class="cancelButton" @click="openSchool">
            <img class="w-p100" src="@/assets/school/cancelButton.png" />
          </div>
          <div class="confirmButton" @click="linkAccount">
            <img class="w-p100" src="@/assets/school/confirmButton.png" />
          </div>
        </div>
      </div>
    </div>
    <LinkAccountDialog
      :visible.sync="visible"
      :isAdd="0"
      @addSuccess="addSuccess"
    ></LinkAccountDialog>
  </div>
</template>
<script>
import LinkAccountDialog from "../linkAccountDialog/index";
export default {
  components: {
    LinkAccountDialog,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openSchool() {
      this.$confirm("此操作成功后需要重新登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(this.API.newNetSchool.school.open, {})
            .then((res) => {
              if (res) {
                this.$message({
                  type: "success",
                  message: "开通成功!",
                });
                localStorage.setItem("currentSchoolId", "123");
                this.$router.push({ path: "/login" });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    linkAccount() {
      this.visible = true;
    },
    addSuccess() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;

  background-color: #fff;
  padding: 2rem 5rem 2rem 2rem;
  overflow-y: auto;
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

