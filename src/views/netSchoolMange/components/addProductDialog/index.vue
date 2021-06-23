<template>
  <div class="sdialog">
    <el-dialog
      width="55%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <!-- <div slot="title">{{ isAdd ? "添加商品" : "添加商品" }}</div> -->
      <!-- <div class="flex row ai-c">
        <el-input
          class="w-10"
          v-model="title"
          placeholder="请输入商品名称"
        ></el-input>
        <el-button class="ml-1" type="primary" @click="upLoad">搜索</el-button>
      </div> -->

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          label="图文"
          name="1"
          v-if="type == 1 || type == 5 || type == 6"
        >
          <text-image-view
            v-model="textImageData"
            :selectType="selectType"
          ></text-image-view>
        </el-tab-pane>
        <el-tab-pane
          label="视频"
          name="2"
          v-if="type == 2 || type == 5 || type == 6"
          ><video-view
            v-model="videoData"
            :selectType="selectType"
          ></video-view>
        </el-tab-pane>
        <!-- <el-tab-pane
          label="专栏"
          name="3"
          v-if="type == 3 || type == 5 || type == 6"
          ><column-view
            v-model="columnData"
            :selectType="selectType"
          ></column-view>
        </el-tab-pane> -->
        <el-tab-pane label="商品分组" name="4" v-if="type == 6"
          ><product-group-view
            v-model="productGroupData"
            :selectType="selectType"
          ></product-group-view>
        </el-tab-pane>
      </el-tabs>
      <!-- <div style="height: 2rem">
        <el-col :span="24" class="toolbar">
          <myPagination
            :current.sync="form.pageIndex"
            :pages.sync="data.pages"
            :size.sync="form.pageSize"
            :total.sync="data.total"
            @cb="currentChange"
          />
        </el-col>
      </div> -->

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">保存</el-button>
      </div>
    </el-dialog>
    <!-- <UpLoadImageDialog :visible.sync="innerVisible" @addSuccess="addSuccess">
    </UpLoadImageDialog> -->
  </div>
</template>

<script>
import TextImageView from "./subViews/textImageView";
import VideoView from "./subViews/videoView";
import ColumnView from "./subViews/columnView";
import ProductGroupView from "./subViews/productGroupView";

