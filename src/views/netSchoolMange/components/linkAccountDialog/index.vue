<template>
  <div class="sdialog">
    <el-dialog
      width="55%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">绑定账号</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "LinkAccountDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 1,
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      imageName: "",
      ruleForm: {
        account: "",
        password: "",
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    open() {
      this.ruleForm.account = "";
      this.ruleForm.password = "";
      if (this.isAdd) {
      } else {
      }
    },
    doAdding() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let param = {
            mobilePhone: this.ruleForm.account,
            password: this.ruleForm.password,
          };
          let url = this.API.newNetSchool.school.bind;
          //   if(!this.isAdd){
          //       url = this.API.newNetSchool.school.change
          //   }
          this.$confirm("是否需要绑定该账号?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$axios.post(url, param).then((res) => {
                if (res) {
                  this.$emit("addSuccess");
                  this.$message({
                    type: "success",
                    message: "绑定成功!",
                  });
                  //localStorage.setItem("currentSchoolId", "123");
                  if (!this.isAdd) {
                    this.$router.push({ path: "/login" });
                  }
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
        } else {
          return false;
        }
      });
    },

    onClose() {
      this.$emit("update:visible", false);
    },

    //API
  },
};
</script>


<style lang="scss" scoped>
@import "./linkAccountDialog.scss";
.catory {
  width: 30%;
  height: 20rem;
  padding: 1rem;
  overflow-y: auto;
}
.imageTableContain {
  width: 70%;
  height: 20rem;
}
.imageTable {
  height: 90%;
  overflow-y: auto;
}
.catoryItem {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.3rem 0rem 0rem 0rem;
  span {
    margin-left: 0.2rem;
  }
}
.fileFolder {
  width: 1rem;
  height: 1rem;
}
/deep/ .has-gutter {
  .el-checkbox {
    display: none;
  }
}
::v-deep .el-dialog__footer {
  text-align: center !important;
}
</style>