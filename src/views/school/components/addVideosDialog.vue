<template>
  <el-dialog
    title="机构视频设置"
    width="600px"
    :visible="visible"
    :close-on-click-modal="false"
    class="videoDialog"
    @close="onClose"
  >
    <el-form
      ref="form"
      v-loading="isLoading"
      :model="data"
      label-position="left"
      label-width="140px"
    >
      <el-form-item label="视频名称">
        <el-input v-model="data.title" placeholder="请输入" class="classInput" />
      </el-form-item>
      <el-form-item label="上传视频">
        <AliOssMultiVideos ref="upload" @input="getVideo" :image="image" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="doAdding">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AliOssMultiVideos from "@/components/Upload/AliOssMultiVideos";
export default {
  name: "AddVideosDialog",
  components: { AliOssMultiVideos },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      comVideo: {},
      data: { title: "", url: "", size: "", img: "", timeLenght: "" },
      image: [],
    };
  },
  created() {
    this.$on("addVideo", (params) => {
      this.comVideo = params;
      this.image = [];
    });
  },
  methods: {
    doAdding() {
      if (this.data.title === "") {
        this.$message.warning("请填写视频名称");
        return;
      }
      if (this.data.url === "") {
        this.$message.warning("视频还在上传中，请稍后");
        return;
      }

      this.isLoading = true;
      const videoJson = JSON.parse(this.comVideo.json);
      videoJson.unshift(this.data);
      this.comVideo.json = JSON.stringify(videoJson);
      this.$axios
        .post("train/schoolWeb/update", this.comVideo)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.$emit("upload", videoJson);
            this.$message.success("视频新增成功");
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
          this.onClose();
        });
    },
    onDeting(index) {
      this.$confirm("此操作将删除该照片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.imgLists.splice(index, 1);
      });
    },
    onClose() {
      this.$refs["upload"].$emit("clear");
      this.$emit("close");
      this.data = { title: "", url: "", size: "", img: "", timeLenght: "" };
    },
    getVideo(params) {
     
      this.data.url = params.url;
      this.data.img = params.img;
      this.data.timeLenght = params.timeLenght;
      this.data.size = params.size;
    },
  },
};
</script>
<style scoped>
.flex-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.list {
  width: 60px;
  height: 60px;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
}
.list .del {
  position: absolute;
  bottom: 5px;
  right: 5px;
  cursor: pointer;
  font-size: 20px;
  color: #fff;
}

.videoDialog >>> .el-upload--picture-card i {
  font-size: 20px;
}

.videoDialog >>> .el-dialog__body {
  max-height: 550px;
  overflow: auto;
}
</style>

