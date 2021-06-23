<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->
    <panel-group
      :items="amountData"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <panel-group
      :items="userData"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row>
      <div style="height: 84px"></div>
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
        style="padding-right: 8px; margin-bottom: 30px"
      >
        <transaction-table />
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom: 30px"
      >
        <todo-list />
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom: 30px"
      >
        <box-card />
      </el-col>
    </el-row> -->
    <ExpireSchoolPage v-show="expired"></ExpireSchoolPage>
  </div>
</template>

<script>
import GithubCorner from "@/components/GithubCorner";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
import TodoList from "./components/TodoList";
import BoxCard from "./components/BoxCard";

import ExpireSchoolPage from "@/views/netSchoolMange/components/expireSchool";

export default {
  components: {
    ExpireSchoolPage,
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
  },
  data() {
    return {
      userData: [],
      amountData: [],
      lineData: {
        todayUser: {
          //expectedData: [200, 192, 120, 144, 160, 130, 140],
          // lineData: [
          //   { userNum: 140, date: "2021-05-23" },
          //   { userNum: 70, date: "2021-05-24" },
          //   { userNum: 85, date: "2021-05-25" },
          //   { userNum: 206, date: "2021-05-26" },
          //   { userNum: 152, date: "2021-05-27" },
          //   { userNum: 105, date: "2021-05-28" },
          //   { userNum: 132, date: "2021-05-29" },
          //   { userNum: 140, date: "2021-05-30" },
          //   { userNum: 70, date: "2021-05-31" },
          //   { userNum: 85, date: "2021-06-01" },
          //   { userNum: 206, date: "2021-06-02" },
          //   { userNum: 152, date: "2021-06-03" },
          //   { userNum: 105, date: "2021-06-04" },
          //   { userNum: 132, date: "2021-06-05" },
          // ],
          lineData: [],
          expectedData: [0, 0, 0, 0, 0, 0, 0],
          actualData: [0, 0, 0, 0, 0, 0, 0],
          name: "今日新增用户",
        },
        totalUser: {
          // expectedData: [200, 192, 120, 144, 160, 130, 140],
          // actualData: [180, 160, 151, 106, 145, 150, 130],
          lineData: [],
          expectedData: [0, 0, 0, 0, 0, 0, 0],
          actualData: [0, 0, 0, 0, 0, 0, 0],
          name: "累计用户",
        },
        freeGoods: {
          // expectedData: [80, 100, 121, 104, 105, 90, 100],
          // actualData: [120, 90, 100, 138, 142, 130, 130],
          lineData: [],
          expectedData: [0, 0, 0, 0, 0, 0, 0],
          actualData: [0, 0, 0, 0, 0, 0, 0],
          name: "免费商品数",
        },
        payGoods: {
          // expectedData: [130, 140, 141, 142, 145, 150, 160],
          // actualData: [120, 82, 91, 154, 162, 140, 130],
          lineData: [],
          expectedData: [0, 0, 0, 0, 0, 0, 0],
          actualData: [0, 0, 0, 0, 0, 0, 0],
          name: "付费商品数",
        },
        saleGoods: {
          // expectedData: [100, 120, 161, 134, 105, 160, 165],
          // actualData: [120, 82, 91, 154, 162, 140, 145],
          lineData: [],
          expectedData: [0, 0, 0, 0, 0, 0, 0],
          actualData: [0, 0, 0, 0, 0, 0, 0],
          name: "在售商品数",
        },
        secretGoods: {
          // expectedData: [200, 192, 120, 144, 160, 130, 140],
          // actualData: [180, 160, 151, 106, 145, 150, 130],
          lineData: [],
          expectedData: [0, 0, 0, 0, 0, 0, 0],
          actualData: [0, 0, 0, 0, 0, 0, 0],
          name: "加密商品数",
        },
      },

      expired: false,
      data: {},
      lineChartData: {
        // expectedData: [200, 192, 120, 144, 160, 130, 140],
        // lineData: [
        //   { userNum: 140, date: "2021-05-23" },
        //   { userNum: 70, date: "2021-05-24" },
        //   { userNum: 85, date: "2021-05-25" },
        //   { userNum: 206, date: "2021-05-26" },
        //   { userNum: 152, date: "2021-05-27" },
        //   { userNum: 105, date: "2021-05-28" },
        //   { userNum: 132, date: "2021-05-29" },
        //   { userNum: 140, date: "2021-05-30" },
        //   { userNum: 70, date: "2021-05-31" },
        //   { userNum: 85, date: "2021-06-01" },
        //   { userNum: 206, date: "2021-06-02" },
        //   { userNum: 152, date: "2021-06-03" },
        //   { userNum: 105, date: "2021-06-04" },
        //   { userNum: 132, date: "2021-06-05" },
        // ],
        lineData: [],
        expectedData: [0, 0, 0, 0, 0, 0, 0],
        actualData: [0, 0, 0, 0, 0, 0, 0],
        name: "今日新增用户",
      },
    };
  },

  created() {
    this.serverDate();
    this.getData();
  },

  methods: {
    handleSetLineChartData(type) {
      console.log("select type:" + type);
      return;
      this.lineChartData = this.lineData[type];
    },

    //api
    getData() {
      this.$axios.post(this.API.newNetSchool.schoolDataSta.data).then((res) => {
        if (res) {
          if (res.code == 0) {
            this.data = res.data;
            let users = [];
            let amount = [];
            for (let i = 0; i < 8; i++) {
              switch (i) {
                case 0: {
                  users.push({
                    name: "今日新增用户",
                    image: "people",
                    value: res.data.todayUser,
                    type: "todayUser",
                  });
                  this.lineData.todayUser.lineData = res.data.sevenDayUserVOS
                  this.lineChartData.lineData = res.data.sevenDayUserVOS
                  break;
                }
                case 1: {
                  users.push({
                    name: "累计用户",
                    image: "peoples",
                    value: res.data.totalUser,
                    type: "totalUser",
                  });
                  break;
                }
                case 2: {
                  break;
                }
                case 3: {
                  break;
                }
                case 4: {
                  amount.push({
                    name: "免费商品数",
                    image: "shopping",
                    value: res.data.freeGoods,
                    type: "freeGoods",
                  });
                  break;
                }
                case 5: {
                  amount.push({
                    name: "付费商品数",
                    image: "product",
                    value: res.data.payGoods,
                    type: "payGoods",
                  });
                  break;
                }

                case 6: {
                  amount.push({
                    name: "在售商品数",
                    image: "component",
                    value: res.data.saleGoods,
                    type: "saleGoods",
                  });
                  break;
                }
                case 7: {
                  amount.push({
                    name: "加密商品数",
                    image: "form",
                    value: res.data.secretGoods,
                    type: "secretGoods",
                  });
                  break;
                }
                default:
                  break;
              }
            }
            this.userData = users;
            this.amountData = amount;
            console.log("users" + JSON.stringify(this.userData));
            console.log("amountData" + JSON.stringify(this.amountData));
          }
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
  },
};
</script>


<style lang="scss" scoped>
.dashboard-editor-container {
  height: 100vh;
  padding: 32px;

  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
