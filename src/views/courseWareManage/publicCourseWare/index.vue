<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="请选择科目">
          <el-select
            v-model="search.course"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索科目"
            :remote-method="searchCourse"
            :loading="loading"
            value-key="id"
          >
            <el-option
              v-for="item in courseOptions"
              :key="item.id"
              :label="item.title"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-col :span="24">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="add">新增章节</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="course-containt">
      <CourseChapter
        v-for="(item, index) in courseData"
        :key="index"
        :item="item"
      />
    </div>
    <AddChapterDialog
      :isAdd="isAddChapter"
      :visible.sync="isVisibleChapter"
      :editItem="editItem"
    />
  </section>
</template>

<script>
import CourseChapter from "../courseChapter";
import AddChapterDialog from "../addChapterDialog";

export default {
  components: {
    CourseChapter,
    AddChapterDialog,
  },
  mounted() {
    this.searchClass("");
    this.searchCourse("");
    this.courseList();
  },
  methods: {
    add() {
      this.isAddChapter = 1;
      this.isVisibleChapter = true;
    },
    onSubmit() {},
    searchClass(query) {
      this.loading = true;
      this.$axios
        .post(this.API.class.list, {
          // pageIndex: 1,
          // pageSize: 30,
          model: {
            state: 0,
            className: query,
          },
        })
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.classOptions = response.records;
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    searchCourse(query) {
      this.loading = true;
      let params = {
        pageIndex: 1,
        pageSize: 300,
      };
      this.$axios
        .post(this.API.course.list, params)
        .then((res) => {
          this.courseOptions = res.records;
          //   this.data.pageIndex = res.pageIndex;
          //   this.data.total = res.total;
          //   (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },

     courseList() {
     
      if (Object.keys(this.search.course).length == 0) {
        this.$message.error("请选择科目");
        return;
      }
      let params = {
        pageIndex: 1,
        pageSize: 300,
        model: {
          parentId: this.search.course.id,
        },
      };
      this.$axios
        .post(this.API.courseWare.list, params)
        .then((res) => {
          this.courseData = res.records;
        })
        .catch(() => {})
        .finally(() => {});
    },
  },
  data() {
    return {
      loading: false,
      editItem: {},
      isAddChapter: 1, //1新增章节  0新建文件夹
      isVisibleChapter: false,
      search: {
        class: {},
        course: {},
      },
      classOptions: [],
      courseOptions: [],
      courseData: [],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./publicCourseWare.scss";
</style>