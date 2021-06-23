<template>
  <div class="picture">
    <local-upload :image="image" style="margin:auto" @saveImg="saveImg" />
    <div class>
      <p class="w-full flex-between h-40 border mt-20">
        <span>相册列表</span>
        <el-button type="primary" class="mb-10" @click="onEditing(0)">新建相册</el-button>
        <!-- <span class="cursor text-xs text-blue" @click="onEditing(0)">新建相册</span> -->
      </p>
      <div
        v-for="(list,index) in lists.items"
        :key="index"
        class="h-60 w-full flex-between border text-base"
      >
        <p class="flex-start">
          <span>{{ list.folder }}</span>
          <!-- <el-input
            v-model="list.name"
            placeholder="请输入内容"
            :disabled="list.check"
            style="width:100px"
          ></el-input>-->
          <!-- <span v-show="list.check" class="cursor text-xs text-blue" @click="list.check = 0">编辑相册名称</span> -->
          <!-- <span v-show="!list.check" class="cursor text-xs text-blue" @click="list.check = 1">保存</span> -->
        </p>
        <p class="cursor text-xs text-blue flex">
          <el-button type="primary" class="mb-10" @click="onEditing(1,index)">管理</el-button>
          <el-button type="danger" class="mb-10" @click="onDeteling(index)">删除</el-button>
          <!-- <span style="margin-right:20px">管理</span>
          <span @click="onDeteling(index)">删除</span>-->
        </p>
      </div>
    </div>
    <add-album-dialog
      ref="album"
      :visible="isAddDialogVisible"
      @close="isAddDialogVisible = false"
      @upload="upload"
    />
  </div>
</template>
<script>
import LocalUpload from "./LocalUpload"; // 异步提交
import addAlbumDialog from "./addAlbumDialog";

export default {
  components: { LocalUpload, addAlbumDialog },

  data() {
    return {
      photos: {},
      image: [],
      lists: {},
      isAddDialogVisible: false,
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
          groupId: "comPhoto",
        })
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.photos = res.data;
           
            this.lists = JSON.parse(res.data.json);
            this.image = [{ url: this.lists.img }];
          } else {
            this.$message.error(res.message);
          }
        });
    },

    saveImg(params) {
      // 保存相册封面
      if (params.url == "") {
        this.$message.warning("请上传封面图");
      } else {
        this.lists.img = params.url;
        this.photos.json = JSON.stringify(this.lists);
        this.$axios.post("train/schoolWeb/update", this.photos).then((res) => {
          if (parseInt(res.code) === 0) {
            this.$emit("update", this.lists);
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    onEditing(type, index) {
      // 0为新增，1为编辑
      if (parseInt(type) === 1) {
        this.$refs["album"].$emit("add", {
          type: 1,
          photos: this.photos,
          index: index,
        });
      } else {
        this.$refs["album"].$emit("add", {
          type: 0,
          photos: this.photos,
        });
      }
      this.isAddDialogVisible = true;
    },
    onDeteling(index) {
      this.$confirm("此操作将删除该相册以及相关照片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.lists.items.splice(index, 1);
        this.photos.json = JSON.stringify(this.lists);
        this.$axios.post("train/schoolWeb/update", this.photos).then((res) => {
          if (parseInt(res.code) === 0) {
            this.$emit("update", this.lists);
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    upload(params) {
     
      this.lists = params;
      this.$emit("update", params);
    },
  },
};
</script>
<style scoped>
.picture >>> .el-upload-list--picture .el-upload-list__item-thumbnail {
  width: auto;
}
.cursor {
  cursor: pointer;
}
.text-base {
  font-size: 14px;
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
</style>
