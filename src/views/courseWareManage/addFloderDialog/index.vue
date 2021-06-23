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
    <div slot="title">{{isAdd?"新增文件夹":"编辑文件夹"}}</div>
    <el-form
      label-width="120px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="文件夹名称" prop="title">
        <el-col :span="15">
          <el-input
            v-model="from.title"
            placeholder="请输入文件夹名称"
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
  name: "AddFloderDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 0, //1新建文件夹
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
        };
      } else {
        this.from = {
          title: this.editItem.folderName,
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
            // classId: this.classObject.id,
            // parentId: this.course.id,
            courseId2: this.editItem.id,
            folderName: this.from.title,
          };
          this.$axios
            .post(this.API.folder.insert, params)
            .then((res) => {
              if(res){
                this.$message({
                message: "新增文件夹成功",
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
            // classId: this.classObject.id,
            // parentId: this.course.id,
            id: this.editItem.id,
            folderName: this.from.title,
          };
          this.$axios
            .post(this.API.folder.update, params)
            .then((res) => {
              if (res) {
                this.$message({
                  message: "修改文件夹成功",
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
@import "./addFloderDialog.scss";
</style>