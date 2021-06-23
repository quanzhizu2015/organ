<template>
  <section class="form_border">
    <div class="header">
      <el-button class="meiyuan_btn" type="primary" size="medium" @click="add"
        >新增科目</el-button
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
      <el-table-column label="科目封面" header-align="center" align="center">
        <template slot-scope="scope">
          <img class="logo-img" :src="getUrl(scope.row.url)" />
        </template>
      </el-table-column>
      <el-table-column
        label="科目名称"
        header-align="center"
        align="center"
        prop="title"
      >
      </el-table-column>

      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div class="operate-item">
            <el-button type="text" size="small" @click="editItem(scope.row)"
              >编辑</el-button
            >
            <!-- <el-button type="text" size="small" @click="stopItem(scope.row)"
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

    <AddSubjectDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    >
    </AddSubjectDialog>
  </section>
</template>

<script>
import AddSubjectDialog from "./addSubjectDialog";

export default {
  components: {
    AddSubjectDialog,
  },
  data() {
    return {
      listLoading: false,
      sels: [], //列表选中列

      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      isAdd: false,
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
    getUrl(url) {
      if (url) {
        return url.indexOf("x-oss-process=image") != -1
          ? url
          : url + "?x-oss-process=image/auto-orient,1";
      } else {
        return url;
      }
    },

    addSuccess() {
      this.isAdd = false;
      this.getList();
    },
    onSubmit() {
      this.getList();
    },
    editItem(item) {
      this.editItemData = item;
      this.isAddType = 0;
      this.isAdd = true;
    },
    stopItem(item) {
      this.$confirm("此操作将删除科目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteItem({ id: item.id });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    restItem() {},

    currentChange() {
      //console.log('index' + index)
      this.getList();
    },

    // api

    getList() {
      let params = {
        pageIndex: this.form.pageIndex,
        pageSize: this.form.pageSize,
      };
      this.$axios
        .post(this.API.course.list, params)
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
        .post(this.API.course.deleteSubject, params)
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
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./subjectManage.scss";
</style>