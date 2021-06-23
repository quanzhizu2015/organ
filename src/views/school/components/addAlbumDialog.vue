<template>
  <el-dialog
    :title="type==0?'新建相册':'管理相册'"
    width="520px"
    class="album"
    :visible="visible"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form
      ref="form"
      v-loading="isLoading"
      :model="imgLists"
      label-position="left"
      label-width="140px"
    >
      <el-form-item label="相册名称">
        <el-input v-model="imgLists.folder" placeholder="请输入" class="classInput" />
      </el-form-item>
      <el-form-item label="新增照片">
        <AliOssMultiUpload :image="image" @input="update" />
      </el-form-item>
      <el-form-item label="相册列表">
        <div class="flex-wrap">
          <div v-for="(img,t) in imgLists.images" :key="t" class="list">
            <img :src="img.url" style="width:60px;height:60px" />
            <i class="el-icon-delete del" @click="onDeting(t)"></i>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="doAdding">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AliOssMultiUpload from "@/components/Upload/AliOssMultiUpload";
export default {
  name: "AddAlbumDialog",
  components: { AliOssMultiUpload },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      data: {
        id: 0,
        name: "",
        teacher: "",
        dateRange: ""
      },
      photos: {},
      image: [],
      imgLists: {
        folder: "",
        images: []
      },
      index: 0,
      type: 0
    };
  },
  created() {
    this.$on("add", params => {
     
      this.photos = params.photos;
      this.type = params.type;
      if (parseInt(params.type) === 1) {
        this.imgLists = JSON.parse(params.photos.json).items[params.index];
        this.index = params.index;
      } else {
        this.imgLists = {
          folder: "",
          images: []
        };
      }
    });
  },
  methods: {
    doAdding() {
      this.isLoading = true;
      const photosJson = JSON.parse(this.photos.json);
      
      if (parseInt(this.type) === 1) {
        photosJson.items[this.index] = this.imgLists;
      } else {
        photosJson.items.push(this.imgLists);
      }
      this.photos.json = JSON.stringify(photosJson);
      this.$axios
        .post("train/schoolWeb/update", this.photos)
        .then(response => {
          if (parseInt(response.code) === 0) {
            this.$emit("upload", photosJson);
            if (parseInt(this.type) === 1) {
              this.$message.success("已修改成功");
            } else {
              this.$message.success("新增成功");
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
          this.onClose();
        });
    },
    onDeting(index) {
      this.$confirm("此操作将删除该照片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.imgLists.images.splice(index, 1);
      });
    },
    update(lists) {
      this.imgLists.images = lists.concat(this.imgLists.images);
    },
    onClose() {
      this.$emit("close");
      this.imgLists = {
        folder: "",
        images: []
      };
      this.image = [];
    }
  }
};
</script>
<style scoped>
.flex-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
.album >>> .el-upload--picture-card,
.album >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 60px;
  height: 60px;
  line-height: 60px;
}
.album >>> .el-upload--picture-card i {
  font-size: 20px;
}
.album >>> .el-upload-list--picture-card .el-upload-list__item-status-label i {
  position: absolute;
  top: 11px;
  left: 14px;
  margin-top: 0;
}
.album >>> .el-dialog__body {
  max-height: 550px;
  overflow: auto;
}
</style>

