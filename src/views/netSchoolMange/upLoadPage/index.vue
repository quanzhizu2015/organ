<template>
  <div class="pd-2">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="图文设置" name="1">
        <text-image v-if="isShow0"></text-image>
      </el-tab-pane>
      <el-tab-pane label="视频设置" name="2">
        <text-video v-if="isShow1"></text-video
      ></el-tab-pane>
      <el-tab-pane label="视频" name="3">
        <up-video v-if="isShow2"></up-video>
      </el-tab-pane>
      <el-tab-pane label="图片" name="4"
        ><up-image v-if="isShow3"></up-image>
      </el-tab-pane>
      <el-tab-pane label="文档" name="5">
        <up-doc v-if="isShow4"></up-doc
      ></el-tab-pane>
      <el-tab-pane label="商品分组" name="6"
        ><product-group v-if="isShow5"></product-group
      ></el-tab-pane>
      <!-- <el-tab-pane label="专栏" name="7"
        ><column-group v-if="isShow6"></column-group
      ></el-tab-pane> -->
    </el-tabs>
    <!-- <text-image-page v-show="type == '1'"></text-image-page>
    <text-video-page v-show="type == '2'"></text-video-page> -->
    <ExpireSchoolPage v-show="expired"></ExpireSchoolPage>
  </div>
</template>

<script>
import TextImage from "./components/textImage";
import TextVideo from "./components/textVideo";
import UpVideo from "./components/upVideo";
import UpImage from "./components/upImage";
import UpDoc from "./components/upDoc";
import ProductGroup from "./components/productGroup";
import ColumnGroup from "./components/columnGroup";
// import TextImagePage from "./subPages/textImagePage";
// import TextVideoPage from "./subPages/textVideoPage";
import ExpireSchoolPage from "@/views/netSchoolMange/components/expireSchool";
export default {
  components: {
    TextImage,
    TextVideo,
    UpVideo,
    UpImage,
    UpDoc,
    ProductGroup,
    ColumnGroup,
    ExpireSchoolPage,
    // TextImagePage,
    // TextVideoPage,
  },

  created() {
    this.serverDate()
  },

  mounted() {
    console.log("this.$route.query.type" + this.$route.query.type);
    if (this.$route.query.type) {
      this.activeName = this.$route.query.type;
      if (this.activeName == "2") {
        this.isShow1 = true;
      }
    } else {
      this.activeName = "1";
      if (this.activeName == "1") {
        this.isShow0 = true;
      }
    }
  },

  data() {
    return {
      type: 100,
      activeName: "",
      expired: false,

      isShow0: true,
      isShow1: false,
      isShow2: false,
      isShow3: false,
      isShow4: false,
      isShow5: false,
      isShow6: false,
      textImageForm: {
        pageIndex: 1,
        pageSize: 10,
      },
      textImageData: {
        pageIndex: 1,
        pages: 0,
        pageSize: 10,
        total: 0,
        records: [],
      },
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.index);
      //if (tab.paneName == "first") {
      if (tab.index == 0) {
        this.isShow0 = true;
        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShow4 = false;
        this.isShow5 = false;
        this.isShow6 = false;
      } else if (tab.index == 1) {
        this.isShow0 = false;
        this.isShow1 = true;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShow4 = false;
        this.isShow5 = false;
        this.isShow6 = false;
      } else if (tab.index == 2) {
        this.isShow0 = false;
        this.isShow1 = false;
        this.isShow2 = true;
        this.isShow3 = false;
        this.isShow4 = false;
        this.isShow5 = false;
        this.isShow6 = false;
      } else if (tab.index == 3) {
        this.isShow0 = false;
        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = true;
        this.isShow4 = false;
        this.isShow5 = false;
        this.isShow6 = false;
      } else if (tab.index == 4) {
        this.isShow0 = false;
        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShow4 = true;
        this.isShow5 = false;
        this.isShow6 = false;
      } else if (tab.index == 5) {
        this.isShow0 = false;
        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShow4 = false;
        this.isShow5 = true;
        this.isShow6 = false;
      } else if (tab.index == 6) {
        this.isShow0 = false;
        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShow4 = false;
        this.isShow5 = false;
        this.isShow6 = true;
      }
    },
    addTextImage() {},
    currentChangeTextImage() {},
    getStatuStr(statu) {
      switch (statu) {
        case 1: {
          return "上架";
          break;
        }
        case 2: {
          return "下架";
          break;
        }
        default:
          return "";
          break;
      }
    },
    editTextImageItem(item) {},
    restTextImageItem(item) {},
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

    handleSelectionTextImageChange() {},
  },
};
</script>

<style scoped>
</style>