<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="50%"
    center
  >
    <div slot="title">{{ this.isAdd == 1 ? "新增" : "修改" }}</div>
    <div class="flex-around" v-show="this.isAdd == 1">
      <el-radio v-model="data.type" label="0">{{
        this.isAdd == 1 ? "新建班级" : "修改班级"
      }}</el-radio>
      <el-radio v-model="data.type" label="1">复用班级</el-radio>
    </div>

    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item
        label="复用班级"
        v-show="parseInt(data.type) === 1"
        required
      >
        <el-select
          v-model="data.class"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="searchClass"
          :loading="loading"
          style="width: 100%"
          @change="changeClass"
          value-key="id"
        >
          <el-option
            v-for="item in data.options"
            :key="item.id"
            :label="item.className"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="from.className"
          placeholder="请输入"
          class="classInput"
        />
      </el-form-item>
      <el-form-item label="学期周期" required>
        <el-date-picker
          style="width: 45%"
          v-model="from.startDate"
          type="date"
          format="yyyy-MM-dd"
          :clearable="false"
          placeholder="选择开始日期"
        >
        </el-date-picker>
        <span style="margin-left: 1rem">至</span>
        <el-date-picker
          style="margin-left: 1rem; width: 45%"
          v-model="from.endDate"
          type="date"
          format="yyyy-MM-dd"
          :clearable="false"
          placeholder="选择结束日期"
        >
        </el-date-picker>
        <!-- <el-date-picker
          v-model="from.dateRange"
          size="medium"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
          :clearable="false"
          @change="onChangingDate"
          style="width: 100%"
        /> -->
      </el-form-item>

      <el-form-item label="开设科目" required>
        <el-table
          :data="data.tableData"
          style="width: 100%"
          border
          height="300"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="title" label="科目" width="180">
          </el-table-column>
          <el-table-column prop="address" label="任课教师">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.selecteTeacher"
                multiple
                placeholder="请选择"
                style="width: 100%"
                value-key="id"
                @visible-change="changeValue1($event, scope.row)"
              >
                <el-option
                  v-for="item in scope.row.subjectTeacher"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ossClient from "@/utils/aliyun.oss.client";
