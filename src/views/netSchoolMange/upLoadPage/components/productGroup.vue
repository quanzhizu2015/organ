<template>
  <div>
    <div class="flex row jc-sb mb-05">
      <el-button type="primary" @click="addAction">新建商品分组</el-button>
      <div class="flex row jc-sb">
        <el-input
          class="w-10"
          v-model="name"
          placeholder="请输入商品分组名称"
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
      <el-table-column label="分组名称" align="center" prop="name">
      </el-table-column>
      <el-table-column label="商品数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItemAction(scope.row)"
            >编辑</el-button
          >

          <el-button type="text" size="small" @click="mangeItem(scope.row)"
            >内容管理</el-button
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
    <AddProductGroupDialog
      :visible.sync="addGroupVisible"
      :isAdd="isAdd"
      :editItem="editItem"
      @addSuccess="addGroupSuccess"
    >
    </AddProductGroupDialog>
  </div>
</template>

<script>
import AddProductGroupDialog from "../../components/addProductGroupDialog";
export default {
  components: {
    AddProductGroupDialog,
  },
  data() {
    return {
      addGroupVisible: false,
      name: "",
      editItem: {},
      isAdd: 1,
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
    addAction() {
      this.isAdd = 1;
      this.addGroupVisible = true;
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
        case 2: {
          return "下架";
          break;
        }
        default:
          return "";
          break;
      }
    },
    addGroupSuccess() {
      this.addGroupVisible = false;
      this.getList();
    },
    editItemAction(item) {
      this.editItem = item;
      this.isAdd = 0;
      this.addGroupVisible = true;
    },
    mangeItem(item) {
      this.$router.push({
        path: "/productManagePage",
        query: { groupId: item.id },
      });
    },
    resetItem(item) {
      this.$confirm("此操作将永久删除分组, 是否继续?", "提示", {
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
    searchAction() {
      this.form.pageIndex = 1;
      this.getList();
    },

    handleSelectionChange() {},
    //api
    getList() {
      let params = {
        pageSize: this.form.pageSize,
        pageIndex: this.form.pageIndex,
        model: {
          name: this.name,
        },
      };
      this.$axios
        .post(this.API.newNetSchool.schoolGroup.page, params)
        .then((res) => {
          if (res) {
            this.tableData = res.records;
            this.data.pageIndex = res.pageIndex;
            this.data.total = res.total;
            (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
          }
        });
    },

    delete(item) {
      this.$axios
        .get(this.API.newNetSchool.schoolGroup.remove + "?id=" + item.id)
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