<template>
  <div>
    <div class="ta-l"><span>小程序</span></div>
    <span class="tx-008 tx-wb txc-60"
      >说明: 1、需前往[微信公众号-设置-关注公众号]
      启用该功能后才可生效。该处仅支持配置组件展示的页面；
      2、仅当用户扫码访问小程序时展示该组件;
      3、用户点击可直接关注，已关注用户会显示查看按钮。</span
    >
    <!-- <div class="ta-l flex row jc-sb mb-1 mt-1">
      <span class="tx-008 tx-wb txc-60">封面</span>
      <AliImageSmallUpload
        :imageUrl.sync="value.coverImage"
        :configUrl="API.upLoadImageApi.upLoadImageConfig"
      />
    </div>
    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">公众号名称</span>
      <el-input
        size="small "
        v-model="value.accountName"
        placeholder="请输入名称"
        class="w-15"
      ></el-input>
    </div>
    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">引导文案</span>
      <el-input
        size="small "
        v-model="value.guideText"
        placeholder="请输入文案"
        class="w-15"
      ></el-input>
    </div>
    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">按钮文案</span>
      <el-input
        size="small "
        v-model="value.buttonText"
        placeholder="请输入文案"
        class="w-15"
      ></el-input>
    </div>

    <div class="ta-l mt-05">
      <div>
        <span class="tx-008 tx-wb txc-60">暂时次数限制</span>
      </div>
      <div>
        <el-radio v-model="value.timesLimit" label="1">有限制</el-radio>
        <el-radio v-model="value.timesLimit" label="2">无限制</el-radio>
      </div>
    </div>

    <div class="w-p100 bg-b3 mt-2 mb-1" style="height: 1px"></div>

    <div class="ta-l"><span>弹窗设置</span></div>
    <div class="ta-l"><span class="tx-008 tx-wb txc-60">提示文案</span></div>

    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">第一行</span>
      <el-input
        size="small "
        v-model="value.line1Text"
        placeholder="请输入文案"
        class="w-15"
      ></el-input>
    </div>
    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">第二行</span>
      <el-input
        size="small "
        v-model="value.line2Text"
        placeholder="请输入文案"
        class="w-15"
      ></el-input>
    </div>

    <div class="ta-l flex row jc-sb mt-1">
      <span class="tx-008 tx-wb txc-60">公众号二维码</span> 
       <AliImageSmallUpload
        :imageUrl.sync="value.codeImage"
        :configUrl="API.upLoadImageApi.upLoadImageConfig"
      />
    </div> -->

    <SelectImageDialog
      :isAdd="isAdd"
      :visible.sync="isVisible"
      :editItem="item"
      @addSuccess="addSuccess"
    />
  </div>
</template>
<script>
import SelectImageDialog from "../../components/selectImageDialog";
import AliImageSmallUpload from "@/components/Upload/AliImageSmallUpload.vue";
import $ from "jquery";
export default {
  name: "SetProgram",
  components: {
    SelectImageDialog,
    AliImageSmallUpload,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          data: [],
          isLargeImage: "1",
          isGroup: "1",
          showTitle: true,
          showMore: true,
        };
      },
    },
  },
  data() {
    return {
      isAdd: 1,
      isVisible: false,
      item: {},
      length: 3,
      //   data: [
      //     {
      //       type: 1,
      //       title: "",
      //       url:
      //         "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.wallcoo.com%2Fnature%2F2010_Landscape_1920_Desktop_11%2Fwallpapers%2F1280x800%2FMoose%2520Pond%2520and%2520Mount%2520Pleasant%2520in%2520Autumn%252C%2520Maine.jpg&refer=http%3A%2F%2Fwww.wallcoo.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620799339&t=13d7885bb8fd6bc9f36bfe807e4ed413",
      //     },
      //   ],
    };
  },
  created() {
    this.$on("goEdit", () => {
      //this.getInfo();
    });
  },
  methods: {
    add() {
      this.item = {
        type: 1,
        id: this.length + 1,
        catory: "已经更新四期",
        url:
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic25.nipic.com%2F20121106%2F1048288_223400985000_2.jpg&refer=http%3A%2F%2Fpic25.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620891974&t=ab7241cdc8c3bc4b844088343f5a51d0",
        title: "商品1",
        price: 1,
      };
      this.value.data.push(this.item);
      //this.isVisible = true;
    },
    addProduct(data) {
     
      let product = {
        catory: "已经更新四期",
        url:
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic25.nipic.com%2F20121106%2F1048288_223400985000_2.jpg&refer=http%3A%2F%2Fpic25.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620891974&t=ab7241cdc8c3bc4b844088343f5a51d0",
        title: "商品1",
        price: 1,
        id: this.length + 1,
      };
      if (data.data == null) {
       
        let array = new Array();
        array.push(product);
        data.data = array;
      } else {
       
        data.data.push(product);
      }

     
    },
    deleteItem(data, product) {
      data.splice($.inArray(product, data), 1);
    },

    addSuccess() {},
  },
};
</script>
<style lang="scss" scoped>
.w-full {
  width: 100%;
}
.col-b {
  color: #2a75ed;
}
.col-w {
  color: #fff;
}
.fs-08 {
  font-size: 0.8rem;
}
.fs-05 {
  font-size: 0.5rem;
}
</style>