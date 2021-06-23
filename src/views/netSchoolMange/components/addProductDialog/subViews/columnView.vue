<template>
  <div>
    <!-- <el-button type="primary" @click="add">新建专栏</el-button> -->
    <el-table
      :ref="'multipleTable'"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="300"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      @select="dialogCheck"
      border
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true">
      </el-table-column>
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
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItem(scope.row)"
            >编辑</el-button
          >

          <el-button type="danger" size="small" @click="resetItem(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
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
  props: {
    type: {
      type: Number,
      default: 1, //1 普通  2分组商品
    },
    selectType: {
      type: Number,
      default: 1, //1 多选  2单选
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  created() {
    this.$bus.$on("clearTableData", (params) => {
      this.clearSelection();
    });
  },
  beforeDestroy() {
    // 在组件销毁之前清除自定义事件
    this.$bus.$off("clearTableData");
  },
  watch: {
    value(val) {
      this.multipleSelection = val;
    },
  },
  data() {
    return {
      multipleSelection: this.value,
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
    rowKey(row) {
      return row.id;
    },
    clearSelection() {
      this.$nextTick(() => {
        this.$refs.multipleTable && this.$refs.multipleTable.clearSelection();
      });
    },
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

    handleSelectionChange(val) {
      //console.log("handleSelectionChange", JSON.stringify(val));
      if (this.selectType == 1) {
        this.multipleSelection.splice(0);
        val.forEach((item) => {
          this.multipleSelection.push(item);
        });
      }
    },
    dialogCheck(selection, row) {
      if (this.selectType == 1) {
        return;
      } else {
        this.multipleSelection.splice(0);
        this.multipleSelection.push(row);
      }
      this.$refs.multipleTable.clearSelection();
      if (selection.length === 0) {
        // 判断selection是否有值存在
        return;
      }
      if (row) {
        this.selectioned = row;
        this.$refs.multipleTable.toggleRowSelection(row, true);
      }
    },
  },
};
</script>


<style scoped>
</style>