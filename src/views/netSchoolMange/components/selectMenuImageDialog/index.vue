<template>
  <div class="sdialog">
    <el-dialog
      width="55%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">{{ isAdd ? "选择图片" : "选择图片" }}</div>

      <div class="ta-l">
        <div><span>从上传中心选择图片上传</span></div>
        <el-button type="primary" @click="upLoad">上传图片</el-button>
      </div>
      <div class="flex row fw-w mt-1 h-18 ovy-a">
        <div
          class="bo-b3 w-5 h-5 mr-03 mt-03 flex row ai-c jc-c itemImage cor-p"
          v-for="item in data"
          :key="item.url"
          @click="selectSingletImage(item)"
        >
          <img class="w-4 h-4 fsh-0 of-co" :src="item.url" />
        </div>
      </div>

      <div slot="footer" class="footer">
        <el-button @click="onClose">取消</el-button>
        <!-- <el-button type="primary" @click="doAdding">保存</el-button> -->
      </div>
    </el-dialog>
    <!-- <SelectImageDialog
      :isAdd="isAdd"
      :visible.sync="innerVisible"
      :editItem="item"
      @addSuccess="addSuccess"
    /> -->

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
import AddFilesDialog from "../addFilesDialog";
export default {
  name: "SelectMenuImageDialog",
  components: { AddFilesDialog },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      innerVisible: false,
      item: {},
      isAdd: 1,

      isImageVisible: false,

      data: [],
    };
  },
  created() {
    // let images = [];
    // for (let i = 1; i < 17; i++) {
    //   let url = "https://trainfiles.msjsol.com/icon/h5/" + i;
    //   for (let j = 1; j < 5; j++) {
    //     let urlJ = url + "-" + j + ".png";
    //     images.push({ id: i+j, url: urlJ });
    //   }
    // }
    // this.data = images;
  },
  methods: {
    open() {
      this.getList();
      if (this.isAdd) {
      } else {
      }
    },
    upLoad() {
      this.isImageVisible = true;
    },

    doAdding() {},
    onClose() {
      this.$emit("update:visible", false);
    },
    selectSingletImage(item) {
      this.$emit("addSuccess", item.url);
      this.$emit("update:visible", false);
    },
    addImageSuccess() {},
    selectedImage(items, showType) {
      // console.log("selectedImage" + JSON.stringify(items) + showType);
      this.isImageVisible = false;
      let url = "";
      items.forEach((element) => {
        url = element.url;
      });

      this.$emit("addSuccess", url);
      this.$emit("update:visible", false);
    },

    //API
    getList() {
      this.$axios.post(this.API.newNetSchool.schoolData.sysIcon).then((res) => {
        if (res) {
          this.data = res.data;
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./selectMenuImageDialog.scss";
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

.itemImage:hover {
  border: 1px #0670fa solid;
}
</style>