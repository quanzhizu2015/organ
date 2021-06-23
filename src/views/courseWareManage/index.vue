<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="请选择班级">
          <el-select
            v-model="search.class"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索班级"
            :remote-method="searchClass"
            :loading="loading"
            @change="changeClass"
            value-key="id"
          >
            <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.className"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择科目">
          <el-select
            v-model="search.course"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索科目"
            :remote-method="searchCourse"
            :loading="loading"
            @change="changeCourse"
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
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="add">新增章节</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="course-containt">
      <CourseChapter
        v-for="(item, index) in courseData"
        :key="index"
        :item="item"
        :classObject="search.class"
        :course="search.course"
        @editChapterSuccess="onSubmit"
      />
    </div>
    <AddChapterDialog
      :isAdd="isAddChapter"
      :visible.sync="isVisibleChapter"
      :editItem="editItem"
      :classObject="search.class"
      :course="search.course"
      @addSuccess="onSubmit"
    />
  </section>
</template>

<script>
import CourseChapter from "./courseChapter";
import AddChapterDialog from "./addChapterDialog";

export default {
  components: {
    CourseChapter,
    AddChapterDialog,
  },
  mounted() {
    this.searchClass("");
  },
  methods: {
    add() {
      console.log(this.$route);
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      if (Object.keys(this.search.class).length == 0) {
        this.$message.error("请选择班级");
        return;
      }
      if (Object.keys(this.search.course).length == 0) {
        this.$message.error("请选择科目");
        return;
      }
      this.isAddChapter = 1;
      this.isVisibleChapter = true;
    },
    onSubmit() {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.courseList();
    },

    changeClass(value) {
      (this.courseOptions = []), (this.search.course = {});
      this.courseData = [];

      this.searchCourse("");
    },

    changeCourse() {
      this.courseData = [];
    },
    searchClass(query) {
      this.loading = true;
      this.$axios
        .post(this.API.class.list, {
          pageIndex: 1,
          pageSize: 300,
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
      if (Object.keys(this.search.class).length == 0) {
        this.$message.error("请先选择班级");
        return;
      }
      this.loading = true;
      let params = {
        classId: this.search.class.id,
        parentId: 0,
        title: query,
      };
      this.$axios
        .post(this.API.course.pagePo, params)
        .then((res) => {
          this.courseOptions = res.data;
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
      if (Object.keys(this.search.class).length == 0) {
        this.$message.error("请选择班级");
        return;
      }
      if (Object.keys(this.search.course).length == 0) {
        this.$message.error("请选择科目");
        return;
      }
      let params = {
        pageIndex: 1,
        pageSize: 300,
        model: {
          classId: this.search.class.id,
          parentId: this.search.course.id,
        },
      };
      this.$axios
        .post(this.API.courseWare.list, params)
        .then((res) => {
          this.courseData = res.records;
          if (!res.records || res.records.length < 1) {
            this.$message.error("没有查询到相关课件");
          }
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
@import "./courseWareManage.scss";
</style>