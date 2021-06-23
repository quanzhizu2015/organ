<template>
  <section class="wrap">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item :name="item.id">
        <template slot="title">
          <el-col :span="12">
            <span
              style="
                float: left;
                font-weight: bold;
                font-size: 14px;
                color: #8d8d8d;
              "
              >{{ item.folderName }}</span
            ></el-col
          >
          <el-col class="header" :span="12">
            <!-- <el-button type="text" size="small" @click="delItem()"
              >新增课件</el-button
            > -->
            <el-button
              type="text"
              size="small"
              @click="editItem()"
              @click.stop="stopProp"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="delItem()"
              @click.stop="stopProp"
              >删除</el-button
            >
          </el-col>
        </template>
        <CourseItem
          v-for="(itemv, index) in courseWareData"
          :key="index"
          :item="itemv"
          :classObject="classObject"
          :course="course"
          @addSuccess="addSuccess"
        />
        <div class="addRow">
          <el-button type="primary" @click="addCourse">新增课件</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

    <AddFloderDialog
      :isAdd="isAddFolder"
      :visible.sync="isVisibleFolder"
      :editItem="item"
      :classObject="classObject"
      :course="course"
      @addSuccess="updateFloderSuccess"
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
import CourseItem from "../courseItem";
import AddItemCourseDialog from "../addItemCourseDialog";
import AddFloderDialog from "../addFloderDialog";
export default {
  components: {
    CourseItem,
    AddItemCourseDialog,
    AddFloderDialog,
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
  mounted() {
    this.getCourseWareList();
  },
  methods: {
    handleChange() {},
    // 阻止事件传播
    stopProp(e) {
      e.stopPropagation();
    },
    addCourse() {
      this.isAddCourse = 1;
      this.isVisibleCourse = true;
    },
    addSuccess() {
      this.getCourseWareList();
    },

    delItem() {
      this.$confirm("此操作将永久删除该文件夹, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    editItem() {
      this.isAddFolder = 0;
      this.isVisibleFolder = true;
    },

    updateFloderSuccess() {
      this.$emit("updateFloderSuccess");
    },

    // API

    getCourseWareList() {
      let params = {
        courseId: this.course.id,
        folderId: this.item.id,
      };
      this.$axios
        .post(this.API.courseWare.courseWareList, params)
        .then((res) => {
          this.courseWareData = res.data;
        })
        .catch(() => {})
        .finally(() => {});
    },

    delete() {
      let params = {
        id: this.item.id,
      };
      this.$axios
        .post(this.API.folder.delete, params)
        .then((res) => {
          if (res) {
            if (res) {
              this.$message({
                message: "删除文件夹成功",
                type: "success",
              });

              this.$emit("updateFloderSuccess");
            }
          }
        })
        .catch(() => {})
        .finally(() => {});
    },
  },
  data() {
    return {
      activeNames: [],
      isAddFolder: 0, //1新建文件夹
      isVisibleFolder: false,
      isAddCourse: 1,
      isVisibleCourse: false,
      courseWareData: [],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./courseFolder.scss";
</style>