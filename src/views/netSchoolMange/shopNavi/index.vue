<template>
  <div class="flex row">
    <div class="home flex column jc-sb">
      <div class="flex-between px-20 mh-4">
        <i class="el-icon-arrow-left" style="font-size: 18px"></i>
        <p>首页</p>
        <img src="@/assets/school/sl.png" alt style="width: 24px" />
      </div>
      <div class="tabBar flex row jc-sb ai-c">
        <div
          v-for="(item, index) in tableData"
          :key="item.tags + index"
          class="flex column ai-c pd-05"
        >
          <img class="w-013 h-013" :src="item.url" />
          <span class="tx-07">{{ item.title }}</span>
        </div>
      </div>
    </div>
    <div class="ml-1 pd-3 w-p80">
      <div class="flex row ai-c">
        <span class="tx-008 tx-wb txc-60 mr-1">导航文字选中状态颜色</span>
        <el-color-picker v-model="color1"></el-color-picker>
        <el-button class="ml-3" @click="reset">重置</el-button>
      </div>
      <div class="mt-1">
        <div>
          <span class="tx-008 tx-wb txc-60 mr-1">导航栏设置</span>
          <span class="tx-05 mr-1">最多可设置5个导航</span>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="导航名称" width="200">
            <template slot-scope="scope">
              <!-- <span style="margin-left: 10px">{{ scope.row.name }}</span> -->
              <el-input
                size="small "
                v-model="scope.row.title"
                placeholder="请输入导航名字"
                class="w-10"
                maxlength="4"
                :disabled="!scope.row.removable"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="跳转链接" width="200">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  scope.row.removable == 0
                    ? scope.row.title
                    : scope.row.jumpType == 2
                    ? scope.row.jumpDetail
                    : scope.row.dataTitle
                "
                placement="top"
              >
                <el-select
                  class="w-10"
                  size="small"
                  v-model="scope.row.jumpType"
                  :placeholder="
                    scope.row.removable ? '请选择' : scope.row.title
                  "
                  @change="changeUrl"
                  @visible-change="vchangeUrl($event, scope.row)"
                  :disabled="!scope.row.removable"
                >
                  <el-option
                    v-for="option in options"
                    :key="option.type"
                    :label="
                      scope.row.removable == 0 ? scope.row.title : option.name
                    "
                    :value="option.type"
                  >
                  </el-option>
                </el-select>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="默认图标" width="200">
            <template slot-scope="scope">
              <img
                class="w-205 h-2"
                :src="scope.row.url"
                @click="changeImage(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="选中图标" width="200">
            <template slot-scope="scope">
              <img
                class="w-205 h-2"
                :src="scope.row.clickUrl"
                @click="changeImageSelect(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              > -->
              <el-button
                v-show="scope.row.removable != 0"
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button v-show="tableData.length < 5" class="mt-2" @click="add"
          >添加导航</el-button
        >
        <el-button type="primary" class="ml-3" @click="saveAction"
          >保存</el-button
        >
      </div>
    </div>
    <!-- <SelectMenuImageDialog :visible.sync="isVisible" @addSuccess="addSuccess" /> -->
    <AddProductDialog
      :isAdd="isAddProduct"
      :visible.sync="isProductVisible"
      :editItem="productItem"
      @addSuccess="addProductSuccess"
      :type="6"
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

    <!--图文封面-->
    <!-- <AddFilesDialog
      :visible.sync="isImageSelectVisible"
      @addSuccess="addImageSelectSuccess"
      :type="1"
      @input="selectedSelectImage"
    /> -->
    <AddCustomLinkDialog
      :visible.sync="linkVisible"
      @addSuccess="addLinkSuccess"
    >
    </AddCustomLinkDialog>

    <AddPageDialog :visible.sync="pageVisible" @addSuccess="addPageSuccess">
    </AddPageDialog>
    <SelectMenuImageDialog
      :visible.sync="menuImageVisible"
      @addSuccess="selectedImage"
    >
    </SelectMenuImageDialog>
    <SelectMenuImageDialog
      :visible.sync="isMenuImageVisible"
      @addSuccess="selectedSelectImage"
    >
    </SelectMenuImageDialog>
    <ExpireSchoolPage v-show="expired"></ExpireSchoolPage>
  </div>
</template>

