<template>
  <div>
    <div class="ta-l"><span>公众号</span></div>
    <div class="ta-l flex row jc-sb mb-1 mt-1">
      <span class="tx-008 tx-wb txc-60">封面</span>
      <AliImageSmallUpload
        :imageUrl.sync="value.applets"
        :configUrl="API.upLoadImageApi.upLoadImageConfig"
      />
    </div>
    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">公众号名称</span>
      <el-input
        size="small "
        v-model="value.title"
        placeholder="请输入名称"
        class="w-15"
        maxlength="10"
        show-word-limit
      ></el-input>
    </div>
    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">引导文案</span>
      <el-input
        size="small "
        v-model="value.guideWords"
        placeholder="请输入文案"
        class="w-15"
        maxlength="10"
        show-word-limit
      ></el-input>
    </div>
    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">按钮文案</span>
      <el-input
        size="small "
        v-model="value.buttonWords"
        placeholder="请输入文案"
        class="w-15"
        maxlength="4"
        show-word-limit
      ></el-input>
    </div>

    <!-- <div class="ta-l mt-05">
      <div>
        <span class="tx-008 tx-wb txc-60">暂时次数限制</span>
      </div>
      <div>
        <el-radio v-model="value.timesLimit" label="1">有限制</el-radio>
        <el-radio v-model="value.timesLimit" label="2">无限制</el-radio>
      </div>
    </div> -->

    <div class="w-p100 bg-b3 mt-2 mb-1" style="height: 1px"></div>

    <div class="ta-l"><span>弹窗设置</span></div>
    <div class="ta-l"><span class="tx-008 tx-wb txc-60">提示文案</span></div>
    <div v-for="(item, index) in value.divDatas" :key="'account' + index">
      <div class="ta-l flex row jc-sb mt-05">
        <span class="tx-008 tx-wb txc-60">第一行</span>
        <el-input
          size="small "
          v-model="item.title"
          placeholder="请输入文案"
          class="w-15"
          maxlength="10"
          show-word-limit
        ></el-input>
      </div>
      <div class="ta-l flex row jc-sb mt-05">
        <span class="tx-008 tx-wb txc-60">第二行</span>
        <el-input
          size="small "
          v-model="item.abbre"
          placeholder="请输入文案"
          class="w-15"
          maxlength="10"
          show-word-limit
        ></el-input>
      </div>

      <div class="ta-l flex row jc-sb mt-1">
        <span class="tx-008 tx-wb txc-60">公众号二维码</span>
        <AliImageSmallUpload
          :imageUrl.sync="item.url"
          :configUrl="API.upLoadImageApi.upLoadImageConfig"
        />
      </div>
    </div>

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
  name: "SetAccount",
  components: {
    SelectImageDialog,
    AliImageSmallUpload,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          divDatas: [],
          applets: "", //微信
          buttonWords: "", //按钮文案
          contact: "", //联系方式
          guideWords: "", //引导文案
          title: "", //标题
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
      console.log(data);
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