export default {
  name: "AddProductDialog",
  components: {
    TextImageView,
    VideoView,
    ColumnView,
    ProductGroupView,
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
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: Number,
      default: 1, //1图文 2 视频 3 专栏 4商品分组 5 图文  视频  专栏  6图文  视频  专栏 分组
    },
    selectType: {
      type: Number,
      default: 1, //1 多选  2单选
    },
  },

  data() {
    return {
      title: "",
      catoryName: "",
      innerVisible: false,
      multipleSelection: [],

      textImageData: [],
      videoData: [],
      columnData: [],
      productGroupData: [],

      activeName: "1",
      status: 100,
      selectioned: {}, //单选中的值
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      tabsData: [
        { name: "图文", id: 1 },
        { name: "视频", id: 2 },
        { name: "专栏", id: 3 },
      ],
      catoryData: ["默认分组", "最新上传", "精选图片"],

      tableData: [],
    };
  },
  open() {
    this.activeName = "1";
  },
  created() {
    
  },
  methods: {
    rowKey(row) {
      return row.id;
    },
    open() {
      //console.log(this.editItem)
      this.form.title = "";
      this.multipleSelection = [];
      this.form.pageIndex = 1;

      (this.activeName = "1"), (this.textImageData = []);
      this.videoData = [];
      this.columnData = [];
      this.productGroupData = [];

      this.$nextTick(() => {
        this.$bus.$emit("clearTableData", {});
      });
      // console.log("clearTableDataaaaa");

      if (this.isAdd) {
      } else {
      }
      if (this.type == 1) {
        // this.getList();
      } else {
        //this.getGroupList();
      }
    },
    upLoad() {
      this.innerVisible = true;
    },
    addSuccess() {
      this.innerVisible = false;
    },
    doAdding() {
      let imgData = [];
      this.textImageData.forEach((element) => {
        imgData.push(element);
      });
      this.videoData.forEach((element) => {
        imgData.push(element);
      });
      this.multipleSelection = imgData;

      if (this.selectType == 1) {
        //多选
        if (
          (!this.multipleSelection || this.multipleSelection.length < 1) &&
          (!this.columnData || this.columnData.length < 1)
        ) {
          this.$message.error("请选择商品");
          return;
        }
        this.$emit(
          "input",
          this.multipleSelection,
          [...this.columnData],
          [...this.productGroupData],
          this.activeName
        );
      } else {
        //单选

        if (
          this.activeName == "1" &&
          (!this.textImageData || this.textImageData.length < 1)
        ) {
          this.$message.error("请选择商品");
          return;
        } else if (
          this.activeName == "2" &&
          (!this.videoData || this.videoData.length < 1)
        ) {
          this.$message.error("请选择商品");
          return;
        } else if (
          this.activeName == "3" &&
          (!this.columnData || this.columnData.length < 1)
        ) {
          this.$message.error("请选择专栏");
          return;
        } else if (
          this.activeName == "4" &&
          (!this.productGroupData || this.productGroupData.length < 1)
        ) {
          this.$message.error("请选择分组");
          return;
        }
        this.$emit(
          "input",
          this.multipleSelection,
          [...this.columnData],
          [...this.productGroupData],
          this.activeName
        );
      }
    },
    mutiUpdate(params) {},
    update(params) {},
    onClose() {
      this.$emit("update:visible", false);
    },

    currentChange() {
      //console.log('index' + index)
      this.getList();
    },

    toggleSelection(rows) {
      let refs = "multipleTable" + this.activeName;

      if (rows) {
        rows.forEach((row) => {
          this.$refs[refs].toggleRowSelection(row);
        });
      } else {
        this.$refs[refs].clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dialogCheck(selection, row) {
      let refs = "multipleTable" + this.activeName;
      this.$refs["multipleTable1"].clearSelection();
      if (selection.length === 0) {
        // 判断selection是否有值存在
        return;
      }
      if (row) {
        this.selectioned = row;
        this.$refs["multipleTable1"].toggleRowSelection(row, true);
      }
    },

    handleClick(tab, event) {
      console.log(tab, event);
      this.form.title = "";
      this.multipleSelection = [];
      this.form.pageIndex = 1;
      this.getList();
    },

    //API

    //API

    getList() {
      let params = {
        pageSize: this.form.pageSize,
        pageIndex: this.form.pageIndex,
        model: {
          //onlineState: this.status,
          title: this.title,
          type: this.activeName,
        },
      };
      if (this.status == 100) {
        params = {
          pageSize: this.form.pageSize,
          pageIndex: this.form.pageIndex,
          model: {
            title: this.title,
            type: this.activeName,
          },
        };
      }
      console.log("222")
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
    getGroupList() {
      let params = {
        pageSize: this.form.pageSize,
        pageIndex: this.form.pageIndex,
        model: {
          // onlineState: this.status,
          title: this.title,
          type: this.activeName,
        },
      };
      if (this.status == 100) {
        params = {
          pageSize: this.form.pageSize,
          pageIndex: this.form.pageIndex,
          model: {
            title: this.title,
            type: this.activeName,
          },
        };
      }
      this.$axios
        .post(this.API.newNetSchool.schoolGroup.bindDataPage, params)
        .then((res) => {
          if (res) {
            this.tableData = res.records;
            this.data.pageIndex = res.pageIndex;
            this.data.total = res.total;
            (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
          }
        });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./addProductDialog.scss";
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
::v-deep .el-dialog__header{
  border-bottom:0px solid #fff;
  padding: 0px;

}
</style>