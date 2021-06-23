<template>
  <div class="sdialog">
    <el-dialog
      width="25%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      @close="close"
      :show-close="false"
    >
      <div slot="title">{{ "请用微信扫码支付" }}</div>
      <div class="flex row ai-c jc-c">
        <div class="qrcode" ref="qrCodeUrl"></div>
      </div>
      <div class="flex row ai-c jc-c mt-2">
        <p class="tx-008 tx-wb txc-red">注意：购买小程序请确认H5服务到期时间，如果H5服务比小程序服务提前到期，那么小程序服务被停止使用。</p>
      </div>

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <!-- <el-button type="primary" @click="doAdding">确定</el-button> -->
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
    orderItem: {
      type: Object,
      default: () => {
        return { id: "" };
      },
    },
  },
  data() {
    return {
      url: "",
      qrcode: null,
      orderDetailData: {},
      timer: null,
      timeCount: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    open() {
      //console.log(this.editItem)
      if (!this.url) {
        this.url = this.editItem.data;
        this.$nextTick(() => {
          this.creatQrCode();
        });
      } else {
        this.url = this.editItem.data;
        this.qrcode.clear();
        this.qrcode.makeCode(this.url);
      }

      this.timer = setInterval(() => {
        this.timeCount++;
        if (this.timeCount > 60) {
          this.$message({
            message: "支付超时",
            type: "success",
          });
          this.$emit("addSuccess", this.url);
        }
        this.getOrderDetail();
      }, 1000);

      if (this.isAdd) {
      } else {
      }
    },

    close() {
      console.log("close");
      if (this.timer) {
        this.timeCount = 0;
        clearInterval(this.timer);
        this.timer = null;
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
    getOrderDetail() {
      this.$axios
        .post(
          this.API.newNetSchool.schoolOrder.detail +
            "?orderId=" +
            this.orderItem.id
        )
        .then((res) => {
          if (res) {
            if (res) {
              this.orderDetailData = res.data;
              if (res.data.state == 2) {
                this.$message({
                  message: "支付成功",
                  type: "success",
                });
                this.$emit("addSuccess", this.url);
              }
            }
          }
        });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./payCodeDialog.scss";

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