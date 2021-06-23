<template>
  <el-dialog
    title="轮播设置"
    width="90%"
    top="10px"
    :visible="visible"
    :close-on-click-modal="false"
    class="addDialog"
    @close="onClose"
  >
    <el-form
      ref="form"
      v-loading="isLoading"
      :model="data"
      label-position="left"
      label-width="140px"
    >
      <el-form-item label="标题">
        <el-input v-model="data.title" placeholder="请输入" class="classInput" />
      </el-form-item>
      <el-form-item label="上传图片">
        <LocalUpload ref="upload" :image="image" @upload="upImg" :tips="tip" />
      </el-form-item>
      <el-form-item label="图文详情">
        <Tinymce ref="desc" v-model="data.desc" height="150" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="doAdding">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Tinymce from "@/components/Tinymce/index";
import LocalUpload from "@/components/Upload/LocalUpload";
export default {
  name: "EditArticalDialog",
  components: { Tinymce, LocalUpload },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      tip: "（建议尺寸1005*396）",
      banner: {},
      data: {
        title: "",
        desc: "",
        url: "",
      },
      image: [],
      index: 0,
      type: 0, // 0为新增，1为编辑
    };
  },
  created() {
    this.$on("editMess", (params) => {
      this.banner = params.banner;
      this.type = params.type;
      if (parseInt(params.type) === 1) {
        this.data = JSON.parse(params.banner.json)[params.index];
        this.index = params.index;
        this.image = [];
        this.image.push({ url: this.data.url });
      } else {
        this.data = { title: "", desc: "", url: "" };
        this.image = [];
      }
      this.$nextTick(() => {
        this.$refs["desc"].$emit("desc", this.data.desc);
      });
    });
  },
  methods: {
    doAdding() {
      if (this.data.url == "") {
        this.$message.warning("图片不能为空");
        return;
      }
      if (this.data.title == "") {
        this.$message.warning("标题不能为空");
        return;
      }
      if (this.data.desc == "") {
        this.$message.warning("图文详情不能为空");
        return;
      }
      this.isLoading = true;
      const bannerJson = JSON.parse(this.banner.json);
      if (parseInt(this.type) === 1) {
        bannerJson[this.index] = this.data;
      } else {
        bannerJson.push(this.data);
      }
      this.banner.json = JSON.stringify(bannerJson);
      this.$axios
        .post("train/schoolWeb/update", this.banner)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.$emit("update", { lists: bannerJson });
            if (parseInt(this.type) === 1) {
              this.$message.success("已修改成功");
            } else {
              this.$message.success("新增成功");
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
          this.onClose();
        });
    },
    onClose() {
      this.image = [];
      this.$refs["upload"].$emit("clear");
      this.$emit("close");
    },
    upImg(url) {
      this.data.url = url;
    },
  },
};
</script>
<style scoped>
/* .addDialog >>> .el-upload--picture-card,
.addDialog >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 100%;
} */
</style>

