<template>
  <div>
    <div class="ta-l"><span>轮播图</span></div>
    <div
      class="flex row ai-c bo-b3 pd-1 mt-1"
      v-for="item in value.divDatas"
      :key="item.id + item.url"
    >
      <img class="w-6 h-4" :src="item.url" @click="imageReselect(item)" />
      <div class="ml-02">
        <el-input
          size="small "
          v-model="item.title"
          placeholder="请输入标题"
          maxlength="12"
          show-word-limit
        ></el-input>
        <div class="flex column jc-fs" style="width: 200px">
          <el-select
            class="mt-02"
            style="width: 100%"
            size="small"
            v-model="item.jumpType"
            placeholder="请选择"
            @visible-change="changeUrl($event, item)"
          >
            <el-option
              v-for="option in options"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            >
            </el-option>
          </el-select>
          <div class="w-p100">
            <span class="tx-008 txc-60 ds-1 ta-l w-p100">
              {{
                item.jumpType == 1
                  ? item.dataTitle
                  : item.jumpDetail == "1"
                  ? ""
                  : item.jumpDetail
              }}
            </span>
          </div>
        </div>
      </div>
      <div class="ml-1" @click="deleteItem(value, item)">
        <i class="el-icon-delete-solid" />
      </div>
    </div>
    <el-button
      style="margin-top: 2rem"
      type="primary"
      class="w-full"
      @click="add"
      >添加轮播</el-button
    >
    <div>
      <span class="tx-008 tx-wb txc-60"
        >建议尺寸750x280像素，图片大小不超过2M，建议最多添加12个轮播图</span
      >
    </div>

    <!--图文封面-->
    <AddFilesDialog
      :visible.sync="isImageVisible"
      @addSuccess="addImageSuccess"
      :type="1"
      @input="selectedImage"
    />

    <AddProductDialog
      :isAdd="isAddProduct"
      :visible.sync="isProductVisible"
      :editItem="productItem"
      @addSuccess="addProductSuccess"
      :type="5"
      :selectType="2"
      @input="selectedProduct"
    />

    <AddCustomLinkDialog
      :visible.sync="linkVisible"
      :editItem="productItem"
      @addSuccess="addLinkSuccess"
    >
    </AddCustomLinkDialog>
  </div>
</template>
<script>
import AddProductDialog from "../../components/addProductDialog";
import AddCustomLinkDialog from "../../components/addCustomLinkDialog";
import AddFilesDialog from "../../components/addFilesDialog";
import $ from "jquery";
export default {
  name: "SetBanner",
  components: {
    AddCustomLinkDialog,
    AddProductDialog,
    AddFilesDialog,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return { divDatas: [] };
      },
    },
  },
  data() {
    return {
      isImageVisible: false,

      isAddProduct: 1,
      isProductVisible: false,
      linkVisible: false,
      imageItem: {},
      productItem: {},

      length: this.value.divDatas.length,

      options: [
        { type: 1, name: "知识商品" },
        { type: 2, name: "自定义链接" },
      ],
    };
  },
  created() {
    this.$on("goEdit", () => {
      //this.getInfo();
    });
  },
  watch: {
    value(val) {
      this.length = val.divDatas.length;
    },
  },
  methods: {
    imageReselect(item) {
      this.isImageVisible = true;
      this.imageItem = item;
    },
    add() {
      this.imageItem = null;
      this.isImageVisible = true;
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
      } else {
        let item = {
          clickUrl: "", //点击图标
          dataId: 0, //绑定的数据源
          jumpDetail: "", //跳转详情,如果是外部跳转就是具体链接,如果是内部跳转,1:图文,2:视频,3:文本,4:商品组
          jumpType: "", //跳转类型 1:内部跳转,2:外部链接
          subDivData: [],
          title: "", //标题
          dataTitle: "", //商品名称
          dataCoverUrl: "", //商品封面
          type: 1, //组件数据类型 1:非关联数据,2:tab数据,3:关联单数据,4:关联数据组
          url: url, //链接
          id: this.length++,
          tag: this.length++,
          isGoods: 0, //是否商品 0:不是,1:是
          abbre: "", //简介
          compatible: 1, //1:图文,2:纯文本
        };
        this.value.divDatas.push(item);
      }
    },

    addProductSuccess() {
      this.isProductVisible = false;
    },

    selectedProduct(products, columnData, productData, selectedType) {
      //selectedType 1图文 2 视频 3 专栏 4 商品组
      //jumpDetail :1:图文,2:视频,3:文本,4:商品组
      this.isProductVisible = false;
      this.productItem.jumpType = 1;

      if (selectedType == "1") {
        this.productItem.jumpDetail = "1";
        products.forEach((item) => {
          this.productItem.dataId = item.id;
          this.productItem.dataTitle = item.title;
          this.productItem.isGoods = item.isGoods;
        });
      } else if (selectedType == "2") {
        this.productItem.jumpDetail = "2";
        products.forEach((item) => {
          this.productItem.dataId = item.id;
          this.productItem.dataTitle = item.title;
          this.productItem.isGoods = item.isGoods;
        });
      } else if (selectedType == "3") {
        columnData.forEach((item) => {
          this.productItem.dataId = item.id;
        });
      } else if (selectedType == "4") {
        this.productItem.jumpDetail = "4";
        productData.forEach((item) => {
          this.productItem.dataId = item.id;
        });
      }
      console.log("products" + JSON.stringify(products));
      console.log("columnData" + JSON.stringify(columnData));
      console.log("productData" + JSON.stringify(productData));
      console.log("selectedType" + selectedType);
      console.log("productItem" + this.productItem);
    },

    deleteItem(item, product) {
      item.divDatas.splice($.inArray(product, item.divDatas), 1);
    },

    addLinkSuccess(linkUrl) {
      this.linkVisible = false;
      this.productItem.jumpType = 2;
      this.productItem.jumpDetail = linkUrl;
      console.log("linkUrl", linkUrl);
    },

    changeUrl(val, item) {
      if (val == false) {
        if (item.jumpType == 1) {
          this.productItem = item;
          this.isProductVisible = true;
        } else {
          this.productItem = item;
          this.linkVisible = true;
        }
      } else {
      }
    },
  },
};
</script>
<style scoped>
</style>