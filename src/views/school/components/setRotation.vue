<template>
  <div>
    <p>轮播图设置</p>
    <div v-for="(item,index) in lists" :key="index" class="relative pb-20">
      <img :src="item.url" alt class="w-full" />
      <el-button type="primary" plain @click="onEditing(1,index)">编辑</el-button>
      <el-button type="danger" plain @click="onDeleting(index)">删除</el-button>
      <!-- <i class="el-icon-delete-solid del cursor" @click="onDeleting(index)"></i> -->
    </div>
    <el-button type="success" plain class="w-full" @click="onEditing(0)">添加{{ lists.length }}/4</el-button>
    <edit-artical-dialog
      ref="edit"
      :visible.sync="isEditDialogVisible"
      @close="isEditDialogVisible = false"
      @update="getUp"
    />
  </div>
</template>
<script>
import editArticalDialog from "./editArticalDialog";
export default {
  components: { editArticalDialog },
  props: {
    swipeLists: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      about: { title: "" },
      isEditDialogVisible: false,
      banner: {},
      lists: []
    };
  },
  created() {
    this.getInfo();
    this.$on("goEdit", () => {
      this.getInfo();
    });
  },
  methods: {
    getInfo() {
      this.$axios
        .post("train/schoolWeb/getSchoolInfoByGroupId", {
          id: localStorage.getItem("school_id"),
          groupId: "banner"
        })
        .then(res => {
          if (parseInt(res.code) === 0) {
            this.banner = res.data;
            this.lists = JSON.parse(res.data.json);
          } else {
           this.$message.error(res.message);
          }
        });
    },
    getUp(params) {
      this.lists = params.lists;

      this.$emit("update", { list: this.lists });
    },
    onEditing(type, index) {
      // 0 为新增，1为编辑
      if (parseInt(type) === 1) {
        this.$refs["edit"].$emit("editMess", {
          type: 1,
          banner: this.banner,
          index: index
        });
        this.isEditDialogVisible = true;
      } else if (this.lists.length < 4) {
        this.$refs["edit"].$emit("editMess", {
          type: 0,
          banner: this.banner
        });
        this.isEditDialogVisible = true;
      }
    },
    onDeleting(index) {
      this.$confirm("此操作将删除该轮播图, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.lists.splice(index, 1);
        this.banner.json = JSON.stringify(this.lists);
        this.$axios.post("train/schoolWeb/update", this.banner).then(res => {
          if (parseInt(res.code) === 0) {
            this.$message.success("删除成功");
            this.$emit("update", { list: this.lists });
          } else {
            this.$message.error(res.message);
          }
        });
      });
    }
  }
};
</script>
<style scoped>
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
</style>
