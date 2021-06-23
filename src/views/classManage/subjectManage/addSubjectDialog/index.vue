<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="40%"
    center
  >
    <div slot="title">新增</div>
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="科目名称" prop="title">
        <el-col :span="15">
          <el-input
            v-model="from.title"
            maxlength="24"
            placeholder="请输入科目名称"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="上传logo" required>
        <el-col class="header-img" :span="16">
          <AliImageUpload
            :imageUrl.sync="from.url"
            :configUrl="API.upLoadImageApi.upLoadImageConfig"
          />
        </el-col>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
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
  name: "AddSubjectDialog",
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
          title: "",
          url: "",
        };
      } else {
        this.from = {
          title: this.editItem.title,
          url: this.editItem.url,
          id: this.editItem.id,
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
          if (!this.from.url) {
            this.$message.error("请上传科目封面");
            return;
          }
          this.$axios
            .post(this.API.course.addSubject, this.from)
            .then((res) => {
              if (res) {
                this.$message({
                  message: "新增科目成功",
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
        .post(this.API.course.updateSubject, this.from)
        .then((res) => {
          if (res) {
            this.$message({
              message: "修改科目成功",
              type: "success",
            });
            this.$emit("addSuccess");
          }
        })
        .catch(() => {});
    },
  },
  data() {
    return {
      from: {
        title: "",
        url: "",
        id: 0,
      },
      rules: {
        title: [{ required: true, message: "请输入科目名称", trigger: "blur" }],
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
@import "./addSubjectDialog.scss";
</style>