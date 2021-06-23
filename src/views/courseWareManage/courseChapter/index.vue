<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item :name="item.id">
      <template slot="title">
        <el-col :span="12">
          <span
            style="
              float: left;
              font-weight: bold;
              font-size: 14px;
              color: #3d3d3d;
            "
            >{{ item.title }}</span
          ></el-col
        >
        <el-col class="header" :span="12" @click='stopProp'>
          <el-button type="text" size="small" @click="addItem()" @click.stop="stopProp"
            >新增文件夹</el-button
          >
          <!-- <el-button type="text" size="small" @click="delItem()"
            >查看作业</el-button
          > -->
          <el-button type="text" size="small" @click="editItemAction()" @click.stop="stopProp"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="delItem()" @click.stop="stopProp"
            >删除</el-button
          >
        </el-col>
      </template>
      <CourseFolder
        v-for="(itemv, index) in folderData"
        :key="index"
        :item="itemv"
        :classObject="classObject"
        :course="course"
        @updateFloderSuccess="addSuccess"
      />
    </el-collapse-item>
    <AddFloderDialog
      :isAdd="isAddFolder"
      :visible.sync="isVisibleFolder"
      :editItem="item"
      :classObject="classObject"
      :course="course"
      @addSuccess="addSuccess"
    />

    <AddChapterDialog
      :isAdd="isAddChapter"
      :visible.sync="isVisibleChapter"
      :editItem="item"
      :classObject="classObject"
      :course="course"
      @addSuccess="editChapterSuccess"
    />
  </el-collapse>
</template>

<script>
import CourseFolder from "../courseFolder";
import AddFloderDialog from "../addFloderDialog";
import AddChapterDialog from "../addChapterDialog";
export default {
  components: {
    CourseFolder,
    AddFloderDialog,
    AddChapterDialog,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    classObject: {
      type: Object,
      default: () => {
        return {};
      },
    },
    course: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    this.folderList();
  },
  methods: {
    handleChange() {
      

    },
     // 阻止事件传播
    stopProp(e) {
      e.stopPropagation()
    },

    editItemAction() {
      this.isAddChapter = 0;
      this.isVisibleChapter = true;
    },
    addItem() {
      
     
      this.isAddFolder = 1;
      this.isVisibleFolder = true;
    },
    delItem() {
      this.$confirm("此操作将永久删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addSuccess() {
      this.folderList();
    },

    editChapterSuccess() {
      //console.log("editChapterSuccess");
      this.$emit("editChapterSuccess");
    },

    //api
    folderList() {
      let params = {
        courseId2: this.item.id,
        folderName: "",
      };
      this.$axios
        .post(this.API.folder.list, params)
        .then((res) => {
          this.folderData = res.data;
        })
        .catch(() => {})
        .finally(() => {});
    },
    delete() {
      let params = {
        id: [this.item.id],
      };
      this.$axios
        .post(this.API.courseWare.delete, params)
        .then((res) => {
          if (res) {
            if (res) {
              this.$message({
                message: "删除章节成功",
                type: "success",
              });

              this.$emit("editChapterSuccess");
            }
          }
        })
        .catch(() => {})
        .finally(() => {});
    },
  },
  data() {
    return {
      activeNames: [],
      isAddFolder: 1, //1新建文件夹
      isVisibleFolder: false,
      isAddChapter: 0, //1编辑章节
      isVisibleChapter: false,
      folderData: [],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./courseChapter.scss";
</style>