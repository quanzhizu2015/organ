<template>
  <div class="sdialog">
    <el-dialog
      width="55%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">{{ isAdd ? "微页面" : "微页面" }}</div>
      <el-table
        :ref="'multipleTable'"
        :data="data.records"
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
        <el-table-column
          label="页面名称"
          header-align="center"
          align="center"
          prop="title"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          header-align="center"
          align="center"
          prop="createTime"
        >
        </el-table-column>
        <el-table-column label="页面状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ getStateString(scope.row.enable) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "addPageDialog",

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 1,
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      expired: false,
      listLoading: false,
      multipleSelection: [],
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
    };
  },
  created() {},
  methods: {
    rowKey(row) {
      return row.id;
    },
    open() {
      //console.log(this.editItem)
      this.getList();
      if (this.isAdd) {
      } else {
      }
    },
    doAdding() {
      this.$emit("addSuccess", this.multipleSelection);
    },

    onClose() {
      this.$emit("update:visible", false);
    },

    //0正常、1 待审核 、2 已拒绝、3用户删除  4 被系统拒绝  5 禁用

    getStateString(state) {
      let stateString = "";
      switch (state) {
        case 0:
          stateString = "当前非主页";
          break;
        case 1:
          stateString = "当前主页";
          break;

        default:
          stateString = "";
          break;
      }

      return stateString;
    },

    handleSelectionChange(val) {
      // console.log("handleSelectionChange", JSON.stringify(val));
      this.multipleSelection.splice(0);
      val.forEach((item) => {
        this.multipleSelection.push(item);
      });
    },
    dialogCheck(selection, row) {
      this.multipleSelection.splice(0);
      this.multipleSelection.push(row);
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

    //API

    getList() {
      this.$axios.get(this.API.newNetSchool.schoolPage.list).then((res) => {
        if (res) {
          this.data.records = res.data;
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./addPageDialog.scss";
.catory {
  width: 30%;
  height: 20rem;
  padding: 1rem;
  overflow-y: auto;
}
.imageTableContain {
  width: 70%;
  height: 20rem;
}
.imageTable {
  height: 90%;
  overflow-y: auto;
}
.catoryItem {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.3rem 0rem 0rem 0rem;
  span {
    margin-left: 0.2rem;
  }
}
.fileFolder {
  width: 1rem;
  height: 1rem;
}
/deep/ .has-gutter {
  .el-checkbox {
    display: none;
  }
}
::v-deep .el-dialog__footer {
  text-align: center !important;
}
</style>