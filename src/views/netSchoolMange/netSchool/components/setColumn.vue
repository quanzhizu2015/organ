<template>
  <div>
    <div class="ta-l"><span>专栏</span></div>

    <div class="ta-l flex row jc-sb">
      <span class="tx-008 tx-wb txc-60">是否显示标题</span>
      <el-checkbox v-model="value.showTitle"></el-checkbox>
    </div>
    <div class="ta-l flex row jc-sb">
      <span class="tx-008 tx-wb txc-60">标题</span>
      <el-input
        size="small "
        v-model="value.title"
        placeholder="请输入标题"
        class="w-15"
      ></el-input>
    </div>
    <div
      class="flex row ai-c pd-03 bg-b3 mt-1 w-full jc-sb"
      v-for="(product, index) in value.divDatas"
      :key="index"
      @click="deleteItem(value.divDatas, product)"
    >
      <div class="flex row ai-c">
        <span class="col-b fs-08">{{ product.catory }}</span>
        <span class="ml-03 fs-05">{{ product.title }}</span>
      </div>
      <i class="el-icon-delete-solid" />
    </div>
    <el-button
     v-show="!value.data || value.data.length<1"
      style="margin-top: 2rem"
      type="primary"
      class="w-full"
      @click="add"
      >添加专栏</el-button
    >
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
import $ from "jquery";
export default {
  name: "SetColumn",
  components: {
    SelectImageDialog,
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