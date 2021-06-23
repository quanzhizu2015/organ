<template>
  <div class="sdialog">
    <el-dialog
      width="70%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
      :append-to-body="true"
    >
      <!-- <div slot="title">{{ isAdd ? "添加素材" : "添加素材" }}</div> -->
      <!-- <div class="flex row ai-c">
        <el-input
          class="w-10"
          v-model="title"
          placeholder="请输入素材名称"
        ></el-input>
        <el-button class="ml-1" type="primary" @click="upLoad">搜索</el-button>
      </div> -->

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-if="type == 1 || type == 4" :label="'图片'" name="1">
          <images-view
            ref="imageView"
            v-model="imagesData"
            @upLoadShow="upLoadShow"
            :type="type"
          ></images-view>
        </el-tab-pane>
        <el-tab-pane v-if="type == 2 || type == 4" label="视频" name="2">
          <videos-view
            ref="videoView"
            v-model="filesData"
            @upLoadShow="upLoadShow"
            :type="type"
          ></videos-view>
        </el-tab-pane>
        <el-tab-pane v-if="type == 3 || type == 4" label="文档" name="3">
          <files-view
            ref="filesView"
            v-model="videosData"
            @upLoadShow="upLoadShow"
            :type="type"
          ></files-view>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">保存</el-button>
      </div>
    </el-dialog>
    <UpLoadImageDialog
      :visible.sync="innerVisible"
      @addSuccess="addSuccess"
      :type="upLoadType"
      :isCheckSize="isCheckSize"
    >
    </UpLoadImageDialog>
  </div>
</template>

<script>
import AliMultiUpload from "@/components/Upload/AliMultiUpload";
import AliOssUpload from "@/components/Upload/AliOssUpload";
import UpLoadImageDialog from "../upLoadImageDialog";
import FilesView from "./subViews/filesView";
import ImagesView from "./subViews/imagesView";
import VideosView from "./subViews/videosView";

export default {
  name: "AddFilesDialog",
  components: {
    AliOssUpload,
    AliMultiUpload,
    UpLoadImageDialog,
    FilesView,
    ImagesView,
    VideosView,
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
    isCheckSize: {
      type: Boolean,
      default: true,
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: Number,
      default: 1, //1 普通  2分组商品
    },
  },

  data() {
    return {
      isShow0: true,
      isShow1: false,
      isShow2: false,

      imagesData: [],
      filesData: [],
      videosData: [],

      upLoadType: 1,

      title: "",
      catoryName: "",
      innerVisible: false,
      multipleSelection: [],
      activeName:
        this.type == 1
          ? "1"
          : this.type == 2
          ? "2"
          : this.type == 3
          ? "3"
          : "1",
      status: 100,
      selectioned: {}, //单选中的值
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },

      tableData: [],
    };
  },
  open() {
    this.activeName = "1";
  },
  created() {},
  methods: {
    open() {
      //console.log(this.editItem)
      this.form.title = "";
      this.multipleSelection = [];
      this.form.pageIndex = 1;

      // if (this.isAdd) {
      // } else {
      // }
      // if (this.type == 1) {
      //   this.getList();
      // } else {
      //   this.getGroupList();
      // }
      (this.imagesData = []),
        (this.filesData = []),
        (this.videosData = []),
        this.$nextTick(() => {
          this.$bus.$emit("clearFileData", {});
        });
    },
    upLoad() {
      this.innerVisible = true;
    },
    upLoadShow(showType) {
      this.innerVisible = true;
      this.upLoadType = showType;
    },
    addSuccess(showType) {
      this.innerVisible = false;
      if (showType == 1) {
        this.$refs.imageView && this.$refs.imageView.reloadData();
      } else if (showType == 2) {
        this.$refs.videoView && this.$refs.videoView.reloadData();
      } else if (showType == 3) {
        this.$refs.filesView && this.$refs.filesView.reloadData();
      }
    },
    doAdding() {
      //   if (!this.multipleSelection || this.multipleSelection.length < 1) {
      //     this.$message.error("请选择商品");
      //     return;
      //   }
      //   console.log(this.multipleSelection);
      console.log("imagesData" + JSON.stringify(this.imagesData));
      console.log("filesData" + this.filesData);
      console.log("videosData" + this.videosData);
      let items = [];
      this.imagesData.forEach((element) => {
        items.push(element);
      });
      this.filesData.forEach((element) => {
        items.push(element);
      });
      this.videosData.forEach((element) => {
        items.push(element);
      });
      if (items.length < 1) {
        this.$message.error("未选中的图片、视频或文档");
        return;
      }
      this.$emit("input", items, this.type);
    },
    mutiUpdate(params) {},
    update(params) {},
    onClose() {
      this.$emit("update:visible", false);
    },

    currentChange() {
      //console.log('index' + index)
      //this.getList();
    },

    toggleSelection(rows) {
      let refs = "multipleTable" + this.activeName;
      console.log(refs);
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
      console.log(val);
    },
    dialogCheck(selection, row) {
      console.log(selection);
      console.log(row);
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
      if (tab.index == 0) {
        this.isShow0 = true;
        this.isShow1 = false;
        this.isShow2 = false;
      } else if (tab.index == 1) {
        this.isShow0 = false;
        this.isShow1 = true;
        this.isShow2 = false;
      } else if (tab.index == 2) {
        this.isShow0 = false;
        this.isShow1 = false;
        this.isShow2 = true;
      }
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
      console.log("111");
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
@import "./addFilesDialog.scss";
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
::v-deep .el-dialog__header {
  border-bottom: 0px solid #fff;
  padding: 0px;
}
</style>