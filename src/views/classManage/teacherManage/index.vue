<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <!-- <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="search.schoolName"
              placeholder="机构名称"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="search.teacherName"
              placeholder="教师名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="search.mobilePhone"
              placeholder="教师电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-select v-model="search.state" placeholder="请选择">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-button class="meiyuan_btn" type="primary" size="medium" @click="add"
        >绑定教师</el-button
      >
    </div>
    <!--列表-->
    <el-table
      :data="data.records"
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <el-table-column label="头像" header-align="center" align="center">
        <template slot-scope="scope">
          <img class="logo-img" :src="scope.row.imgUrl" />
        </template>
      </el-table-column>
      <el-table-column
        label="教师名称"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="所属机构"
        header-align="center"
        align="center"
        prop="schoolName"
      >
      </el-table-column>
      <el-table-column
        label="账号"
        header-align="center"
        align="center"
        prop="mobilePhone"
      >
      </el-table-column>
      <el-table-column
        label="电话"
        header-align="center"
        align="center"
        prop="mobilePhone"
      >
      </el-table-column>
      <el-table-column
        label="任课班级数"
        header-align="center"
        align="center"
        prop="classCount"
      >
      </el-table-column>
      <el-table-column
        label="学生数"
        header-align="center"
        align="center"
        prop="studentCount"
      >
      </el-table-column>
      <!-- <el-table-column
        label="任课科目"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column> -->
      <el-table-column label="状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getStateName(scope.row.state) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div class="operate-item">
            <!-- <el-button   v-if="scope.row.state==0 || scope.row.state==1" type="text" size="small" @click="checkItem(scope.row)"
            >查看</el-button
          > -->
            <el-button
              v-if="scope.row.state == 1 || scope.row.state == 0"
              type="text"
              size="small"
              @click="stopItem(scope.row)"
              >解绑</el-button
            >
            <!-- <el-button
              v-if="scope.row.state == -1 || scope.row.state == 2"
              type="text"
              size="small"
              @click="delItem(scope.row)"
              >删除</el-button
            > -->
            <!-- <el-button type="danger" size="small" @click="restItem(scope.row)"
              >密码重置</el-button
            > -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="data.pages"
        :size.sync="form.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col>

    <AddTeacherDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    >
    </AddTeacherDialog>

    <CheckTeacherDialog
      :visible.sync="isCheck"
      :isAdd="isAddType"
      :editItem="editItemData"
    >
    </CheckTeacherDialog>
  </section>
</template>

<script>
import AddTeacherDialog from "./addTeacherDialog";
import CheckTeacherDialog from "./checkTeacherDialog";
export default {
  components: {
    AddTeacherDialog,
    CheckTeacherDialog,
  },
  data() {
    return {
      listLoading: false,
      sels: [], //列表选中列
      search: {
        schoolName: "",
        teacherName: "",
        mobilePhone: "",
        state: 100,
      },

      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      options: [
        { name: "全部", val: 100 },
        { name: "在职", val: 0 },
        { name: "离职", val: -1 },
        { name: "待确认", val: 1 },
        { name: "已拒绝", val: 2 },
        { name: "已删除", val: 3 },
      ],
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      isAdd: false,
      isCheck: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
    };
  },
  created() {
    this.getList();
  },

  methods: {
    // 新增
    add() {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.isAddType = 1;
      this.isAdd = true;
    },
    reset() {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.search.schoolName = "";
      this.search.teacherName = "";
      this.search.mobilePhone = "";
      this.search.state = 100;
      this.form.pageIndex = 1;
      this.getList();
    },

    addSuccess() {
      this.isAdd = false;
      this.getList();
    },
    onSubmit() {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.form.pageIndex = 1;
      this.getList();
    },
    editItem(item) {
      this.editItemData = item;
      this.isAddType = 0;
      this.isAdd = true;
    },
    delItem(item) {
      this.$confirm("此操作将删除教师, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete({ id: item.id, state: 3 });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    checkItem(item) {
      this.editItemData = item;
      this.isCheck = true;
      this.isAddType = 0;
    },
    stopItem(item) {
      this.$confirm("此操作解绑教师, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.stop({ id: item.id, state: -1 });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    restItem() {},
    //  { name: "在职", val: 0 },
    //     { name: "离职", val: -1 },
    //     { name: "待确认", val: 1},
    //     { name: "已拒绝", val: 2},
    //     { name: "已删除", val: 3},
    getStateName(state) {
      let stateStr = "";
      switch (state) {
        case -1:
          stateStr = "离职";
          break;
        case 0:
          stateStr = "在职";
          break;
        case 1:
          stateStr = "待确认";
          break;
        case 2:
          stateStr = "已拒绝";
          break;
        case 3:
          stateStr = "已删除";
          break;
        default:
          break;
      }
      return stateStr;
    },

    currentChange() {
      //console.log('index' + index)
      this.getList();
    },

    // api

    getList() {
      let params = {
        pageIndex: this.form.pageIndex,
        pageSize: this.form.pageSize,
        model: {
          schoolName: this.search.schoolName,
          teacherName: this.search.teacherName,
          mobilePhone: this.search.mobilePhone,
          state: this.search.state,
        },
      };
      if (this.search.state == 100) {
        params = {
          pageIndex: this.form.pageIndex,
          pageSize: this.form.pageSize,
          model: {
            schoolName: this.search.schoolName,
            teacherName: this.search.teacherName,
            mobilePhone: this.search.mobilePhone,
          },
        };
      }

      this.$axios
        .post(this.API.teacher.list, params)
        .then((res) => {
          this.data.records = res.records;
          this.data.pageIndex = res.pageIndex;
          this.data.total = res.total;
          (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
        })
        .catch(() => {});
    },
    stop(params) {
      this.$axios
        .post(this.API.teacher.update, params)
        .then((res) => {
          if (res) {
            //console.log(res);
            this.$message({
              type: "success",
              message: "解绑成功!",
            });
            this.getList();
          }
        })
        .catch(() => {});
    },

    delete(params) {
      this.$axios
        .post(this.API.teacher.update, params)
        .then((res) => {
          if (res) {
            // console.log(res);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          }
        })
        .catch(() => {});
    },
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./teacherManage.scss";
</style>