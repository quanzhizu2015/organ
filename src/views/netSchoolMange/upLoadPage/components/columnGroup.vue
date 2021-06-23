<template>
  <div>
    <el-button type="primary" @click="add">新建专栏</el-button>
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
      <el-table-column label="图文名称" align="center">
        <template slot-scope="scope">
          <div class="flex row ai-c jc-c">
            <img class="w-6 h-4" :src="scope.row.url" />
            <div class="flex column jc-sb ml-1">
              <span>{{ scope.row.name }}</span>
              <span class="txc-red">{{ "￥" + scope.row.price }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订阅量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subscribeCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center">
        <template slot-scope="scope">
          <span>{{ getStatuStr(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItem(scope.row)"
            >编辑</el-button
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

  methods: {
    add() {},
    currentChange() {},
    getStatuStr(statu) {
      switch (statu) {
        case 1: {
          return "上架";
          break;
        }
        case 2: {
          return "下架";
          break;
        }
        default:
          return "";
          break;
      }
    },
    editItem(item) {},
    resetItem(item) {},

    handleSelectionChange() {},
  },
};
</script>


<style scoped>
</style>