<template>
  <section class="form_border">
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
        label="页面名称"
        header-align="center"
        align="center"
        prop="title"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        header-align="center"
        align="center"
        prop="createTime"
      >
      </el-table-column>
      <el-table-column label="页面状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getStateString(scope.row.enable) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editAction(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteAction(scope.row)"
            >删除</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="changePageAction(scope.row)"
            >设为主页</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="data.pages"
        :size.sync="form.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col> -->
    <ExpireSchoolPage v-show="expired"></ExpireSchoolPage>
  </section>
</template>

<script>
import ExpireSchoolPage from "@/views/netSchoolMange/components/expireSchool";
export default {
  components: {
    ExpireSchoolPage,
  },
  data() {
    return {
      expired: false,
      listLoading: false,

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
    };
  },
  created() {
    this.getList();
    this.serverDate();
  },

  methods: {
    // 新增

    //0正常、1 待审核 、2 已拒绝、3用户删除  4 被系统拒绝  5 禁用

    getStateString(state) {
      let stateString = "";
      switch (state) {
        case 0:
          stateString = "当前非主页";
          break;
        case 1:
          stateString = "当前主页";
          break;

        default:
          stateString = "";
          break;
      }

      return stateString;
    },

    editAction(item) {
      this.$router.push({
        path: "/netSchoolNetSchoolCus",
        query: { id: item.id },
      });
    },

    deleteAction(item) {
      this.$confirm("此操作将删除主页, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    changePageAction(item) {
      this.$confirm("此操作将更换主页, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.changePage(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    // api

    getList() {
      this.$axios.get(this.API.newNetSchool.schoolPage.list).then((res) => {
        if (res) {
          this.data.records = res.data;
        }
      });
    },
    serverDate() {
      this.$axios
        .get(this.API.newNetSchool.schoolPage.serverDate)
        .then((res) => {
          if (res) {
            if (res.code == 0) {
              if (res.data.expire) {
                this.expired = true;
              } else {
                this.expired = false;
              }
            }
          }
        });
    },

    delete(item) {
      this.$axios
        .get(this.API.newNetSchool.schoolPage.remove + "?id=" + item.id)
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
    changePage(item) {
      this.$axios
        .get(this.API.newNetSchool.schoolPage.change + "?id=" + item.id)
        .then((res) => {
          if (res) {
            this.$message({
              type: "success",
              message: "操作成功!",
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
@import "./historyPage.scss";
</style>
