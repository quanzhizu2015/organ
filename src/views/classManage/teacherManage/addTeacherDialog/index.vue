<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="30%"
    center
  >
    <div slot="title">绑定教师</div>
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="教师账号" prop="mobilePhone">
         <el-input
            v-model="from.mobilePhone"
            placeholder="请输入教师账号"
          ></el-input>
      </el-form-item>
     
    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">绑定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ossClient from "@/utils/aliyun.oss.client";
import AliImageUpload from "@/components/Upload/aliImageUpload.vue";
export default {
  components: {
    AliImageUpload,
  },
  name: "AddTeacherDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 0, //1新增  0编辑
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
 
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    open() {
      //console.log(this.editItem)
      if (this.isAdd) {
        this.from = {
          mobilePhone: "",
        };
      } else {
        this.from = {
          mobilePhone: this.editItem.mobilePhone,
        };
      }
    },
    confirm() {
      if (this.isAdd) {
        this.add();
      } else {
        this.edit();
      }
    },

    handleClose() {
      this.$emit("update:visible", false);
    },

    // api
    add() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.API.teacher.insert, this.from)
            .then((res) => {
              if (res) {
                this.$message({
                  message: "绑定教师成功",
                  type: "success",
                });
                this.$emit("addSuccess");
              }
            })
            .catch(() => {});
        } else {
        }
      });
    },

    edit() {
      this.$axios
        .post(this.API.teacher.update, this.from)
        .then((res) => {
          this.$message({
            message: "修改科目成功",
            type: "success",
          });
          this.$emit("addSuccess");
        })
        .catch(() => {});
    },
  },
  data() {
    return {
      from: {
        mobilePhone: "",
      },
      rules: {
        mobilePhone: [
          { required: true, message: "请输入教师账号", trigger: "blur" },
        ],
      },
    };
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="scss" scoped>
@import "./addTeacherDialog.scss";
</style>