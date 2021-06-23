<template>
  <section class="courseItemwrap">
    <el-col :span="12">
      <div
        v-if="fileType(item.fileType) == 'image'"
        class="demo-image__preview content-item"
        @click="showImageAction()"
      >
        <span
          style="
            float: left;
            font-weight: bold;
            font-size: 14px;
            color: #2c8df4;
          "
          >{{ "【" + getFileType(item.fileType) + "】" + item.title }}</span
        >
      </div>
      <div
        class="content-item"
        v-else-if="fileType(item.fileType) == 'video'"
        @click="openVideo"
      >
        <span
          style="
            float: left;
            font-weight: bold;
            font-size: 14px;
            color: #2c8df4;
          "
          >{{ "【" + getFileType(item.fileType) + "】" + item.title }}</span
        >
      </div>

      <a v-else :href="item.url">
        <span
          style="
            float: left;
            font-weight: bold;
            font-size: 14px;
            color: #2c8df4;
          "
          >{{ "【" + getFileType(item.fileType) + "】" + item.title }}</span
        >
        <!-- <ArtPdf :pdfUrl="item.url" /> -->
      </a>
    </el-col>
    <el-col class="header" :span="12">
      <el-button type="text" size="small" @click="resetItem()"
        >重新上传</el-button
      >
      <el-button type="text" size="small" @click="delItem()">删除</el-button>
    </el-col>
    <el-image-viewer
      v-if="showImage"
      :on-close="closeViewer"
      :url-list="[item.url]"
    >
    </el-image-viewer>
    <ArtVideoPlayer
      :url="item.url"
      :title="item.title"
      :visible.sync="isShowVideo"
    />
    <AddItemCourseDialog
      :isAdd="isAddCourse"
      :visible.sync="isVisibleCourse"
      :editItem="item"
      :classObject="classObject"
      :course="course"
      @addSuccess="addSuccess"
    />
  </section>
</template>

<script>
import AddItemCourseDialog from "../addItemCourseDialog";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import ArtVideoPlayer from "@/components/ArtVideoPlayer";
import ArtPdf from "@/components/ArtPdf";
export default {
  components: {
    AddItemCourseDialog,
    ElImageViewer,
    ArtVideoPlayer,
    ArtPdf,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
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
  },
  methods: {
    handleChange() {},
    showImageAction() {
     // console.log("aaaaaa");
      this.showImage = true;
    },
    closeViewer() {
      this.showImage = false;
    },
    openVideo() {
      this.isShowVideo = true;
    },
    delItem() {
      this.$confirm("此操作将永久删除该课件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.delete();
      });
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消删除",
      //   });
      // });
    },
    resetItem() {
      this.isAddCourse = 0;
      this.isVisibleCourse = true;
    },
    addSuccess() {
      this.$emit("addSuccess");
    },
    getFileType(fileType) {
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
        ].indexOf(fileType.toLowerCase()) != -1
      ) {
        return "图片";
      } else if (
        [
          "mp4",
          "rmvb",
          "avi",
          "mpeg",
          "navi",
          "asf",
          "wmv",
          "mov",
          "3gp",
        ].indexOf(fileType.toLowerCase()) != -1
      ) {
        return "视频";
      } else if (
        ["pdf", "txt", "rtf", "doc", "xls", "ppt", "wpd"].indexOf(
          fileType.toLowerCase()
        ) != -1
      ) {
        return "文档";
      }

      return "其他";
    },

    fileType(filePath) {
      //获取最后一个.的位置
      //var index= filePath.lastIndexOf(".");
      //获取后缀
      //var ext = filePath.substr(index+1);
      var ext = filePath;

      //判断是否是视频类型
      if (
        ["mp4", "avi", "mov", "rmvb", "rm", "flv", "3gp", "webm"].indexOf(
          ext.toLowerCase()
        ) != -1
      ) {
        return "video";
      }
      //判断是否是图片类型
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
        ].indexOf(ext.toLowerCase()) != -1
      ) {
        return "image";
      }
      //判断是否是音频类型
      if (
        ["cda", "wav", "mp3", "wmv", "flac", "aac"].indexOf(
          ext.toLowerCase()
        ) != -1
      ) {
        return "audio";
      }
      return "otherType";
    },

    //API
    delete() {
      let params = {
        id: this.item.id,
      };
      this.$axios
        .post(this.API.courseWare.courseDelete, params)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.$emit("update:visible", false);
            this.$emit("addSuccess");
            this.$message.success("课件删除成功");
          }
        })
        .catch(() => {})
        .finally(() => {});
    },
  },
  data() {
    return {
      isAddCourse: 0,
      isVisibleCourse: false,
      activeNames: "",
      showImage: false,
      isShowVideo: false,
    };
  },
};
</script>
<style>
.courseItemwrap .el-dialog-div {
  height: 70vh;
  overflow: auto;
}
.courseItemwrap .el-dialog__body {
  height: 30rem;

  background-color: #00000000;
}
</style>

</style>

<style lang="scss" scoped>
@import "./courseItem.scss";
</style>