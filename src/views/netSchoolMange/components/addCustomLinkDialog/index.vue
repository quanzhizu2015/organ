<template>
  <div class="sdialog">
    <el-dialog
      width="55%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">{{ isAdd ? "自定义链接" : "自定义链接" }}</div>
      <div class="flex row ai-c">
        <el-input v-model="url" placeholder="请输入链接"></el-input>
      </div>
      <div class="mt-2 ta-l">
        <p class="tx-008 tx-wb txc-60 txc-red">
          1.自定义链接必须是https://或者http://开头的完整链接；2.小程序不支持自定义链接功能
        </p>
      </div>

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "LinkAccountDialog",

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
      url: "",
    };
  },
  created() {},
  methods: {
    open() {
      //console.log(this.editItem)
      this.url = "";
      if (this.isAdd) {
      } else {
      }
    },
    doAdding() {
      this.$emit("addSuccess", this.url);
    },

    onClose() {
      this.$emit("update:visible", false);
    },

    //API
  },
};
</script>


<style lang="scss" scoped>
@import "./addCustomLinkDialog.scss";
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