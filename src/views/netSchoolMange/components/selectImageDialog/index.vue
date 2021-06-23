<template>
  <div class="sdialog">
    <el-dialog
      width="55%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">{{ isAdd ? "选择图片" : "选择图片" }}</div>
      <div class="flex row jc-sb">
        <el-button type="primary" @click="upLoad">上传图片</el-button>
        <el-input
          class="w-10"
          v-model="imageName"
          placeholder="请输入图片名称"
        ></el-input>
      </div>
      <div class="flex row jc-sb mt-1">
        <div class="bo-b3 catory">
          <el-input v-model="catoryName" placeholder="请输入分组"></el-input>
          <div class="catoryItem" v-for="item in catoryData" :key="item">
            <img class="fileFolder" src="@/assets/school/flieFloder.png" />
            <span>{{ item }}</span>
          </div>
        </div>
        <div class="imageTableContain">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange"
            @select="dialogCheck"
            height="280"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="图片" width="120">
              <template slot-scope="scope">
                <img class="w-6 h-4" :src="scope.row.url" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip>
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
      </div>

      <div slot="footer" class="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">保存</el-button>
      </div>
    </el-dialog>
    <UpLoadImageDialog :visible.sync="innerVisible" @addSuccess="addSuccess">
    </UpLoadImageDialog>
  </div>
</template>

<script>
import AliMultiUpload from "@/components/Upload/AliMultiUpload";
import AliOssUpload from "@/components/Upload/AliOssUpload";
import UpLoadImageDialog from "../upLoadImageDialog";
export default {
  name: "SelectImageDialog",
  components: { AliOssUpload, AliMultiUpload, UpLoadImageDialog },
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
      imageName: "",
      catoryName: "",
      innerVisible: false,
      multipleSelection: [],
      selectioned: {}, //单选中的值
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      catoryData: ["默认分组", "最新上传", "精选图片"],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.kuoo8.com%2Fwall_up%2Fhsf2288%2F200802%2F2008022722065367913.jpg&refer=http%3A%2F%2Fwww.kuoo8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620637527&t=5a45b21c6c8ec74026d654fd3ce03636",
          select: false,
          id: 1,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.kuoo8.com%2Fwall_up%2Fhsf2288%2F200802%2F2008022722065367913.jpg&refer=http%3A%2F%2Fwww.kuoo8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620637527&t=5a45b21c6c8ec74026d654fd3ce03636",
          select: false,
          id: 2,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.kuoo8.com%2Fwall_up%2Fhsf2288%2F200802%2F2008022722065367913.jpg&refer=http%3A%2F%2Fwww.kuoo8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620637527&t=5a45b21c6c8ec74026d654fd3ce03636",
          select: false,
          id: 3,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.kuoo8.com%2Fwall_up%2Fhsf2288%2F200802%2F2008022722065367913.jpg&refer=http%3A%2F%2Fwww.kuoo8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620637527&t=5a45b21c6c8ec74026d654fd3ce03636",
          select: false,
          id: 4,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.kuoo8.com%2Fwall_up%2Fhsf2288%2F200802%2F2008022722065367913.jpg&refer=http%3A%2F%2Fwww.kuoo8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620637527&t=5a45b21c6c8ec74026d654fd3ce03636",
          select: false,
          id: 5,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.kuoo8.com%2Fwall_up%2Fhsf2288%2F200802%2F2008022722065367913.jpg&refer=http%3A%2F%2Fwww.kuoo8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620637527&t=5a45b21c6c8ec74026d654fd3ce03636",
          select: false,
          id: 6,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.kuoo8.com%2Fwall_up%2Fhsf2288%2F200802%2F2008022722065367913.jpg&refer=http%3A%2F%2Fwww.kuoo8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620637527&t=5a45b21c6c8ec74026d654fd3ce03636",
          select: false,
          id: 7,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.kuoo8.com%2Fwall_up%2Fhsf2288%2F200802%2F2008022722065367913.jpg&refer=http%3A%2F%2Fwww.kuoo8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620637527&t=5a45b21c6c8ec74026d654fd3ce03636",
          select: false,
          id: 8,
        },
      ],
    };
  },
  created() {},
  methods: {
    open() {
      
      if (this.isAdd) {
      } else {
      }
    },
    upLoad() {
      this.innerVisible = true;
    },
    addSuccess() {
      this.innerVisible = false;
    },
    doAdding() {},
    mutiUpdate(params) {},
    update(params) {},
    onClose() {
      this.$emit("update:visible", false);
    },

    currentChange() {
     
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
      this.multipleSelection = val;
    },
    dialogCheck(selection, row) {
      console.log(selection);
      console.log(row);
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
  },
};
</script>


<style lang="scss" scoped>
@import "./selectImageDialog.scss";
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
</style>