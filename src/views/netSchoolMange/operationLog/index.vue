<template>
  <section class="form_border">
    <div class="header">
      <div>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="操作账号">
              <el-input
                v-model="search.loginCode"
                placeholder="请输入操作账号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作模块">
              <el-select v-model="search.model" placeholder="请选择">
                <el-option
                  v-for="(item, index) in models"
                  :key="index"
                  :label="item.name"
                  :value="item.val"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作类型">
              <el-select v-model="search.type" placeholder="请选择">
                <el-option
                  v-for="(item, index) in types"
                  :key="index"
                  :label="item.name"
                  :value="item.val"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="13">
            <el-form-item label="操作时间">
              <el-date-picker
                style="width: 45%"
                v-model="search.startTime"
                type="date"
                format="yyyy-MM-dd"
                :clearable="false"
                placeholder="选择开始日期"
              >
              </el-date-picker>
              <span style="margin-left: 1rem">至</span>
              <el-date-picker
                style="margin-left: 1rem; width: 45%"
                v-model="search.endTime"
                type="date"
                format="yyyy-MM-dd"
                :clearable="false"
                placeholder="选择结束日期"
              >
              </el-date-picker>
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
      <el-table-column label="操作时间" prop="createTime"> </el-table-column>
      <el-table-column
        label="操作账号"
        header-align="center"
        align="center"
        prop="loginCode"
      >
      </el-table-column>
      <el-table-column
        label="操作模块"
        header-align="center"
        align="center"
        prop="schoolName"
      >
        <template slot-scope="scope">
          <span>{{ getMoudleStr(scope.row.model) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作类型"
        header-align="center"
        align="center"
        prop="className"
      >
        <template slot-scope="scope">
          <span>{{ getTypeStr(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人IP"
        header-align="center"
        align="center"
        prop="ip"
      >
      </el-table-column>
      <el-table-column
        label="操作内容"
        header-align="center"
        align="center"
        prop="content"
      >
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
      listLoading: false,
      expired: false,
      sels: [], //列表选中列
      search: {
        startTime: null,
        endTime: null,

        loginCode: "",
        model: 100, //操作模块 1:上传中心,2:历史主页,3:店铺导航,4:搭建主页,5:我的服务,6:操作日志
        type: 100, //操作类型 1:新增,2:编辑,3:查询,4:删除
      },

      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      types: [
        // 1:新增,2:编辑,3:查询,4:删除
        { name: "全部", val: 100 },
        { name: "新增", val: 1 },
        { name: "编辑", val: 2 },
        { name: "删除", val: 4 },
      ],
      models: [
        //操作模块 1:上传中心,2:历史主页,3:店铺导航,4:搭建主页,5:我的服务,6:操作日志
        { name: "全部", val: 100 },
        { name: "上传中心", val: 1 },
        { name: "历史主页", val: 2 },
        { name: "店铺导航", val: 3 },
        { name: "搭建主页", val: 4 },
        { name: "操作日志", val: 6 },
      ],

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
    };
  },
  created() {
    this.getList();
    this.serverDate();
  },

  methods: {
    //1:上传中心,2:历史主页,3:店铺导航,4:搭建主页,5:我的服务,6:操作日志
    getMoudleStr(moudle) {
      switch (moudle) {
        case 1: {
          return "上传中心";
          break;
        }
        case 2: {
          return "历史主页";
          break;
        }
        case 3: {
          return "店铺导航";
          break;
        }
        case 4: {
          return "搭建主页";
          break;
        }
        case 5: {
          return "我的服务";
          break;
        }
        case 6: {
          return "操作日志";
          break;
        }
        default:
          return "";
          break;
      }
    },
    //操作类型 1:新增,2:编辑,3:查询,4:删除
    getTypeStr(type) {
      switch (type) {
        case 1: {
          return "新增";
          break;
        }
        case 2: {
          return "编辑";
          break;
        }
        case 3: {
          return "查询";
          break;
        }
        case 4: {
          return "删除";
          break;
        }

        default:
          return "";
          break;
      }
    },

    resetSubmit() {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.search.startTime = null;
      this.search.endTime = null;
      this.search.loginCode = "";
      this.search.model = 100;
      this.search.type = 100;
      this.form.pageIndex = 1;
      this.getList();
    },

    onSubmit() {
      this.form.pageIndex = 1;
      this.getList();
    },

    currentChange() {
      this.getList();
    },

    // api

    getList() {
      let model = {
        loginCode: this.search.loginCode,
      };

      if (this.search.model != 100) {
        model = { ...model, model: this.search.model };
      }
      if (this.search.type != 100) {
        model = { ...model, type: this.search.type };
      }
      if (this.search.startTime && this.search.endTime) {
        let startDate =
          this.$dayjs(this.search.startTime).format("YYYY-MM-DD") + " 00:00:00";
        let endDate =
          this.$dayjs(this.search.endTime).format("YYYY-MM-DD") + " 23:59:59";

        model = {
          ...model,
          startTime: startDate,
          endTime: endDate,
        };
        let hour = this.$dayjs(endDate).diff(this.$dayjs(startDate), "second");
        console.log("hour" + hour);
        if (hour < 0) {
          this.$message.error("开始时间不能大于结束日期");
          return;
        }
      }
      let params = {
        pageIndex: this.form.pageIndex,
        pageSize: this.form.pageSize,
        model: model,
      };

      this.$axios
        .post(this.API.newNetSchool.operate.page, params)
        .then((res) => {
          this.data.records = res.records;
          this.data.pageIndex = res.pageIndex;
          this.data.total = res.total;
          (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
        })
        .catch(() => {});
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
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./operationLog.scss";
</style>