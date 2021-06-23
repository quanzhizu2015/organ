<template>
  <section class="form_border" v-loading="loading">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="search.mobile" placeholder="电话号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="search.nickName"
              placeholder="用户昵称"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="resetSubmit">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>

    <!--列表-->
    <el-table
      :data="data.records"
      highlight-current-row
      border
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <el-table-column
        label="电话号"
        header-align="center"
        align="center"
        prop="mobile"
      >
      </el-table-column>
      <el-table-column
        label="用户昵称"
        header-align="center"
        align="center"
        prop="nickName"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        header-align="center"
        align="center"
        prop="createTime"
      >
      </el-table-column>

      <!--订单状态 -1：取消 1:待支付,2:成功,3:失败,4:支付中-->
      <!-- <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.state == 1"
            type="text"
            size="small"
            @click="payAction(scope.row)"
            >继续支付</el-button
          >
          <el-button
            v-show="scope.row.state == 1"
            type="text"
            size="small"
            @click="cancelPayAction(scope.row)"
            >取消支付</el-button
          >
        </template>
      </el-table-column> -->
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

    <ExpireSchoolPage v-show="expired"></ExpireSchoolPage>
  </section>
</template>

<script>
import PayCodeDialog from "../components/payCodeDialog";
import ExpireSchoolPage from "@/views/netSchoolMange/components/expireSchool";
export default {
  components: {
    PayCodeDialog,
    ExpireSchoolPage,
  },
  name: "UserPage",
  data() {
    return {
      expired: false,
      search: {
        mobile: "",
        nickName: "",
      },
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      loading: false,
    };
  },
  created() {
    this.serverDate();
    this.getList();
  },

  methods: {
    onSubmit() {
      this.form.pageIndex = 1;
      this.getList();
    },
    resetSubmit() {
      this.form.pageIndex = 1;
      this.search.no = "";
      this.getList();
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
          mobile: this.search.mobile,
          nickName: this.search.nickName,
        },
      };
      this.$axios
        .post(this.API.newNetSchool.schoolUser.page, params)
        .then((res) => {
          if (res) {
            this.data.records = res.records;
            this.data.pageIndex = res.pageIndex;
            this.data.total = res.total;
            (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
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

    cancelPayAction(item) {
      this.$confirm("此操作将会取消该笔订单,确定要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.cancelPay(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    cancelPay(item) {
      this.$axios
        .get(this.API.newNetSchool.schoolOrder.cancel + "?orderId=" + item.id)
        .then((res) => {
          if (res) {
            this.getList();
          }
        });
    },
    pay(item) {
      this.loading = true;
      this.orderItem = item;
      this.$axios
        .post(this.API.newNetSchool.schoolOrder.pay + "?orderId=" + item.id)
        .then((res) => {
          if (res) {
            this.codeVisible = true;
            this.codeItem = res;
          }
          this.loading = false;
        });
    },
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./userPage.scss";
</style>
