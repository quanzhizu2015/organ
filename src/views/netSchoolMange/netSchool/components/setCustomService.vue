<template>
  <div>
    <div class="ta-l"><span>联系客服</span></div>
    <el-form
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="left"
    >
      <el-form-item label="引导方式" required>
        <div>
          <el-radio v-model="value.guideType" :label="1">弹窗引导</el-radio>
          <el-radio v-model="value.guideType" :label="2">跳转链接</el-radio>
        </div>
      </el-form-item>
    </el-form>

    <div v-show="value.guideType == '1'">
      <el-form
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="联系方式" required>
          <div class="flex column ai-s">
            <!-- <el-checkbox v-model="value.contact">联系电话</el-checkbox> -->
            <span>联系电话</span>
            <el-input
              size="small "
              v-model="value.contact"
              placeholder="请输入电话"
              class="w-15"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="微信" required>
          <AliImageSmallUpload
            :imageUrl.sync="value.applets"
            :configUrl="API.upLoadImageApi.upLoadImageConfig"
          />
        </el-form-item>
        <el-form-item label="提示文案">
          <el-input
            type="textarea"
            v-model="value.guideWords"
            placeholder="请输入文案"
            :rows="15"
            class="w-15"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="value.guideType == '2'">
      <el-form
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="跳转链接" required>
          <el-input
            size="small "
            v-model="value.jumpDetail"
            placeholder="请输入链接地址"
            class="w-15"
          ></el-input>

          <div class="mt-1">
            <p class="tx-008 tx-wb txc-60 txc-red lh-105">
              自定义链接必须是https://或者http://开头的完整链接
            </p>
          </div>
        </el-form-item>
      </el-form>
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
  name: "SetCustomService",
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