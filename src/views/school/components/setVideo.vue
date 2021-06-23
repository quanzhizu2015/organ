<template>
  <div class="relative videos">
    <el-form ref="form" :model="comVideo" label-position="left" label-width="80px">
      <el-form-item label="栏目名称">
        <el-input v-model="comVideo.displayName" placeholder="请输入" maxlength="4" show-word-limit />
      </el-form-item>
    </el-form>
    <p style="font-size:14px;color: #606266;font-weight: 700;">视频列表</p>
    <div style="overflow-y:auto; align-items: start;" class="flex-wrap py-20 videoLists">
      <div v-for="(img,t) in lists" :key="t" class="list">
        <img :src="img.img" style="width:60px;height:60px" @click="open(img.url)" />
        <i class="el-icon-delete del" @click="onDeting(t)"></i>
        <p style="margin:2px 0;font-size:12px" class="nowrap">{{ img.title?img.title:"" }}</p>
      </div>
      <div v-if="lists.length<1" class="w-full flex" style="color:#949496;font-size:12px">暂无数据</div>
    </div>
    <div class="save">
      <el-button type="success" plain style="width:100%;margin-bottom:10px" @click="addNew">新增视频</el-button>
      <el-button type="primary" plain style="width:100%;margin-left:0" @click="save">保存更改</el-button>
    </div>

    <add-videos-dialog
      ref="videos"
      :visible.sync="isEditDialogVisible"
      @close="isEditDialogVisible = false"
      @upload="upload"
    />
  </div>
</template>
<script>
import addVideosDialog from "./addVideosDialog";
export default {
  components: { addVideosDialog },
  props: {
    swipeLists: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      comVideo: {},
      lists: [],
      isEditDialogVisible: false,
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
          groupId: "comVideo",
        })
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.comVideo = res.data;
            this.lists = JSON.parse(this.comVideo.json);
          } else {
            this.$message.error(res.message);
          }
        });
    },
    open(url) {
      window.open(url);
    },
    onDeting(index) {
      this.lists.splice(index, 1);
    },
    save() {
      this.comVideo.json = JSON.stringify(this.lists);
      this.$axios
        .post("train/schoolWeb/update", this.comVideo)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.$emit("update", {
              displayName: this.comVideo.displayName,
              list: this.lists,
            });

            this.$message.success("保存成功");
          }
        });
    },
    addNew() {
      this.$refs["videos"].$emit("addVideo", this.comVideo);
      this.isEditDialogVisible = true;
    },
    upload(params) {
      this.lists = params;
      this.$emit("update", {
        displayName: this.comVideo.displayName,
        list: this.lists,
      });
    },
  },
};
</script>
<style scoped>
.videos {
  height: calc(100vh - 150px);
}
.flex-wrap {
  display: flex;
  align-items: center;
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
.py-20 {
  padding: 20px 0;
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
.list {
  width: 60px;
  height: 80px;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
}
.nowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list .del {
  position: absolute;
  bottom: 25px;
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
  bottom: 20px;
  left: 5%;
}
.videoLists {
  max-height: calc(100vh - 400px);
}
.videoLists::-webkit-scrollbar {
  width: 0 !important;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
</style>
