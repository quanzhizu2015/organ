<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="55%"
    height="500"
    center
  >
    <div slot="title">
      {{ type == 1 ? "上传图片" : type == 2 ? "上传视频" : "上传文档" }}
    </div>
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="选择分类" required>
        <el-col :span="15">
          <el-select v-model="from.catoryValue" placeholder="请选择分类">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item v-show="type == 1" label="上传图片" required>
        <el-col class="header-img" :span="10">
          <AliImageUpload
            :imageUrl.sync="from.url"
            @files="files"
            :isCheckSize="true"
            :configUrl="API.upLoadImageApi.upLoadImageConfig"
          />
        </el-col>
      </el-form-item>
      <el-form-item v-show="type == 2" label="上传视频" required>
        <AliOssMultiVideos
          ref="upload"
          @input="getVideo"
          :image="image"
          :isCheckSize="isCheckSize"
        />
      </el-form-item>
      <el-form-item v-show="type == 3" label="上传文件" required>
        <AliOssUploadFiles
          ref="uploadFile"
          :image="image"
          @update="getFiles"
          :isCheckSize="isCheckSize"
        />
      </el-form-item>
    </el-form>
    <div style="height: 4rem"></div>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AliImageUpload from "@/components/Upload/aliImageUpload.vue";
import AliOssMultiVideos from "@/components/Upload/AliOssMultiVideos";
import AliOssUploadFiles from "@/components/Upload/AliOssUploadFiles";
export default {
  components: {
    AliImageUpload,
    AliOssMultiVideos,
    AliOssUploadFiles,
  },
  name: "UpLoadImageDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isCheckSize: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1, //1 图片  2 视频  3 文档
    },
  },

  methods: {
    close() {
      this.$emit("update:visible", false);
      this.$refs.upload.clearFiles();
      this.$refs.uploadFile.clearFiles();
    },
    open() {
      (this.from.catoryValue = 0), (this.from.files.url = "");
      this.from.url = "";
      this.image = [];
      (this.data = { title: "", url: "", size: "", img: "", timeLenght: "" }),
        this.getGroup();
    },
    getVideo(params) {
      console.log(params);
      this.data.url = params.url;
      this.data.img = params.img;
      this.data.timeLenght = params.timeLenght;
      this.data.size = params.size;
      this.from.files.size = params.size;
      this.from.files.url = params.url;
      this.from.files.name = params.title;
    },
    getFiles(params) {
      this.from.files = params;
    },
    confirm() {
      this.add();
    },

    handleClose() {
      this.$emit("update:visible", false);
      this.$refs.upload.clearFiles();
      this.$refs.uploadFile.clearFiles();
    },

    getGroup() {
      this.$axios
        .get(this.API.newNetSchool.material.groupSelect, {
          params: { name: "", type: this.type },
        })
        .then((res) => {
          this.options = res.data;
        });
    },
    files(items) {
      this.from.files = items;
      console.log("files" + JSON.stringify(items));
    },

    // api
    add() {
      if (this.from.catoryValue == null) {
        this.$message.error("请选择分组");
        return true;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.from.files.url) {
            //1 图片  2 视频  3 文档
            let tipStr =
              this.type == 1
                ? "请上传图片"
                : this.type == 2
                ? "请上传视频"
                : "请上传文档";
            this.$message.error(tipStr);
            return;
          }

          this.$axios
            .post(this.API.newNetSchool.material.add, {
              groupId: this.from.catoryValue,
              size: Math.floor(this.from.files.size / 1024),
              title: this.from.files.name,
              type: this.type,
              url: this.from.files.url,
            })
            .then((res) => {
              if (res) {
                this.$emit("update:visible", false);
                this.$emit("addSuccess", this.type);
                let tipStr =
                  this.type == 1
                    ? "添加图片成功"
                    : this.type == 2
                    ? "添加视频成功"
                    : "添加文档成功";
                this.$message({
                  message: tipStr,
                  type: "success",
                });
              }
            });
        }
      });
    },
  },
  data() {
    return {
      options: [],
      from: {
        catoryValue: 0,
        url: "",
        files: {
          url: "",
          size: 1,
          name: "",
        },
      },
      data: { title: "", url: "", size: "", img: "", timeLenght: "" },
      image: [],
      rules: {
        catoryValue: [{ required: true, message: "选择分类", trigger: "blur" }],
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
@import "./upLoadImageDialog.scss";

::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
</style>