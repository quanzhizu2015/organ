<template>
  <div>
    <div class="flex row jc-sb">
      <el-button type="primary" @click="upLoad">上传视频</el-button>

      <div class="flex row jc-sb">
        <el-input
          class="w-10"
          v-model="imageName"
          placeholder="请输入视频名称"
          @keydown.native="searchImageHandler"
        ></el-input>
        <el-button class="ml-1" type="primary" @click="searchAction"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="flex row jc-sb mt-1">
      <div class="bo-b3 catory">
        <div class="flex row ai-c mb-1 jc-sb">
          <span class="tx-1 tx-wb txc-60">视频分组</span>
          <!-- <el-button class="ml-1" type="primary" @click="doAdding"
            >添加分组</el-button
          > -->
        </div>
        <el-input
          v-model="catoryName"
          @keydown.native="searchHandler"
          placeholder="请输入分组名称"
        ></el-input>
        <div
          v-for="item in catoryData"
          :key="item.id"
          :class="[
            'flex',
            'row',
            'ai-c',
            'tx-09',
            item.isSelected ? 'txc-fb' : '',
          ]"
          @click="selectGroup(item)"
          @mouseover="mouseover(item)"
          @mouseleave="mouseleave(item)"
        >
          <div class="catoryItem">
            <img class="fileFolder" src="@/assets/school/flieFloder.png" />
            <span>{{ item.name }}</span>
          </div>
          <!-- <div v-show="item.isOver && item.id != 0" class="ml-1 flex row ai-c">
            <div @click.stop="editGroupAction(item)" class="plr-03">
              <i class="el-icon-edit"></i>
            </div>

            <div @click.stop="delGroupAction(item)" class="plr-03">
              <i class="el-icon-delete"></i>
            </div>
          </div> -->
        </div>
      </div>
      <div class="imageTableContain ml-1">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          border
          height="320"
          :row-key="rowKey"
          @selection-change="handleSelectionChange"
          @select="dialogCheck"
          :header-cell-style="{
            background: '#08223c',
            color: '#fff',
            border: 'none',
          }"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column label="视频名称" width="400">
            <template slot-scope="scope">
              <img
                class="w-6 h-4 of-co"
                :src="rzImageUlr(scope.row.coverUrl, 200, 100)"
                @click="openVideo(scope.row.url)"
              />
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="大小">
            <template slot-scope="scope">
              <span>{{ (scope.row.size / 1024).toFixed(2) + "M" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="上传时间" width="200">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span>{{ getStateStr(scope.row.state) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editItemAction(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="delItemAction(scope.row)"
                >删除</el-button
              >

              <el-link
                target="_blank"
                :href="scope.row.url"
                :underline="false"
                style="margin-left: 15px"
              >
                <el-button type="text">下载</el-button>
              </el-link>
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
    </div>

    <UpLoadImageDialog
      :visible.sync="innerVisible"
      @addSuccess="addSuccess"
      :type="2"
    >
    </UpLoadImageDialog>

    <ChangeTitleDialog
      :visible.sync="changeTitleVisible"
      :editItem="changeTitleItem"
      @addSuccess="changeTitleSuccess"
      :currentGroup="selectGroupItem"
      :type="2"
    >
    </ChangeTitleDialog>
    <AddGroupDialog
      :visible.sync="addGroupVisible"
      :editItem="eidtGroupItem"
      :isAdd="isAddGroup"
      @addSuccess="addGroupSuccess"
      :type="2"
    >
    </AddGroupDialog>
  </div>
</template>

<script>
import UpLoadImageDialog from "../../upLoadImageDialog";
import ChangeTitleDialog from "../../changeTitleDialog";
import AddGroupDialog from "../../addGroupDialog";
import ResizeImg from "@/utils/tool.js";
export default {
  name: "UpVideo",
  components: {
    UpLoadImageDialog,
    ChangeTitleDialog,
    AddGroupDialog,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 1,
    },
    type: {
      type: Number,
      default: 1, //1 2 3 单选 4 多选
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    value(val) {
      this.multipleSelection = val;
    },
  },
  data() {
    return {
      imageName: "",
      catoryName: "",
      selectGroupItem: { id: 0, name: "默认分组" },
      innerVisible: false,
      addGroupVisible: false,
      changeTitleVisible: false,
      multipleSelection: this.value,
      selectioned: {}, //单选中的值
      changeTitleItem: {},
      eidtGroupItem: {},
      isAddGroup: 1,
      form: {
        pageIndex: 1,
        pageSize: 10,
      },

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      catoryData: [],
      tableData: [],
    };
  },
  created() {
    this.$bus.$on("clearFileData", (params) => {
      this.clearSelection();
      //this.getList()
    });
  },
  beforeDestroy() {
    // 在组件销毁之前清除自定义事件
    this.$bus.$off("clearFileData");
  },
  mounted() {
    // this.getGroup();
    // this.getList();
  },
  methods: {
    rzImageUlr: ResizeImg.rzImageUlr,
    openVideo(url) {
      window.open(url);
    },
    rowKey(row) {
      return row.id;
    },
    open() {
      if (this.isAdd) {
      } else {
      }
    },
    clearSelection() {
      this.$nextTick(() => {
        this.$refs.multipleTable && this.$refs.multipleTable.clearSelection();
        this.getGroup();
        this.getList();
      });
    },

    mouseover(item) {
      item.isOver = true;
    },
    mouseleave(item) {
      item.isOver = false;
    },

    searchAction() {
      this.form.pageIndex = 1;
      this.getList();
    },

    getStateStr(state) {
      switch (state) {
        case 0:
          {
            return "正常";
          }
          break;
        default:
          return "";
          break;
      }
    },
    doAdding() {
      this.isAddGroup = 1;
      this.addGroupVisible = true;
    },
    addGroupSuccess() {
      this.getGroup();
      this.addGroupVisible = false;
    },
    upLoad() {
      //this.innerVisible = true;
      this.$emit("upLoadShow", 2);
    },
    reloadData() {
      this.getList();
    },
    addSuccess() {
      this.getList();
      this.innerVisible = false;
    },
    changeTitleSuccess() {
      this.getList();
      this.changeTitleVisible = false;
    },

    currentChange() {
      this.getList();
    },
    selectGroup(item) {
      this.catoryData.forEach((itemData) => {
        itemData.isSelected = false;
      });
      item.isSelected = true;
      this.selectGroupItem = item;
      this.getList();
    },
    blur() {
      this.getGroup();
    },

    searchHandler() {
      this.getGroup();
    },
    searchImageHandler() {
      this.getList();
    },
    editGroupAction(item) {
      this.eidtGroupItem = item;
      this.isAddGroup = 0;
      this.addGroupVisible = true;
    },
    delGroupAction(item) {
      this.$confirm("此操作将永久删除该分组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteGroup(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editItemAction(item) {
      this.changeTitleItem = item;
      this.changeTitleVisible = true;
    },
    delItemAction(item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
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

    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      //console.log("handleSelectionChange", JSON.stringify(val));
      if (this.type == 4) {
        this.multipleSelection.splice(0);
        val.forEach((item) => {
          this.multipleSelection.push(item);
        });
      }
    },
    dialogCheck(selection, row) {
      if (this.type == 4) {
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
      console.log("dialogCheck", JSON.stringify(row));
    },

    //API

    getGroup() {
      this.$axios
        .get(this.API.newNetSchool.material.groupSelect, {
          params: { name: this.catoryName, type: 2 },
        })
        .then((res) => {
          let records = [];
          res.data.forEach((element) => {
            records.push({
              ...element,
              isOver: false,
              isSelected: element.id == this.selectGroupItem.id ? true : false,
            });
          });
          this.catoryData = records;
        });
    },
    getList() {
      let params = {
        pageSize: this.form.pageSize,
        pageIndex: this.form.pageIndex,
        model: {
          groupId: this.selectGroupItem.id,
          title: this.imageName,
          type: 2,
        },
      };
      this.$axios
        .post(this.API.newNetSchool.material.page, params)
        .then((res) => {
          this.tableData = res.records;
          this.data.pageIndex = res.pageIndex;
          this.data.total = res.total;
          (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
          //this.toggleSelection(this.multipleSelection);
        });
    },
    delete(item) {
      let params = {
        id: item.id,
      };
      this.$axios
        .get(this.API.newNetSchool.material.remove, { params: params })
        .then((res) => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
    },

    deleteGroup(item) {
      this.$axios
        .get(this.API.newNetSchool.group.remove + "?id=" + item.id)
        .then((res) => {
          if (res) {
            this.getGroup();
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


<style lang="scss" scoped>
.catory {
  width: 20%;
  height: 22rem;
  padding: 1rem;
  overflow-y: auto;
}
.imageTableContain {
  width: 80%;
  //height: 22rem;
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
  padding: 0rem 0rem 0rem 0rem;
  cursor: pointer;
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
</style>