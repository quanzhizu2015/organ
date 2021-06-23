<template>
  <div class="paint relative">
    <div class="relative pb-20">
      <el-form
        ref="form"
        v-loading="isLoading"
        :model="paint"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="栏目名称">
          <el-input v-model="paint.displayName" placeholder="请输入" maxlength="4" show-word-limit />
        </el-form-item>
        <el-form-item label="上传画作">
          <AliOssMultiUpload :image="image" @input="update" />
        </el-form-item>

        <el-form-item label="画作列表">
          <div style="overflow-y:auto;" class="flex-wrap lb">
            <div v-for="(img,t) in lists" :key="t" class="list">
              <img :src="getUrl(img.url)" style="width:60px;height:60px;image-orientation: from-image" />
              <i class="el-icon-delete del" @click="onDeting(t)"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="save">
      <p class="tips">编辑栏目名称以及删除上传照片后请按保存</p>
      <el-button type="primary" class="w-full" style="margin-bottom:10px" @click="doAdding">保存</el-button>
    </div>
  </div>
</template>
<script>
// import editArticalDialog from "./editArticalDialog";
import AliOssMultiUpload from "@/components/Upload/AliOssMultiUpload";
export default {
  components: { AliOssMultiUpload },
  data() {
    return {
      isLoading: false,
      paint: {
        displayName: "",
      },
      lists: [],
      isEditDialogVisible: false,
      image: [],
    };
  },
  created() {
    this.$on("goEdit", () => {
      this.getInfo();
    });
  },
  methods: {
     getUrl(url) {
      if (url) {
        return url.indexOf("x-oss-process=image") != -1
          ? url
          : url + "?x-oss-process=image/auto-orient,1";
      } else {
        return url;
      }
    },
    getInfo() {
      this.$axios
        .post("train/schoolWeb/getSchoolInfoByGroupId", {
          id: localStorage.getItem("school_id"),
          groupId: "youXiouHuaZuo",
        })
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.paint = res.data;
            this.lists = JSON.parse(res.data.json);
          } else {
            this.$message.error(res.message);
          }
        });
    },
    update(lists) {
      this.lists = lists.concat(this.lists);
    },
    doAdding() {
      this.isLoading = true;
      this.paint.json = JSON.stringify(this.lists);
      this.$axios
        .post("train/schoolWeb/update", this.paint)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.$emit("update", {
              displayName: this.paint.displayName,
              list: this.lists,
            });
            this.$message.success("保存成功");
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
        });
    },
    onDeting(t) {
      this.$confirm("此操作将删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.lists.splice(t, 1);
      });
    },
  },
};
</script>
<style scoped>
.paint {
  height: calc(100vh - 150px);
}
.flex-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.cursor {
  cursor: pointer;
}
.relative {
  position: relative;
}
.text-base {
  font-size: 14px;
}
.pb-20 {
  padding-bottom: 20px;
}
.text-xs {
  font-size: 12px;
}
.mt-20 {
  margin-top: 20px;
}
.text-blue {
  color: #169bd5;
}
.border {
  border-bottom: 1px solid #e8e8e8;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.h-40 {
  height: 40px;
}
p {
  margin: 0;
}
.w-full {
  width: 100%;
}
.h-60 {
  height: 60px;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.del {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 30px;
}
.paint >>> .el-upload--picture-card,
.paint >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 60px;
  height: 60px;
  line-height: 60px;
}
.paint >>> .el-upload--picture-card i {
  font-size: 20px;
}
.paint >>> .el-upload-list--picture-card .el-upload-list__item-status-label i {
  position: absolute;
  top: 11px;
  left: 14px;
  margin-top: 0;
}
.paint >>> .el-dialog__body {
  max-height: 550px;
  overflow: auto;
}
.list {
  width: 60px;
  height: 60px;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
}
.list .del {
  position: absolute;
  bottom: 5px;
  right: 5px;
  cursor: pointer;
  font-size: 20px;
  color: #fff;
}
.tips {
  font-size: 12px;
  font-weight: 700;
  color: red;
}
.save {
  width: 90%;
  position: absolute;
  bottom: 10px;
  left: 5%;
}
.lb {
  max-height: calc(100vh - 400px);
}
.lb::-webkit-scrollbar {
  width: 0 !important;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
</style>
