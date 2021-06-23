<template>
  <div>
    <div class="ta-l"><span>分类导航</span></div>
    <div class="ta-l">
      <div>
        <span class="tx-008 tx-wb txc-60">样式列表</span>
      </div>
      <div>
        <el-radio v-model="value.listStyle" :label="1">列表</el-radio>
        <el-radio v-model="value.listStyle" :label="2">小图</el-radio>
        <el-radio v-model="value.listStyle" :label="3">大图</el-radio>
        <el-radio v-model="value.listStyle" :label="4">九宫格</el-radio>
      </div>
      <div class="ta-l flex row jc-sb mt-05">
        <span class="tx-008 tx-wb txc-60">标题</span>
        <el-input
          size="small "
          v-model="value.title"
          placeholder="请输入标题"
          class="w-15"
          maxlength="12"
          show-word-limit
        ></el-input>
      </div>
      <div class="ta-l flex row jc-sb mt-05">
        <span class="tx-008 tx-wb txc-60">当前展示个数</span>
        <el-input
          size="small "
          v-model="value.pageSize"
          placeholder="请输入数量(1-50的整数)"
          class="w-6"
          oninput="if(value > 99 || value < 0 ){value = ''}"
          onkeyup="value=value.replace(/[^\d]/g,'');"
        ></el-input>
      </div>
      <div class="ta-l flex row jc-sb mt-05">
        <span class="tx-008 tx-wb txc-60">是否显示标题</span>
        <el-checkbox
          v-model="value.showTitle"
          :true-label="1"
          :false-label="0"
        ></el-checkbox>
      </div>
      <div class="ta-l flex row jc-sb mt-05">
        <span class="tx-008 tx-wb txc-60">是否显示更多</span>
        <el-checkbox
          v-model="value.showMore"
          :true-label="1"
          :false-label="0"
        ></el-checkbox>
      </div>
    </div>
    <!-- <div class="ta-l">
      <div>
        <span class="tx-008 tx-wb txc-60">商品来源</span>
      </div>
      <div>
        <el-radio v-model="value.isGroup" label="1">手动选择</el-radio>
        <el-radio v-model="value.isGroup" label="2">商品分组</el-radio>
      </div>
    </div> -->
    <div
      class="flex column ai-c bo-b3 pd-1 mt-1"
      style="width: 17rem"
      v-for="(item, index) in value.divDatas"
      :key="item.url + index"
    >
      <div class="ml-02 flex column ai-c">
        <el-input
          size="small "
          v-model="item.title"
          placeholder="请输入标题"
          class="w-15"
          maxlength="12"
          show-word-limit
        ></el-input>
        <div
          class="flex column ai-c bo-b3 pd-1 mt-1"
          v-for="(product, index) in item.subDivData"
          :key="index"
        >
          <div class="flex row w-p100 ai-c mt-05">
            <img
              class="w-6 h-4"
              :src="product.url"
              @click="imageReselect(product)"
            />
            <div class="flex column ml-02">
              <el-input
                v-model="product.title"
                placeholder="请输入标题"
                maxlength="40"
                show-word-limit
              ></el-input>
              <!-- <span class="tx-008 tx-wb txc-60 w-2 mr-1">简介</span> -->
              <el-input
                type="textarea"
                v-model="product.abbre"
                placeholder="请输入简介"
                maxlength="200"
                show-word-limit
              ></el-input>
            </div>
          </div>

          <div class="mt-05 flex row ai-c">
            <el-radio v-model="product.compatible" :label="1">图文</el-radio>
            <el-radio v-model="product.compatible" :label="2">纯文本</el-radio>
            <div class="pd-1" @click="deleteItem(item, product)">
              <i class="el-icon-delete-solid" />
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="ta-l">
        <div>
          <span class="tx-008 tx-wb txc-60">当前展示个数</span>
        </div>
        <div>
          <el-radio v-model="item.isShowAll" label="1">
            <el-input
              size="small "
              v-model="item.count"
              placeholder="请输入数量"
              class="w-6"
            ></el-input>
          </el-radio>
          <el-radio v-model="item.isShowAll" label="2">显示全部</el-radio>
        </div>
      </div> -->
      <div class="flex row ai-c mt-1">
        <el-button icon="el-icon-plus" @click="addProduct(item)"
          >添加商品</el-button
        >
        <div class="ml-1" @click="deleteTabItem(value, item)">
          <i class="el-icon-delete-solid" />
        </div>
      </div>
    </div>
    <el-button
      style="margin-top: 2rem"
      type="primary"
      class="w-full"
      @click="add"
      >添加分类</el-button
    >
    <AddProductDialog
      :isAdd="isAddProduct"
      :visible.sync="isProductVisible"
      :editItem="productItem"
      @addSuccess="addProductSuccess"
      :type="5"
      :selectType="2"
      @input="selectedProduct"
    />
    <!--图文封面-->
    <AddFilesDialog
      :visible.sync="isImageVisible"
      @addSuccess="addImageSuccess"
      :type="1"
      @input="selectedImage"
    />
  </div>
