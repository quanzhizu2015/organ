<template>
  <div class="nav">
    <p>导航管理</p>
    <div class="navBoxs">
      <el-form ref="form" label-position="left" label-width="30%">
        <div v-for="(item,index) in lists" :key="index" class="w-full h-auto border py-5">
          <el-form-item label="导航名称">
            <el-input
              v-model="item.displayName"
              placeholder="请输入"
              class="classInput"
              maxlength="4"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="导航图标">
            <LocalMultiUpload
              ref="upload"
              :image="[{url:item.iconImg}]"
              :num="index"
              :tips="tip"
              @upload="upImg"
            />
          </el-form-item>
          <el-form-item label="导航内容">
            <span>跳转至开设的课程页面</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-button type="primary" class="save" @click="doAdding">保存</el-button>
  </div>
</template>
<script>
import LocalMultiUpload from "@/components/Upload/LocalMultiUpload";
export default {
  components: { LocalMultiUpload },

  data() {
    return {
      toobar: {},
      lists: [],
      tip: "（建议尺寸90*90） ",
    };
  },
  created() {
    this.$on("goEdit", () => {
      this.getInfo();
    });
  },
  methods: {
    getInfo() {
      this.$axios
        .post("train/schoolWeb/getSchoolInfoByGroupId", {
          id: localStorage.getItem("school_id"),
          groupId: "toobar",
        })
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.toobar = res.data;
            this.lists = JSON.parse(res.data.json);
          } else {
            this.$message.error(res.message);
          }
        });
    },
    upImg(params) {
      this.lists[params.index].iconImg = params.url;
    },
    doAdding() {
      this.toobar.json = JSON.stringify(this.lists);
      this.$axios
        .post("train/schoolWeb/update", this.toobar)
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.$emit("update", this.lists);
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.$refs["upload"][0].$emit("clear");
          this.$refs["upload"][1].$emit("clear");
          this.$refs["upload"][2].$emit("clear");
          this.$refs["upload"][3].$emit("clear");
        });
    },
  },
};
</script>
<style scoped>
.nav {
  position: relative;
}
.cursor {
  cursor: pointer;
}
.save {
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
}
.py-5 {
  padding: 5px 0;
}
.text-base {
  font-size: 14px;
}
.mr-5 {
  margin-right: 5px;
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
.nav >>> .el-upload--picture-card,
.nav >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
  line-height: 88px;
}
.nav >>> .el-upload-list__item .el-icon-upload-success {
  position: absolute;
  top: 2px;
  right: 14px;
}
.navBoxs {
  width: 100%;
  height: calc(100vh - 200px);
  overflow: auto;
  padding-bottom: 30px;
}
.navBoxs::-webkit-scrollbar {
  width: 0 !important;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
</style>
