<template>
  <div>
    <!-- <router-link
      tag="a"
      target="_blank"
      :to="{
        name: 'textVideoPage',
        params: { type: 2 },
        query: { name: 'quanzhizu', type: 2 },
      }"
    >
      <el-button type="primary" @click="add">新建视频</el-button>
    </router-link> -->

    <div class="flex row jc-sb mb-05">
      <el-button type="primary" @click="add">新建视频</el-button>
      <div class="flex row jc-sb">
        <el-col :span="15">
          <el-select v-model="status" placeholder="请选择状态">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-input
          class="w-10"
          v-model="title"
          placeholder="请输入名称"
        ></el-input>
        <el-button class="ml-1" type="primary" @click="searchAction"
          >搜索</el-button
        >
      </div>
    </div>

    <el-table
      :ref="'multipleTable'"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      border
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column label="视频名称" align="center" prop="title">
        <!-- <template slot-scope="scope">
          <div class="flex row ai-c jc-c">
            <img class="w-6 h-4" :src="scope.row.url" />
            <div class="flex column jc-sb ml-1">
              <span>{{ scope.row.name }}</span>
              <span class="txc-red">{{ "￥" + scope.row.price }}</span>
            </div>
          </div>
        </template> -->
      </el-table-column>
      <!-- <el-table-column label="订阅量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subscribeCount }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="上架状态" align="center">
        <template slot-scope="scope">
          <span>{{ getStatuStr(scope.row.onlineState) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近上架时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.onlineTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItem(scope.row)"
            >编辑</el-button
          >

          <el-button type="text" size="small" @click="onLineItem(scope.row)"
            >上架/下架</el-button
          >

          <el-button type="danger" size="small" @click="resetItem(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="data.pages"
        :size.sync="form.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      status: 100,
      options: [
        {
          name: "全部",
          id: 100,
        },
        {
          name: "上架",
          id: 1,
        },
        {
          name: "下架",
          id: 0,
        },
      ],
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: {
        pageIndex: 1,
        pages: 0,
        pageSize: 10,
        total: 0,
        records: [],
      },
      tableData: [],
    };
  },

  created() {
    this.getList();
  },
  methods: {
    add() {
      this.$router.push({ path: "/netSchoolTextVideoPage" });
    },
    currentChange() {
      this.getList();
    },
    getStatuStr(statu) {
      switch (statu) {
        case 1: {
          return "上架";
          break;
        }
        case 0: {
          return "下架";
          break;
        }
        default:
          return "";
          break;
      }
    },
    editItem(item) {
      this.$router.push({
        path: "/netSchoolTextVideoPage",
        query: { productId: item.id },
      });
    },
    onLineItem(item) {
      this.$confirm("此操作将修改该商品状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.changeStatus(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
    resetItem(item) {
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
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
            message: "已取消删除",
          });
        });
    },

    handleSelectionChange() {},
    searchAction() {
      this.form.pageIndex = 1;
      this.getList();
    },

    //API

    getList() {
      let params = {
        pageSize: this.form.pageSize,
        pageIndex: this.form.pageIndex,
        model: {
          onlineState: this.status,
          title: this.title,
          type: 2,
        },
      };
      if (this.status == 100) {
        params = {
          pageSize: this.form.pageSize,
          pageIndex: this.form.pageIndex,
          model: {
            title: this.title,
            type: 2,
          },
        };
      }
      console.log("666")
      this.$axios
        .post(this.API.newNetSchool.schoolData.page, params)
        .then((res) => {
          if (res) {
            this.tableData = res.records;
            this.data.pageIndex = res.pageIndex;
            this.data.total = res.total;
            (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
          }
        });
    },
    changeStatus(item) {
      let params = {
        id: item.id,
      };
      this.$axios
        .get(this.API.newNetSchool.schoolData.changeState, { params: params })
        .then((res) => {
          if (res) {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          }
        });
    },

    delete(item) {
      let params = {
        id: item.id,
      };
      this.$axios
        .get(this.API.newNetSchool.schoolData.remove, { params: params })
        .then((res) => {
          if (res) {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
    },
  },
};
</script>


<style scoped>
</style>