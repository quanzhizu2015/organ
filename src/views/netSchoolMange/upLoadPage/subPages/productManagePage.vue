<template>
  <div class="pd-2">
    <div class="flex row mb-05">
      <el-button type="primary" @click="addAction">添加商品</el-button>
      <div class="flex row jc-sb ml-2">
        <el-col :span="5">
          <el-select v-model="state" placeholder="请选择">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-col>
        <el-input
          class="w-10"
          v-model="name"
          placeholder="请输入商品名称"
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
      <el-table-column label="商品名称" align="center" prop="title">
      </el-table-column>
      <el-table-column label="状态" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ getStatuStr(scope.row.onlineState) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.onlineTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="resetItem(scope.row)"
            >移出分组</el-button
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
    <AddProductDialog
      :isAdd="isAddProduct"
      :visible.sync="isProductVisible"
      :editItem="productItem"
      @addSuccess="addProductSuccess"
      :type="5"
      @input="selectedProduct"
    />
  </div>
</template>

<script>
import AddProductDialog from "../../components/addProductDialog";
export default {
  components: {
    AddProductDialog,
  },
  data() {
    return {
      isAddProduct: 1,
      isProductVisible: false,
      productItem: {},
      groupId: "",
      name: "",
      state: 100,
      options: [
        { name: "全部", val: 100 },
        { name: "上架", val: 1 },
        { name: "下架", val: 0 },
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
    if (this.$route.query.groupId) {
      this.groupId = this.$route.query.groupId;
      this.getList();
    }
  },

  methods: {
    addAction() {
      this.isProductVisible = true;
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
    addProductSuccess() {
      this.isProductVisible = false;
    },
    selectedProduct(products, columns, productGroups, selectedType) {
      this.$confirm(
        "一个商品只属于一个商品分组，如果商品存在其他商品分组中，那么将会被移到当前分组中, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.isProductVisible = false;

          this.bindProduct(products);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    editItem(item) {},
    mangeItem(item) {},
    resetItem(item) {
      this.$confirm("此操作将该商品状态移出分组, 是否继续?", "提示", {
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
            message: "已取消操作",
          });
        });
    },
    searchAction() {
      this.getList();
    },

    handleSelectionChange() {},

    //API

    getList() {
      let params = {
        pageSize: this.form.pageSize,
        pageIndex: this.form.pageIndex,
        model: {
          onlineState: this.state,
          title: this.name,
          groupId: this.groupId,
        },
      };
      if (this.state == 100) {
        params = {
          pageSize: this.form.pageSize,
          pageIndex: this.form.pageIndex,
          model: {
            title: this.name,
            groupId: this.groupId,
          },
        };
      }
      console.log("777")
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

    bindProduct(products) {
      let dataIds = [];
      products.forEach((element) => {
        dataIds.push(element.id);
      });
      let params = {
        dataIds: dataIds,
        groupId: this.groupId,
      };
      this.$axios
        .post(this.API.newNetSchool.schoolGroup.bindData, params)
        .then((res) => {
          if (res) {
            this.getList();
            this.$message({
              type: "success",
              message: "添加成功!",
            });
          }
        });
    },

    delete(item) {
      let params = {
        dataId: item.id,
        groupId: this.groupId,
      };
      this.$axios
        .get(this.API.newNetSchool.schoolGroup.removeData, { params: params })
        .then((res) => {
          if (res) {
            this.getList();
            this.$message({
              type: "success",
              message: "移除成功!",
            });
          }
        });
    },
  },
};
</script>


<style scoped>
</style>