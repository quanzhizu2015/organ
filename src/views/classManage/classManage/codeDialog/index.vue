<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :show-close="true"
      :close-on-click-modal="false"
      :before-close="handleClose"
      @open="open"
      width="40%"
      center
    >
      <div slot="title">新增</div>
      <div class="code-content">
        <div class="qrcode" ref="qrCodeUrl"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "CodeDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {
        return {
          className: "",
        };
      },
    },
  },
  mounted: function () {
    //this.creatQrCode(this.item.className);
  },

  methods: {
    open() {
      if(this.qrcode){
         this.qrcode.clear();
        this.qrcode.makeCode(this.item.className)
      }else{
         this.creatQrCode(this.item.className);
      }

    },

    creatQrCode(url) {
      this.$nextTick(function () {
        setTimeout(() => {
         this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: url, //this.link, // 需要转换为二维码的内容
            width: 130,
            height: 130,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
        }, 4000);
      });
    },

    handleClose() {
      this.$emit("update:visible", false);
    },
  },
  data() {
    return {
      qrcode:null
    };
  },
};
</script>


<style lang="scss" scoped>
@import "./codeDialog.scss";
</style>