<script>
import SelectMenuImageDialog from "../components/selectMenuImageDialog";
import AddFilesDialog from "../components/addFilesDialog";
import AddCustomLinkDialog from "../components/addCustomLinkDialog";
import AddProductDialog from "../components/addProductDialog";
import ExpireSchoolPage from "@/views/netSchoolMange/components/expireSchool";
import AddPageDialog from "../components/addPageDialog";
export default {
  components: {
    AddProductDialog,
    AddCustomLinkDialog,
    AddFilesDialog,
    ExpireSchoolPage,
    SelectMenuImageDialog,
    AddPageDialog,
  },
  data() {
    return {
      expired: false,
      color1: "#52C98E",
      isVisible: false,

      isAddProduct: 1,
      isProductVisible: false,
      productItem: {},

      isImageVisible: false,
      linkVisible: false,
      pageVisible: false,
      imageItem: {},

      isImageSelectVisible: false,

      menuImageVisible: false,
      isMenuImageVisible: false,

      length: 4,

      options: [
        { type: 1, name: "知识商品" },
        { type: 2, name: "自定义链接" },
        { type: 3, name: "历史主页" },
      ],

      isEdit: true,
      tableData: [],
    };
  },
  created() {
    this.serverDate();
  },
  mounted() {
    this.getDetail();
  },
  // beforeRouteLeave(to, from, next) {

  //   this.$confirm("当前数据未保存，离开页面将会丢失, 是否继续?", "提示", {
  //     confirmButtonText: "确定",
  //     cancelButtonText: "取消",
  //     type: "warning",
  //   })
  //     .then(() => {
  //       next();
  //     })
  //     .catch(() => {
  //       next(false);
  //     });
  // },

  methods: {
    reset() {
      this.color1 = "#0cbb08";
    },
    add() {
      if (this.tableData.length >= 5) {
        return;
      }
      this.tableData.splice(this.tableData.length - 1, 0, {
        clickUrl: "https://trainfiles.msjsol.com/navigation/navigation11.png",
        jumpDetail: "",
        jumpType: "",
        title: "tab",
        dataTitle: "",
        url: "https://trainfiles.msjsol.com/navigation/navigation12.png",
        tags: this.length++,
        color: "#0cbb08",
        removable: 1, //可删除 0:不可删除,1:可删除
        dataId: "",
      });
    },
    changeUrl(val) {
      // console.log(val);
      // if (val == 1) {
      //   this.isProductVisible = true;
      // }else{
      //   this.linkVisible = true;
      // }
    },
    vchangeUrl(val, item) {
      if (val == false) {
        this.imageItem = item;
        console.log(JSON.stringify(item));
        if (item.jumpType == 1) {
          this.isProductVisible = true;
        } else if (item.jumpType == 3) {
          this.pageVisible = true;
        } else {
          this.linkVisible = true;
        }
      } else {
      }
    },
    handleEdit(index, row) {},
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
    },
    changeImage(item) {
      this.imageItem = item;
      this.menuImageVisible = true;
    },
    changeImageSelect(item) {
      this.imageItem = item;
      this.isMenuImageVisible = true;
    },

    // addSuccess() {},
    addLinkSuccess(linkUrl) {
      this.linkVisible = false;
      this.imageItem.jumpType = 2;
      this.imageItem.jumpDetail = linkUrl;
      console.log("linkUrl", linkUrl);
    },

    addPageSuccess(page) {
      this.pageVisible = false;
      this.imageItem.jumpType = 3;
      this.imageItem.jumpDetail = "5";
      page.forEach((item) => {
        this.imageItem.dataId = item.id;
        this.imageItem.dataTitle = item.title;
      });
      console.log("page:", JSON.stringify(page));
    },

    addImageSelectSuccess() {},
    // selectedSelectImage(items, showType) {
    //   // console.log("selectedImage" + JSON.stringify(items) + showType);
    //   this.isMenuImageVisible = false;
    //   items.forEach((element) => {
    //     this.imageItem.clickUrl = element.url;
    //   });
    // },
    selectedSelectImage(url) {
      this.isMenuImageVisible = false;
      this.imageItem.clickUrl = url;
    },
    addImageSuccess() {},
    selectedImage(url) {
      this.menuImageVisible = false;
      this.imageItem.url = url;
    },

    addProductSuccess() {
      this.isProductVisible = false;
    },
    selectedProduct(products, columnData, productData, selectedType) {
      //selectedType 1图文 2 视频 3 专栏 4 商品组
      //jumpDetail :1:图文,2:视频,3:文本,4:商品组
      this.isProductVisible = false;
      this.imageItem.jumpType = 1;

      if (selectedType == "1") {
        this.imageItem.jumpDetail = "1";
        products.forEach((item) => {
          this.imageItem.dataId = item.id;
          this.imageItem.dataTitle = item.title;
        });
      } else if (selectedType == "2") {
        this.imageItem.jumpDetail = "2";
        products.forEach((item) => {
          this.imageItem.dataId = item.id;
          this.imageItem.dataTitle = item.title;
        });
      } else if (selectedType == "3") {
        columnData.forEach((item) => {
          this.imageItem.dataId = item.id;
        });
      } else if (selectedType == "4") {
        //商品组
        this.imageItem.jumpDetail = "4";
        productData.forEach((item) => {
          this.imageItem.dataId = item.id;
          this.imageItem.dataTitle = item.name;
        });
      }
      console.log("products" + JSON.stringify(products));
      console.log("columnData" + JSON.stringify(columnData));
      console.log("productData" + JSON.stringify(productData));
      console.log("selectedType" + selectedType);
      console.log("imageItem" + this.imageItem);
    },

    saveAction() {
      this.save();
    },

    //api
    getDetail() {
      this.$axios.post(this.API.newNetSchool.schoolNavi.detail).then((res) => {
        if (res) {
          //           clickUrl	integer($int32)
          // 点击显示图片链接

          // jumpDetail	integer($int32)
          // 跳转详情,如果是外部跳转就是具体链接,如果是内部跳转,1:跳转主页,2:跳转我的

          // jumpType	integer($int32)
          // 跳转类型 1:内部跳转,2:外部链接

          // title*	string
          // 标题

          // url	integer($int32)
          // 没选中的图片链接

          if (!res.data || res.data.length < 1) {
            this.tableData = [
              {
                clickUrl: "https://trainfiles.msjsol.com/navigation/home11.png",
                jumpDetail: "/netHome",
                jumpType: 1,
                title: "首页",
                dataTitle: "首页",
                url: "https://trainfiles.msjsol.com/navigation/home12.png",
                tags: 0,
                color: "#0cbb08",
                removable: 0, //可删除 0:不可删除,1:可删除
                dataId: "",
              },
              {
                clickUrl: "https://trainfiles.msjsol.com/navigation/me11.png",
                jumpDetail: "/detailPage",
                jumpType: 1,
                title: "我的",
                dataTitle: "我的",
                url: "https://trainfiles.msjsol.com/navigation/me12.png",
                tags: 1,
                color: "#0cbb08",
                removable: 0, //可删除 0:不可删除,1:可删除
                dataId: "",
              },
            ];
          } else {
            let tabs = [];
            res.data.forEach((element) => {
              if (element.removable) {
                tabs.push({ ...element, tags: this.length++ });
              } else {
                tabs.push({ ...element, tags: this.length++, jumpType: 1 });
              }
              if (element.color) {
                this.color1 = element.color;
              }
            });
            this.tableData = tabs;
          }
        }
      });
    },

    serverDate() {
      this.$axios
        .get(this.API.newNetSchool.schoolPage.serverDate)
        .then((res) => {
          if (res) {
            if (res.code == 0) {
              if (res.data.expire) {
                this.expired = true;
              } else {
                this.expired = false;
              }
            }
          }
        });
    },

    save() {
      let isData = true;

      let params = [];
      this.tableData.forEach((item) => {
        if (
          item.removable &&
          (!item.jumpDetail || !item.url || !item.clickUrl)
        ) {
          isData = false;
        }
        params.push({ ...item, color: this.color1 });
      });
      if (!isData) {
        this.$message.error("数据必须填写完整");
        return;
      }

      this.$axios
        .post(this.API.newNetSchool.schoolNavi.save, params)
        .then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 25rem;
  height: 90vh;
  padding: 0 0 0 0;
  background: gray;
  overflow-y: hidden;
  overflow-x: hidden;
  border: #b3b3b3 1px solid;
  .tabBar {
    background-color: #fff;

    height: 4rem;
    padding-left: 20px;
    padding-right: 20px;
  }

  .px-20 {
    padding-left: 20px;
    padding-right: 20px;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: #fff;
  }
}
</style>