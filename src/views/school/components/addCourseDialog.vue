<template>
  <el-dialog
    :title="type==0?'新增课程':'编辑课程'"
    width="90%"
    class="course"
    :visible="visible"
    :close-on-click-modal="false"
    @close="onclose"
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
      <el-form-item label="班级人数">
        <el-input v-model="data.studentCount" type="number" placeholder="请输入" class="classInput" />
      </el-form-item>
      <el-form-item label="课程费用">
        <el-input v-model="data.fee" placeholder="请输入" class="classInput" />
      </el-form-item>
      <el-form-item label="过线率（百分比）">
        <el-input v-model="data.percent" type="number" placeholder="请输入" class="classInput" />
      </el-form-item>
      <el-form-item label="上传图片">
        <LocalUpload ref="upload" :tips="tip" :image="image" @upload="upload" />
      </el-form-item>
      <el-form-item label="首页简介">
        <el-input v-model="data.desc2" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="图文详情">
        <Tinymce ref="desc" v-model="data.desc" height="150" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onclose">取消</el-button>
      <el-button type="primary" @click="doAdding">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Tinymce from "@/components/Tinymce/index";
import LocalUpload from "@/components/Upload/LocalUpload";
export default {
  name: "AddCourseDialog",
  components: { Tinymce, LocalUpload },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tip: "（建议尺寸438*318）",
      isLoading: false,
      image: [],
      course: {},
      type: 0,
      index: 0,
      data: {
        title: "",
        url: "",
        studentCount: "",
        fee: "",
        desc2: "",
        desc: "",
        percent: 100,
      },
    };
  },

  created() {
    this.$on("course", (params) => {
      this.course = params.course;
      this.type = params.type;
      if (parseInt(params.type) === 1) {
        this.data = JSON.parse(params.course.json)[params.index];
        this.image = [{ url: this.data.url }];
        this.index = params.index;
      } else {
        this.image = [];
        this.data = {
          title: "",
          url: "",
          studentCount: "",
          fee: "",
          desc2: "",
          desc: "",
          percent: 100,
        };
      }
      this.$nextTick(() => {
        this.$refs["desc"].$emit("desc", this.data.desc);
      });
    });
  },
  methods: {
    doAdding() {
      this.isLoading = true;
      const courseJson = JSON.parse(this.course.json);
      if (parseInt(this.type) === 1) {
        courseJson[this.index] = this.data;
      } else {
        courseJson.unshift(this.data);
      }
      this.course.json = JSON.stringify(courseJson);
      this.$axios
        .post("train/schoolWeb/update", this.course)
        .then((response) => {
          this.$emit("update", { course: this.course, lists: courseJson });
          if (parseInt(this.type) === 1) {
            this.$message.success("课程修改成功");
          } else {
            this.$message.success("课程添加成功");
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
          this.$refs["upload"].$emit("clear");
          this.onclose();
        });
    },
    upload(url) {
      this.data.url = url;
    },
    onclose() {
      this.image = [];
      this.data = {
        title: "",
        url: "",
        studentCount: "",
        fee: "",
        desc: "",
        percent: 100,
      };

      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.course {
  margin-top: -10vh;
}
.course >>> .el-upload--picture-card,
.course >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 148px;
}
.course >>> .el-dialog__body {
  height: 70vh;
  overflow: auto;
}
</style>

