<template>
  <div class="sdialog">
    <el-dialog
      width="25%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">{{ "H5网站" }}</div>
      <div class="flex row ai-c jc-c">
        <div class="qrcode" ref="qrCodeUrl"></div>
      </div>
      <div class="flex row ai-c jc-c">
        <p class="tx-008 tx-wb txc-60">可分享至微信、QQ中使用</p>
      </div>

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
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
        return { data: "" };
      },
    },
  },
  data() {
    return {
      url: "",
      qrcode: null,
    };
  },
  created() {},
  mounted() {},
  methods: {
    open() {
      //console.log(this.editItem)
      let school_id = localStorage.getItem("school_id");
      let id = localStorage.getItem("currentSchoolId");
      if (!this.url) {
        this.url =
          process.env.VUE_APP_BASIC_H5 +
          "?schoolBindId=" +
          id +
          "&pageId=" +
          this.editItem.data +
          "&clientType=1" +
          "&id=" +
          school_id;
        this.$nextTick(() => {
          this.creatQrCode();
        });
      } else {
        this.url =
          process.env.VUE_APP_BASIC_H5 +
          "?schoolBindId=" +
          id +
          "&pageId=" +
          this.editItem.data +
          "&clientType=1" +
          "&id=" +
          school_id;
        this.qrcode.clear();
        this.qrcode.makeCode(this.url);
      }

      if (this.isAdd) {
      } else {
      }
    },

    creatQrCode() {
      this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: this.url, // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
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
@import "./qrCodeDialog.scss";

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