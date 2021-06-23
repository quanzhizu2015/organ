<template>
  <div class="addItemCourseDialog">
    <el-dialog
      width="520px"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">{{ isAdd ? "新添课件" : "重新上传课件" }}</div>
      <el-form
        ref="form"
        v-loading="isLoading"
        :model="data"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="课件名称">
          <el-input
            v-model="data.title"
            placeholder="请输入内容"
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="上传课件">
          <AliMultiUpload
            ref="upload"
            :image="image"
            @input="mutiUpdate"
            v-if="isAdd == 1"
          />
          <AliOssUpload ref="upload" :image="image" @update="update" v-else />
        </el-form-item>

        <!-- <el-form-item label="上传视频">
        <local-upload></local-upload>
      </el-form-item>-->
        <!-- <el-form-item>
        <el-button type="primary">布置作业</el-button>
      </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AliMultiUpload from "@/components/Upload/AliMultiUpload";
import AliOssUpload from "@/components/Upload/AliOssUpload";
export default {
  name: "AddItemCourseDialog",
  components: { AliOssUpload, AliMultiUpload },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: false,
    },
    editItem: {
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
  data() {
    return {
      isLoading: false,
      image: [],
      lists: [],
      data: {
        title: "",
        urls: [],
        url: "",
        fileType: "", // 小写
      },
      coursewareIds: [],
      id: "",
    };
  },
  created() {
    this.$on("giveId", (option) => {
      this.id = option;
    });
  },
  methods: {
    open() {
      //console.log(this.editItem)
      if (this.isAdd) {
        this.data = {
          title: "",
          urls: [],
          url: "",
          fileType: "",
        };
      } else {
        this.data = {
          title: this.editItem.title,
          url: this.editItem.url,
          urls: [],
          fileType: this.editItem.fileType,
        };

        // this.$refs["upload"].$emit("update", {
        //       url: this.editItem.url,
        //       fileType: this.editItem.fileType,
        //     });
      }
    },
    doAdding() {
      if (this.isAdd) {
        if (this.data.title === "") {
          this.$message.error("请输入课件名");
          return;
        }

        this.$refs.upload.submit();
      } else {
        this.editCourse();
      }
    },

    //API

    addCourse() {
      if (!this.data.urls || this.data.urls.length < 1) {
        this.$message.error("还未选择文件或者文件正在上传中，请稍后");
        return;
      }
      this.isLoading = true;
      this.$axios
        .post("/train/courseware/batchInsert", this.data)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.bindCourse(response.data);
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
          this.onClose();
        });
    },

    editCourse() {
      if (this.data.title === "") {
        this.$message.error("请输入课件名");
        return;
      }
      if (!this.data.url || this.data.url === "") {
        this.$message.error("还未选择文件或者文件正在上传中，请稍后");
        return;
      }
      let params = {
        id: this.editItem.id,
        title: this.data.title,
        url: this.data.url,
      };
      this.isLoading = true;
      this.$axios
        .post("/train/courseware/update", params)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.$emit("update:visible", false);
            this.$emit("addSuccess");
            this.$message.success("更新课件成功");
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
          this.onClose();
        });
    },

    bindCourse(coursewareIds) {
      let params = {
        courseId: this.course.id,
        coursewareIds: coursewareIds,
        folderId: this.editItem.id,
      };
      this.$axios
        .post("train/course/insertCourseware", params)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.$emit("update:visible", false);
            this.$emit("addSuccess");
            this.$message.success("添加课件成功");
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
          this.onClose();
        });
    },
    onClose() {
      this.data = {
        title: "",
        urls: [],
        url: "",
        fileType: "", // 小写
      };
      this.image = [];
      this.$refs["upload"].$emit("clear");
      this.$emit("update:visible", false);
    },

    mutiUpdate(params) {
      params.forEach((element) => {
        this.data.urls.push(element.url);
      });
      this.addCourse();

      // console.log(params);
      // console.log(this.data.urls);
      // this.data.url = params.url;
      // this.data.fileType = params.fileType;
    },
    update(params) {
      console.log(params);
      this.data.url = params.url;
      this.data.fileType = params.fileType;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./addItemCourseDialog.scss";
</style>