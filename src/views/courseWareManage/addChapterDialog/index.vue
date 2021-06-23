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
    <div slot="title">{{ isAdd ? "新增章节" : "编辑章节" }}</div>
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="章节名称" prop="title">
        <el-col :span="15">
          <el-input
            v-model="from.title"
            placeholder="请输入章节名称"
            maxlength="24"
          ></el-input>
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
  name: "AddChapterDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 0, //1新增章节
    },
    classObject: {
      type: Object,
      default: () => {
        return {};
      },
    },
    course: {
      type: Object,
      default: () => {
        return {};
      },
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
          let params = {
            classId: this.classObject.id,
            parentId: this.course.id,
            title: this.from.title,
          };
          this.$axios
            .post(this.API.courseWare.insert, params)
            .then((res) => {
              if (res) {
                this.$message({
                  message: "新增章节成功",
                  type: "success",
                });
                this.$emit("update:visible", false);
                this.$emit("addSuccess");
              }
            })
            .catch(() => {})
            .finally(() => {});
        } else {
        }
      });
    },

    edit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.editItem.id,
            title: this.from.title,
          };
          this.$axios
            .post(this.API.courseWare.update, params)
            .then((res) => {
              if (res) {
                this.$message({
                  message: "修改章节成功",
                  type: "success",
                });
                this.$emit("update:visible", false);
                this.$emit("addSuccess");
              }
            })
            .catch(() => {})
            .finally(() => {});
        } else {
        }
      });
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
        title: [{ required: true, message: "请输入章节名称", trigger: "blur" }],
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
@import "./addChapterDialog.scss";
</style>