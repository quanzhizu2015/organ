<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="search.className"
              placeholder="班级名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-button class="meiyuan_btn" type="primary" size="medium" @click="add"
        >新增班级</el-button
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
      <el-table-column
        label="班级名称"
        header-align="center"
        align="center"
        prop="className"
      >
      </el-table-column>
      <el-table-column
        label="任课教师"
        header-align="center"
        align="center"
        prop="teacherNames"
      >
      </el-table-column>
      <el-table-column
        label="科目数"
        header-align="center"
        align="center"
        prop="courseCount"
        width="110"
      >
      </el-table-column>
      <el-table-column
        label="班级人数"
        header-align="center"
        align="center"
        prop="studentCount"
        width="110"
      >
      </el-table-column>
      <el-table-column
        label="教学起止时间"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            (scope.row.startDate ? scope.row.startDate : "") +
            (scope.row.startDate && scope.row.endDate ? "至" : "") +
            (scope.row.endDate ? scope.row.endDate : "")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        header-align="center"
        align="center"
        prop="createTime"
      >
      </el-table-column>

      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div class="operate-item">
            <el-button type="text" size="small" @click="editItem(scope.row)"
              >修改</el-button
            >
            <!-- <el-button type="text" size="small" @click="stopItem(scope.row)"
            >删除</el-button
          > -->
            <!-- <el-button type="text" size="small" @click="codeItem(scope.row)"
            >班级二维码</el-button
          > -->
            <!-- <el-button type="text" size="small" @click="statisItem(scope.row)"
            >数据统计</el-button
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

    <AddClassDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    >
    </AddClassDialog>
    <CodeDialog :visible.sync="isCode" :item="codeItemData"> </CodeDialog>
  </section>
</template>

<script>
import AddClassDialog from "./addClassDialog";
import CodeDialog from "./codeDialog";

export default {
  components: {
    AddClassDialog,
    CodeDialog,
  },
  data() {
    return {
      listLoading: false,
      sels: [], //列表选中列
      search: {
        className: "",
      },
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      isAdd: false,
      isCode: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
      codeItemData: {},
    };
  },
  mounted() {
    this.getList();
  },

  methods: {
    reset() {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.search.className = "";
      this.form.pageIndex = 1;
      this.getList();
    },
    // 新增
    add() {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.isAddType = 1;
      this.isAdd = true;
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
    stopItem(item) {
      this.$confirm("此操作将删除班级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteItem({ classId: item.id });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    codeItem(item) {
      this.codeItemData = item;
      this.isCode = true;
    },
    statisItem(item) {},

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
          className: this.search.className,
          state: 0,
        },
      };
      this.$axios
        .post(this.API.class.list, params)
        .then((res) => {
          this.data.records = res.records;
          this.data.pageIndex = res.pageIndex;
          this.data.total = res.total;
          (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
        })
        .catch(() => {});
    },

    deleteItem(params) {
      this.$axios
        .post(this.API.class.deleteClass, params)
        .then((res) => {
          if (res) {
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

  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./classManage.scss";
</style>