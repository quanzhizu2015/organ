<template>
  <section class="form_border" v-loading="loading">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="search.no" placeholder="订单号"></el-input>
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
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <el-table-column
        label="订单编号"
        header-align="center"
        align="center"
        prop="no"
      >
      </el-table-column>
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
        prop="productNo"
      >
      </el-table-column>
      <el-table-column label="时长(月)" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price / 100.0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品类型" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getTypeString(scope.row.type) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="支付状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getStateString(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.finishTime }}</span>
        </template>
      </el-table-column>
      <!--订单状态 -1：取消 1:待支付,2:成功,3:失败,4:支付中-->
      <el-table-column label="操作" header-align="center" align="center">
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
          <span v-show="scope.row.state == 2">支付成功</span>
          <span v-show="scope.row.state == 3">支付失败</span>
           <span v-show="scope.row.state == -1">已取消</span>
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
    <PayCodeDialog
      :visible.sync="codeVisible"
      :editItem="codeItem"
      :orderItem="orderItem"
      @addSuccess="addCodeSuccess"
    ></PayCodeDialog>
  </section>
</template>

<script>
import PayCodeDialog from "../components/payCodeDialog";
export default {
  components: {
    PayCodeDialog,
  },
  name: "OrderPage",
  data() {
    return {
      search: {
        no: "",
      },
      listLoading: false,
      expired:false,
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      type: 1,
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

    getTypeString(type) {
      let stateString = "";
      switch (type) {
        case 1:
          stateString = "H5服务";
          break;
        case 2:
          stateString = "小程序服务";
          break;

        default:
          stateString = "";
          break;
      }

      return stateString;
    },

    //0正常、1 待审核 、2 已拒绝、3用户删除  4 被系统拒绝  5 禁用

    getStateString(state) {
      let stateString = "";
      switch (state) {
         case -1:
          stateString = "取消支付";
          break;
        case 1:
          stateString = "待支付";
          break;
        case 2:
          stateString = "成功";
          break;
        case 3:
          stateString = "失败";
          break;
        case 4:
          stateString = "支付中";
          break;

        default:
          stateString = "";
          break;
      }

      return stateString;
    },

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

    payAction(item) {
      this.pay(item);
    },

    addCodeSuccess() {
      this.codeVisible = false;
      this.getList();
    },

    // api

    getList() {
      let params = {
        pageIndex: this.form.pageIndex,
        pageSize: this.form.pageSize,
        model: {
          no: this.search.no,
        },
      };
      this.$axios
        .post(this.API.newNetSchool.schoolOrder.page, params)
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
@import "./orderPage.scss";
</style>
