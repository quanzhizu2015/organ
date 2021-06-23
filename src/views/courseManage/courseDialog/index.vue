<template>
  <div class="courseDialog">
    <el-dialog
      :visible.sync="visible"
      :show-close="true"
      :close-on-click-modal="false"
      :before-close="handleClose"
      @open="open"
      width="40%"
      center
    >
      <div slot="title">{{ isAdd ? "新增" : "编辑" }}</div>
      <el-form
        label-width="110px"
        :model="from"
        label-position="right"
        class="demo-ruleForm"
        center
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="班级日期" required>
          <el-col :span="8">
            <span>{{ editItem.class ? editItem.class.className : "" }}</span>
          </el-col>
          <el-col :span="8">
            <span>{{ editItem.date }}</span>
          </el-col>
          <el-col :span="8">
            <span>{{ editItem.week }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="科目名称" required>
          <el-col :span="24">
            <el-select
              v-model="from.course"
              filterable
              remote
              reserve-keyword
              placeholder="请选择科目"
              :remote-method="searchCourse"
              :loading="loading"
              value-key="id"
              style="width: 100%"
              @change="changeCourse"
            >
              <el-option
                v-for="item in courseData"
                :key="item.id"
                :label="item.title"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group
            v-model="selectTeachers"
            @change="handleCheckedTeacherChange"
          >
            <el-checkbox
              v-for="(teacher, index) in teacherOptions"
              :label="teacher"
              :key="index"
              >{{ teacher.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="课时">
          <el-time-picker
            v-model="courseStartTime"
            placeholder="开始时间"
            size="mini"
            format="HH:mm"
            style="width: 7rem"
            :clearable="false"
          >
          </el-time-picker>
          <div class="timeContain"> <span class="timeSpace">至</span></div>
          <el-time-picker
            v-model="courseEndTime"
            placeholder="结束时间"
            size="mini"
            format="HH:mm"
            style="width: 7rem"
            :clearable="false"
          >
          </el-time-picker>
          <!-- <el-time-picker
            is-range
            v-model="mycourseTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            style="width: 100%"
            :clearable="false"
          >
          </el-time-picker> -->
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm" @keyup.enter.native="confirm"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ossClient from "@/utils/aliyun.oss.client";
import AliImageUpload from "@/components/Upload/aliImageUpload.vue";
export default {
  components: {
    AliImageUpload,
  },
  name: "CourseDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 0, //1新增  0编辑
    },
    node: {
      type: Number,
      default: 0, //第几个课时
    },
    week: {
      type: Number,
      default: 0, //第几周
    },
    editItem: {
      type: Object,
      default: () => {
        return {
          class: null,
          date: "",
          week: "",
        };
      },
    },
    startTime: {
      type: Date,
      default: () => {
        return new Date();
      },
    },
    endTime: {
      type: Date,
      default: () => {
        return new Date();
      },
    },
    courseTime: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    open() {
      //console.log(this.editItem);
      this.searchCourse("");
      if (this.isAdd) {
        this.teacherOptions = [];
        this.selectTeachers = [];
        this.courseData = [];
        this.from.course = {};
        this.$nextTick(() => {
          this.mycourseTime = this.courseTime;
          this.courseStartTime = this.startTime;
          this.courseEndTime = this.endTime;
        });
        
      } else {
        let courseData = this.editItem["courseData"];
        let course = {
          id: courseData.courseId,
          title: courseData.courseName,
        };
        this.from.course = course;
        this.getFirstTeacher(course);
        this.$nextTick(() => {
          if (courseData && courseData["startTime"] && courseData["endTime"]) {
            this.mycourseTime = [
              new Date(courseData["startTime"].replace(/-/g, "/")),
              new Date(courseData["endTime"].replace(/-/g, "/")),
            ];
            this.courseStartTime = new Date(courseData["startTime"].replace(/-/g, "/"));
            this.courseEndTime = new Date(courseData["endTime"].replace(/-/g, "/"));
          } else {
            this.mycourseTime = this.courseTime;
          }
        });
      }
    },
    confirm() {
      //if (this.isAdd) {
      this.add();
      // } else {
      //   this.edit();
      // }
    },

    handleClose() {
      this.$emit("update:visible", false);
    },

    handleCheckedTeacherChange(value) {
      //console.log(value);
    },
    changeCourse(value) {
      this.selectTeachers = [];
      this.getTeacher(value);
    },

    // api
    add() {
      if (
        this.from.course == null ||
        Object.keys(this.from.course).length == 0
      ) {
        this.$message.error("请选择科目");
        return;
      }
      //console.log(this.selectTeachers.length);
      if (this.selectTeachers.length == 0) {
        this.$message.error("请选择老师");
        return;
      }
      if (!this.courseStartTime || !this.courseEndTime) {
        this.$message.error("请选择完整课时");
        return;
      }
      let teacherIds = "";
      let teacherName = "";
      this.selectTeachers.forEach((item, index) => {
        if (this.selectTeachers.length == index + 1) {
          teacherIds = teacherIds + item.id;
          teacherName = teacherName + item.name;
        } else {
          teacherIds = teacherIds + item.id + ",";
          teacherName = teacherName + item.name + ",";
        }
      });

      let startTime = this.getDateString(this.courseStartTime);
      let endTime = this.getDateString(this.courseEndTime);
      if (this.$dayjs(endTime).isBefore(this.$dayjs(startTime))) {
        this.$message.error("开始时间不能大于结束时间");
        return;
      }

      // let params = {
      //   classId: this.editItem.class.id,
      //   courseId: this.from.course.id,
      //   startTime: startTime,
      //   endTime: endTime,
      //   teacherIds: teacherIds,
      //   classDate: this.editItem.date,
      //   node: this.node,
      //   teacherName: teacherName,
      // };
      if (this.isAdd) {
        let params = {
          classId: this.editItem.class.id,
          courseId: this.from.course.id,
          startTime: startTime,
          endTime: endTime,
          teacherIds: teacherIds,
          classDate: this.editItem.date,
          node: this.node,
          teacherName: teacherName,
        };
        this.$axios
          .post(this.API.courseMan.insert, params)
          .then((res) => {
            this.editItem.courseData = res.data;
            this.$emit("update:editItem", this.editItem);
            console.log(res);
            if (res) {
              this.$message({
                message: "新增课时成功",
                type: "success",
              });
              this.$emit("addSuccess");
            }
          })
          .catch(() => {});
      } else {
        let courseData = this.editItem["courseData"];

        let params = {
          classId: this.editItem.class.id,
          courseId: this.from.course.id,
          startTime: startTime,
          endTime: endTime,
          teacherIds: teacherIds,
          classDate: this.editItem.date,
          node: this.node,
          teacherName: teacherName,
          id: courseData.id,
        };

        this.$axios
          .post(this.API.courseMan.update, params)
          .then((res) => {
            if (res) {
              this.editItem.courseData = {...res.data,courseName:this.from.course.title};
              this.$message({
                message: "课时更新成功",
                type: "success",
              });
              this.$emit("addSuccess");
            }
          })
          .catch(() => {});
      }
    },

    getDateString(date) {
      var temp = date;
      var dateStr =
        // this.padStr(temp.getFullYear()) +
        // "-" +
        // this.padStr(1 + temp.getMonth()) +
        // "-" +
        // this.padStr(temp.getDate()) +
        // " " +
        this.editItem.date +
        " " +
        this.padStr(temp.getHours()) +
        ":" +
        this.padStr(temp.getMinutes()) +
        ":00";
      //this.padStr(temp.getSeconds());
      return dateStr;
    },

    padStr(i) {
      //console.log(i)
      return i < 10 ? "0" + i : "" + i;
    },

    getTeacher(params) {
      let parm = {
        courseId: params.id,
        classId: this.editItem.class.id,
        state: 0,
      };

      this.$axios.post(this.API.teacher.courseTeacher, parm).then((respond) => {
        //this.data.tableData = respond.data;
        this.teacherOptions = respond.data;
      });
    },

    getFirstTeacher(params) {
      let parm = {
        courseId: params.id,
        classId: this.editItem.class.id,
        state: 0,
      };

      this.$axios.post(this.API.teacher.courseTeacher, parm).then((respond) => {
        //this.data.tableData = respond.data;
        this.teacherOptions = respond.data;

        let courseData = this.editItem["courseData"];

        let selectTeachers = [];
        let teacherIds = courseData["teacherIds"].split(",");

        this.teacherOptions.forEach((item, index) => {
          teacherIds.forEach((teacherId, index) => {
            if (item.id == teacherId) {
              selectTeachers.push(item);
            }
          });
        });

        this.selectTeachers = selectTeachers;
      });
    },

    searchCourse(query) {
      this.loading = true;
      this.$axios
        .post(this.API.course.pagePo, {
          classId: this.editItem.class.id,
          parentId: 0,
          // pageIndex: 1,
          // pageSize: 30,
          // model: {
          //   state: 0,
          //   className: query,
          // },
        })
        .then((response) => {
          if (response) {
            this.courseData = response.data;
            let courseData = this.editItem["courseData"];
            let course = {
              id: courseData.courseId,
              title: courseData.courseName,
            };
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },

    edit() {},
  },
  data() {
    return {
      loading: false,
      from: {
        title: "",
        url: "",
        id: 0,
        course: {},
      },
      rules: {
        title: [{ required: true, message: "请输入科目名称", trigger: "blur" }],
      },
      selectTeachers: [],
      courseData: [],
      teacherOptions: [],
      mycourseTime: [new Date(), new Date()],
      courseStartTime: new Date(),
      courseEndTime: new Date(),
    };
  },
};
</script>


<style>
.courseDialog .el-date-editor .el-range-input {
  width: 65%;
}

.courseDialog .el-date-editor .el-range-separator {
  width: 10%;
}
</style>

<style lang="scss" scoped>
@import "./courseDialog.scss";
</style>