</template>
<script>
import AddProductDialog from "../../components/addProductDialog";
import AddFilesDialog from "../../components/addFilesDialog";
import $ from "jquery";
export default {
  name: "SetCatory",
  components: {
    AddProductDialog,
    AddFilesDialog,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return { divDatas: [], listStyle: 1, pageSize: 10 };
      },
    },
  },
  data() {
    return {
      isAddProduct: 1,
      isProductVisible: false,
      productItem: {},
      imageItem: {},
      length: 3,
      productLength: 3,
      isImageVisible: false,
    };
  },
  created() {
    this.$on("goEdit", () => {
      //this.getInfo();
    });
  },
  methods: {
    add() {
      let item = {
        clickUrl: "", //点击图标
        dataId: 0, //绑定的数据源
        jumpDetail: "", //跳转详情,如果是外部跳转就是具体链接,如果是内部跳转,1:图文,2:视频,3:文本,4:商品组,5:教师详情
        jumpType: 1, //跳转类型 1:内部跳转,2:外部链接
        subDivData: [],
        title: "标题", //标题
        dataTitle: "", //商品名称
        dataCoverUrl: "", //商品封面
        type: 1, //组件数据类型 1:非关联数据,2:tab数据,3:关联单数据,4:关联数据组
        url: "", //链接
        id: this.length++,
        tag: this.length++,
        isGoods: 0, //是否商品 0:不是,1:是
        saleModel: 2, //售卖方式 1:付费,2:免费,3:加密
        abbre: "", //简介
        compatible: 1, //1:图文,2:纯文本
        price: 0,
      };
      this.value.divDatas.push(item);
    },
    imageReselect(item) {
      this.isImageVisible = true;
      this.imageItem = item;
    },

    addImageSuccess() {},
    selectedImage(items, showType) {
      // console.log("selectedImage" + JSON.stringify(items) + showType);
      this.isImageVisible = false;
      let url = "";
      items.forEach((element) => {
        url = element.url;
      });
      if (this.imageItem) {
        this.imageItem.url = url;
      }
    },
    addProduct(item) {
      this.productItem = item;
      this.isProductVisible = true;
    },

    addProductSuccess() {
      this.isProductVisible = false;
    },

    selectedProduct(products, columnData, productData, selectedType) {
      //selectedType 1图文 2 视频 3 专栏 4 商品组
      //jumpDetail :1:图文,2:视频,3:文本,4:商品组
      this.isProductVisible = false;

      let product = {
        clickUrl: "", //点击图标
        dataId: 0, //绑定的数据源
        jumpDetail: "", //跳转详情,如果是外部跳转就是具体链接,如果是内部跳转,1:图文,2:视频,3:文本,4:商品组,5:教师详情
        jumpType: 1, //跳转类型 1:内部跳转,2:外部链接
        subDivData: [],
        title: "标题", //标题
        dataTitle: "", //商品名称
        dataCoverUrl: "", //商品封面
        type: 1, //组件数据类型 1:非关联数据,2:tab数据,3:关联单数据,4:关联数据组
        url: "", //链接
        id: this.productLength++,
        tag: this.productLength++,
        isGoods: 0, //是否商品 0:不是,1:是
        saleModel: 2, //售卖方式 1:付费,2:免费,3:加密
        abbre: "", //简介
        compatible: 1, //1:图文,2:纯文本
        price: 0,
      };

      product.jumpType = 1;

      if (selectedType == "1") {
        product.jumpDetail = "1";
        products.forEach((item) => {
          product.dataId = item.id;
          product.title = item.title;
          product.dataTitle = item.title;
          product.abbre = item.abbre;
          product.dataCoverUrl = item.coverUrl;
          product.url = item.coverUrl;
          product.price = item.price;
          product.isGoods = item.isGoods;
          product.saleModel = item.saleModel;
        });
      } else if (selectedType == "2") {
        product.jumpDetail = "2";
        products.forEach((item) => {
          product.dataId = item.id;
          product.title = item.title;
          product.dataTitle = item.title;
          product.abbre = item.abbre;
          product.dataCoverUrl = item.coverUrl;
          product.url = item.coverUrl;
          product.price = item.price;
          product.isGoods = item.isGoods;
          product.saleModel = item.saleModel;
        });
      } else if (selectedType == "3") {
        columnData.forEach((item) => {
          product.dataId = item.id;
        });
      } else if (selectedType == "4") {
        product.jumpDetail = "4";
        productData.forEach((item) => {
          product.dataId = item.id;
          product.title = item.name;
        });
      }
      this.productItem.subDivData.push(product);
      console.log("products" + JSON.stringify(products));
      console.log("columnData" + JSON.stringify(columnData));
      console.log("productData" + JSON.stringify(productData));
      console.log("selectedType" + selectedType);
      console.log("productItem" + this.productItem);
    },

    deleteItem(item, product) {
      item.subDivData.splice($.inArray(product, item.subDivData), 1);
    },
    deleteTabItem(item, product) {
      item.divDatas.splice($.inArray(product, item.divDatas), 1);
    },
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