<template>
  <div>
    <el-form
      ref="form"
      :model="course"
      label-position="left"
      label-width="80px"
    >
      <el-form-item label="栏目名称">
        <el-input
          v-model="course.displayName"
          placeholder="请输入"
          maxlength="6"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      class="w-full"
      style="margin-bottom: 10px"
      @click="doAdding"
      >保存</el-button
    >
    <el-button
      type="success"
      class="w-full"
      @click="handleEdit(0)"
      style="margin-left: 0"
      >添加课程</el-button
    >
    <div class="w-full py-5 lists" style="overflow-y: auto">
      <!-- <el-col :span="12" class="title-btm">
        <span class="nowrap title-1">课程名称</span>
      </el-col>
      <el-col :span="12" class="title-btm">
        <span class="nowrap title-1">操作</span>
      </el-col>
      <draggable v-model="courseLists" v-bind="dragOptions">
        <template v-for="(item, index) in courseLists">
          <div :key="index" class="item_content">
            <el-col :span="12">
              <span class="nowrap title">{{ item.title }}</span>
            </el-col>
            <el-col :span="12">
              <div class="flex-between" :key="index">
                <div class="btn" @click="handleEdit(1, index)">编辑</div>
                <div class="btn btnD" @click="handleDelete(index)">删除</div>
              </div>
            </el-col>
          </div>
        </template>
      </draggable> -->

      <el-table
        ref="table"
        v-loading="isTableLoading"
        :data="courseLists"
        stripe
        fit
        highlight-current-row
        show-overflow-tooltip
        style="width: 100%"
        center
      >
        <el-table-column label="课程名称">
          <template slot-scope="scope">
            <span class="nowrap">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="flex-between">
              <div class="btn" @click="handleEdit(1, scope.$index)">编辑</div>
              <div class="btn btnD" @click="handleDelete(scope.$index)">
                删除
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增/编辑课程 -->
    <add-course-dialog
      ref="course"
      :visible="isAddDialogVisible"
      @close="isAddDialogVisible = false"
      @update="update"
    />
  </div>
</template>
<script>
import AddCourseDialog from "./addCourseDialog";
import draggable from "vuedraggable";
// import Pagination from "@/components/Pagination";
export default {
  components: { AddCourseDialog, draggable },

  data() {
    return {
      course: {},
      isTableLoading: false,
      courseLists: [{ title: "www", num: 3, money: "3399", id: 0 }],
      isAddDialogVisible: false,
    };
  },
 
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
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
          groupId: "course",
        })
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.course = res.data;
            this.courseLists = JSON.parse(res.data.json);
            for (let j = 0; j < this.courseLists.length; j++) {
              const element2 = this.courseLists[j];
              if (element2.desc2) {
                element2.desc2 = "";
              }
            }
          } else {
            this.$message.error(res.message);
          }
        });
    },
    handleEdit(type, index) {
      // 0 为新增，1为编辑
      if (parseInt(type) === 0) {
        this.$refs["course"].$emit("course", {
          course: this.course,
          type: type,
        });
      } else {
        this.$refs["course"].$emit("course", {
          course: this.course,
          index: index,
          type: type,
        });
      }
      this.isAddDialogVisible = true;
    },
    handleDelete(index) {
      this.$confirm("此操作将删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.isLoading = true;
          this.courseLists.splice(index, 1);
          this.course.json = JSON.stringify(this.courseLists);
          this.$axios
            .post("train/schoolWeb/update", this.course)
            .then((res) => {
              if (parseInt(res.code) === 0) {
                this.$emit("update", { type: 1, lists: this.courseLists });
                this.$message.success("该课程删除成功");
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(() => {})
            .finally(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {});
    },
    update(params) {
      this.course = params.course;
      this.courseLists = params.lists;
      this.$emit("update", { type: 0, course: params.lists });
    },
    doAdding() {
      this.course.json = JSON.stringify(this.courseLists);
      this.$axios
        .post("train/schoolWeb/update", this.course)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.$emit("upName", {
              displayName: this.course.displayName,
            });
            this.$message.success("保存成功");
          }
        });
    },
  },
};
</script>
<style scoped>
.cursor {
  cursor: pointer;
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
.item_content {
  margin: 2rem 0;
}
.title {
  font-size: 14px;
}
.title-1 {
  font-size: 16px;
}
.title-btm{
  margin-bottom: 1rem;
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
.lists::-webkit-scrollbar {
  width: 0 !important;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
.lists {
  height: calc(100vh - 220px);
}
.nowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn {
  padding: 2px 8px;
  background: #0070cc;
  border-radius: 4px;
  color: #fff;
}
.btnD {
  background: #c03639;
}
</style>
