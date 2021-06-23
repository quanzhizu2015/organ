<template>
  <section class="form_border" v-loading="loading">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-col :span="8">
          <el-form-item label="选择商品类型">
            <el-select
              v-model="search.type"
              placeholder="请选择商品类型"
              @change="change"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="resetSubmit">重置</el-button>
          </el-form-item>
        </el-col> -->
      </el-form>
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
        label="商品名称"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="商品编号"
        header-align="center"
        align="center"
        prop="no"
      >
      </el-table-column>
      <el-table-column label="商品价格" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price / 100.0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.size + "个月" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getStateString(scope.row.enable) }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="buyAction(scope.row)"
            >购买</el-button
          >
          <!-- <el-button type="text" size="small" @click="deleteAction(scope.row)"
            >删除</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="changePageAction(scope.row)"
            >设为主页</el-button
          > -->
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

    <PayCodeDialog
      :visible.sync="codeVisible"
      :editItem="codeItem"
      :orderItem="orderData"
      @addSuccess="addCodeSuccess"
    ></PayCodeDialog>
  </section>
</template>

<script>
import PayCodeDialog from "../components/payCodeDialog";
export default {
  name: "ProductPage",
  components: {
    PayCodeDialog,
  },
  data() {
    return {
      listLoading: false,
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      search: {
        type: 1,
      },

      orderData: {},
      options: [
        {
          value: 1,
          label: "H5服务",
        },
        {
          value: 2,
          label: "小程序服务",
        },
      ],
      codeVisible: false,
      codeItem: {},
      orderItem: { id: "" },

      loading: false,
    };
  },
  created() {
    this.getList();
  },

  methods: {
    change() {
      this.getList();
    },
    // 新增

    //0正常、1 待审核 、2 已拒绝、3用户删除  4 被系统拒绝  5 禁用

    getStateString(state) {
      let stateString = "";
      switch (state) {
        case 0:
          stateString = "禁用";
          break;
        case 1:
          stateString = "启用";
          break;

        default:
          stateString = "";
          break;
      }

      return stateString;
    },

    buyAction(item) {
      this.buy(item);
    },

    addCodeSuccess() {
      this.codeVisible = false;
    },

    // api

    getList() {
      this.$axios
        .post(
          this.API.newNetSchool.sysProduct.page + "?type=" + this.search.type
        )
        .then((res) => {
          if (res) {
            this.data.records = res.data;
          }
        });
    },
    buy(item) {
      this.loading = true;
      this.$axios
        .post(
          this.API.newNetSchool.schoolOrder.create + "?productId=" + item.id
        )
        .then((res) => {
          if (res) {
            this.orderData = res.data;
            this.pay(this.orderData);
          }
        });
    },
    pay(item) {
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
@import "./productPage.scss";
</style>