import AliImageUpload from "@/components/Upload/aliImageUpload.vue";
export default {
  components: {
    AliImageUpload,
  },
  name: "AddSubjectDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 0, //1新增  0编辑
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  created() {},
  mounted() {
    this.searchClass("");
  },

  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    subjectAll() {
      this.$axios.get(this.API.course.subjectAll).then((respond) => {
        let data = new Array();
        respond.data.forEach((item) => {
          data.push({
            ...item,
            subjectTeacher: new Array(...this.teachers),
            selecteTeacher: new Array(),
          });
        });
        this.data.tableData = data;
      });
    },
    subjectFirstAll() {
      this.$axios.get(this.API.course.subjectAll).then((respond) => {
        let data = new Array();

        respond.data.forEach((item) => {
          data.push({
            ...item,
            subjectTeacher: new Array(...this.teachers),
            selecteTeacher: new Array(),
          });
        });
        this.data.tableData = data;
        this.getClassDetail(this.editItem.id);
      });
    },
    getTeacher() {
      let parm = {
        pageIndex: 1,
        pageSize: 600,
        model: {
          state: 0,
          schoolName: "",
          teacherName: "",
          mobilePhone: "",
          // id: params.id,
          // title: params.title,
        },
      };
      this.$axios.post(this.API.teacher.list, parm).then((respond) => {
        this.teachers = respond.records;
        if (this.isAdd) {
          this.subjectAll();
        } else {
          this.subjectFirstAll();
        }
      });
    },

    onChangingDate() {
      // if (this.from.dateRange != null) {
      //   this.from.startDate = this.from.dateRange[0];
      //   this.from.endDate = this.from.dateRange[1];
      // } else {
      //   this.from.startDate = "";
      //   this.from.endDate = "";
      // }
    },
    changeValue1: function (callback, vc) {
      if (callback) {
        // this.getTeacher(vc);
      }
    },
    changeClass(value) {
      // console.log(value)
      // console.log(this.data.class)
      //this.data.class = value

      this.getClassDetail(value.id);
    },

    open() {
      //1新增  0编辑
      this.from = {
        className: "",
        startDate: null,
        endDate: null,
        dateRange: [],
        multipleSelection: [],
      };
      this.data.type = "0";
      this.data.class = {};
      this.getTeacher(); //拉所有老师
    },

    handleSelectionChange(val) {
      this.from.multipleSelection = val;
    },

    searchClass(query) {
      this.loading = true;
      this.$axios
        .post(this.API.class.list, {
          // pageIndex: 1,
          // pageSize: 30,
          model: {
            state: 0,
            className: query,
          },
        })
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.data.options = response.records;
          } else {
            this.$message.error(response.message);
          }
        })
        //.catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    confirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.from.startDate) {
            this.from.startDate = "";
          }
          if (!this.from.endDate) {
            this.from.endDate = "";
          }
          if (
            !this.from.multipleSelection ||
            this.from.multipleSelection.length === 0
          ) {
            this.$message.error("请选择开设科目");
            return;
          }

          let j = 0;
          let len = this.from.multipleSelection.length;
          for (j = 0; j < len; j++) {
            let teachers = this.from.multipleSelection[j];
            if (
              !teachers.selecteTeacher ||
              teachers.selecteTeacher.length == 0
            ) {
              this.$message.error("请选择科目下的老师");
              return;
            }
          }

          this.add();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleClose() {
      this.$emit("update:visible", false);
    },

    // api
    add() {
      if (!this.from.startDate || !this.from.endDate) {
        this.$message.error("请选择完整班级时间");
        return;
      } else if (
        this.from.startDate == undefined ||
        this.from.endDate == undefined ||
        this.from.startDate == null ||
        this.from.endDate == null
      ) {
        this.$message.error("请选择完整班级时间");
        return;
      }
      let startDateStr = this.$dayjs(this.from.startDate).format("YYYY-MM-DD");
      let endDateStr = this.$dayjs(this.from.endDate).format("YYYY-MM-DD");
      if (parseInt(this.data.type) === 0) {
        //新增
        let subjectTeacherList = new Array();
        this.from.multipleSelection.forEach((item, index) => {
          let teacherList = new Array();
          item.selecteTeacher.forEach((teacherItem, index) => {
            teacherList.push({
              teacherId: teacherItem.id,
              teacherName: teacherItem.name,
            });
          });
          subjectTeacherList.push({
            subjectId: item.id,
            subjectName: item.title,
            subjectImgUrl: item.url,
            teacherList: teacherList,
          });
        });

        if (this.isAdd) {
          //新增班级
          let params = {
            className: this.from.className,
            startDate: startDateStr,
            endDate: endDateStr,
            subjectTeacherList: subjectTeacherList,
          };

          this.$axios.post(this.API.class.add, params).then((respond) => {
            if (respond) {
              this.$message({
                type: "success",
                message: "新增班级成功!",
              });
              this.$emit("addSuccess");
            }
          });
        } else {
          //编辑班级
          let params = {
            className: this.from.className,
            classId: this.editItem.id,
            startDate: startDateStr,
            endDate: endDateStr,
            subjectTeacherList: subjectTeacherList,
          };
          this.$axios
            .post(this.API.class.updateClass, params)
            .then((respond) => {
              if (respond) {
                this.$message({
                  type: "success",
                  message: "修改班级成功!",
                });
                this.$emit("addSuccess");
              }
            });
        }
      } else {
        //复用班级
        let subjectTeacherList = new Array();
        this.from.multipleSelection.forEach((item, index) => {
          let teacherList = new Array();
          item.selecteTeacher.forEach((teacherItem, index) => {
            teacherList.push({
              teacherId: teacherItem.id,
              teacherName: teacherItem.name,
            });
          });
          subjectTeacherList.push({
            subjectId: item.id,
            subjectName: item.title,
            subjectImgUrl: item.url,
            teacherList: teacherList,
          });
        });

        let params = {
          className: this.from.className,
          startDate: startDateStr,
          endDate: endDateStr,
          subjectTeacherList: subjectTeacherList,
        };

        this.$axios.post(this.API.class.add, params).then((respond) => {
          if (respond) {
            this.$message({
              type: "success",
              message: "复用班级成功!",
            });
            this.$emit("addSuccess");
          }
        });
      }
    },

    edit() {
      this.confirm();
    },

    getClassDetail(id) {
      this.$axios
        .post(this.API.class.detail, { classId: id })
        .then((respond) => {
          if (parseInt(this.data.type) === 0) {
            this.from.className = respond.data.className;
          }

          if (respond.data.startDate) {
            this.from.startDate =   new Date(respond.data.startDate.join("/"))
          } else {
            this.from.startDate = null
          }
          if (respond.data.endDate) {
            this.from.endDate =  new Date(respond.data.endDate.join("/"))
          } else {
            this.from.endDate = null
          }
          this.$refs.multipleTable.clearSelection();
          this.from.multipleSelection = new Array();

          this.data.tableData.forEach((item, index) => {
            item.selecteTeacher = new Array();
          });

          //this.from.dateRange = [this.from.startDate, this.from.endDate];
          this.data.tableData.forEach((item, index) => {
            //遍历所有科目

            respond.data.subjectTeacherList.forEach((subItem, subIndex) => {
              //遍历所有被选中的科目

              if (subItem.subjectId == item.id) {
                subItem.teacherList.forEach((element) => {
                  //遍历选中科目下的老师

                  this.teachers.forEach((teacher, teacherIndex) => {
                    if (teacher.id == element.teacherId) {
                      item.selecteTeacher.push(teacher);
                    }
                  });
                });

                this.from.multipleSelection.push(item);
              }
            });
          });

          this.from.multipleSelection.forEach((element) => {
            this.$refs.multipleTable.toggleRowSelection(element);
          });
        });
    },
  },
  data() {
    return {
      from: {
        className: "",
        startDate: null,
        endDate: null,
        dateRange: [],
        multipleSelection: [],
      },
      data: {
        type: "0", // 0为新建，1为复用
        class: {},
        name: "",
        options: [],
        tableData: [],
      },
      teachers: [],
      isLoading: false,
      loading: false,
      rules: {
        className: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
        ],
      },
    };
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="scss" scoped>
@import "./addClassDialog.scss";
</style>