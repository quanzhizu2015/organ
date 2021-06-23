<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="search.name" placeholder="校长姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="search.mobilePhone"
              placeholder="校长电话"
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
        >新增校长</el-button
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
        label="校长姓名"
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
        prop="loginCode"
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
        label="状态"
        header-align="center"
        align="center"
        workState
      >
        <template slot-scope="scope">
          <span>{{ scope.row.workState ? "正常" : "禁用" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div class="operate-item">
            <el-button type="text" size="small" @click="updateItem(scope.row)">
              <span> {{ scope.row.workState ? "禁用" : "启用" }}</span>
            </el-button>
            <!-- <el-button
            v-if="scope.row.state == 1 || scope.row.state == 3"
            type="text"
            size="small"
            @click="editItemAction(scope.row)"
            >修改</el-button
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

    <AddSchoolDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    >
    </AddSchoolDialog>
  </section>
</template>

<script>
import AddSchoolDialog from "./addSchoolDialog";

export default {
  components: {
    AddSchoolDialog,
  },
  data() {
    return {
      listLoading: false,
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },

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
    reset() {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.search.name = "";
      this.search.mobilePhone = "";

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
    editItemAction(item) {
      this.editItemData = item;
      this.isAddType = 0;
      this.isAdd = true;
    },
    updateItem(item) {
      this.$confirm(
        "此操作将" + (item.workState ? "禁用" : "启用") + "校长, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.update({ id: item.id, workState: !item.workState });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
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
        model: {
          name: this.search.name,
          mobilePhone: this.search.mobilePhone,
        },
      };
      this.$axios
        .post(this.API.school.list, params)
        .then((res) => {
          this.data.records = res.records;
          this.data.pageIndex = res.pageIndex;
          this.data.total = res.total;
          (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
        })
        .catch(() => {});
    },

    update(params) {
      this.$axios
        .post(this.API.school.update, params)
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
@import "./schoolManage.scss";
</style>

