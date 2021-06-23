<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    width="40%"
    :before-close="handleClose"
    @open="open"
    center
  >
    <div class="header-title" slot="title">{{ dialogTitle }}</div>
    <el-form
      :inline="true"
      label-position="right"
      label-width="140px"
      :model="delayForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-form-inline"
    >
      <el-form-item label="学生ID" required>
        <el-input
          v-model="delayForm.studentId"
          placeholder=""
          :disabled="true"
          style="width: 25rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="学生名称" required>
        <el-input
          v-model="delayForm.studentName"
          placeholder=""
          :disabled="true"
          style="width: 25rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择延期批次" required>
        <el-select
          v-model="delayForm.delayItem"
          placeholder="请选延期批次"
          @change="selectDelay"
          value-key="id"
          :disabled="false"
          style="width: 25rem"
        >
          <el-option
            v-for="item in delaySelectOptions"
            :key="item.id"
            :label="
              '有效时间' +
              getDateFormat(item.maxDelayTime) +
              ' 可用数量' +
              item.remainUsableQuantity
            "
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择延期日期" prop="endTime">
        <el-date-picker
          type="date"
          placeholder="请选择延期日期"
          v-model="delayForm.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :disabled="isEdit"
          style="width: 25rem"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="!isEdit">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "RechargeOrderDialog",
  data() {
    var validateEndTime = (rule, obj, callback) => {
      console.log(JSON.stringify(obj));
      if (obj == "") {
        callback(new Error("请选择延期时间"));
      } else {
        callback();
      }
    };
    var validateOrder = (rule, obj, callback) => {
      console.log("validateOrder" + JSON.stringify(obj));
      if (!obj) {
        callback(new Error("请选择延期批次"));
      } else {
        callback();
      }
    };
    return {
      delayForm: {
        studentId: "",
        studentName: "",
        delayItem: null,
        endTime: "",
      },

      rules: {
        order: [
          { required: true, message: "请选择延期批次", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择延期时间", trigger: "change" },
        ],
        //  endTime: [
        //   { validateOrder, trigger: "change" },
        // ],
      },

      delaySelectOptions: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "账号延期",
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  created() {},

  methods: {
    open() {
      //console.log(this.editItem)
      this.delaySelect();
      if (this.isEdit) {
      } else {
        this.delayForm = {
          studentId: this.editItem.userId,
          studentName: this.editItem.name,
          delayItem: null,
          endTime: "",
        };
      }
    },

    getDateFormat(farDate){
      return this.$dayjs(farDate).format('YYYY年MM月DD日')
    },
    // 获取延期批次
    delaySelect() {
      this.$axios
        .get(this.API.order.delaySelect)
        .then((res) => {
          this.delaySelectOptions = res.data;
        })
        .catch(() => {});
    },

    // 选择批次
    selectDelay(val) {
      this.delayForm.endTime = "";
    },
    close() {
      this.$emit("close");
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    confirm() {
      if (!this.delayForm.delayItem) {
        this.$message.error("请选择延期批次");
        return;
      }
      if (!this.delayForm.endTime || this.delayForm.endTime == "") {
        this.$message.error("请选择延期时间");
        return;
      }
      let timeStamp = this.$dayjs(this.delayForm.delayItem.maxDelayTime).diff(
        this.$dayjs(this.delayForm.endTime),
        "day"
      );

      if (timeStamp < 0) {
        this.$message.error("延期时间不能大于延期批次有效时间！");
        return;
      }

      this.$confirm("此操作将占用该订单的一个可用名额, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              let params = {
                delayTime: this.delayForm.endTime,
                id: this.delayForm.delayItem.id,
                userId: this.editItem.userId,
                studentId: this.editItem.id,
              };
              this.$axios
                .post(this.API.order.delay, params)
                .then((res) => {
                  if (res) {
                    this.$message({
                      message: "操作成功",
                      type: "success",
                    });
                    this.$emit("close");
                    this.$emit("updateList");
                  }
                })
                .catch(() => {});
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
};
</script>

<style scoped>
@import "./rechargeOrderDialog.scss";
</style>