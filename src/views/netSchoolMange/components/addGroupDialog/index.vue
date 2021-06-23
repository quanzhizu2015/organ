<template>
  <div class="sdialog">
    <el-dialog
      width="30%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">{{ isAdd ? "添加分组" : "添加分组" }}</div>
      <el-form
        label-width="100px"
        :model="from"
        label-position="right"
        class="demo-ruleForm"
        center
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="分组名称" prop="title">
          <el-input
            v-model="from.title"
            placeholder="请输入分组名称"
            maxlength="12"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AddGroupDialog",

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 1,
    },
    type: {
      type: Number,
      default: 1, //1 图片  2 视频  3 文档
    },

    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      from: {
        title: "",
      },
      rules: {
        title: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    open() {
      //console.log(this.editItem)

      if (this.isAdd) {
        this.from.title = "";
      } else {
        this.from.title = this.editItem.name;
      }
    },

    doAdding() {
      if (!this.from.title) {
        this.$message.error("请输入分组名称");
        return;
      }
      if (this.isAdd) {
        this.add();
      } else {
        this.update();
      }
    },

    onClose() {
      this.$emit("update:visible", false);
    },

    //API
    add() {
      let url =
        this.API.newNetSchool.group.add +
        "?name=" +
        this.from.title +
        "&type=" +
        this.type;

      this.$axios.post(url).then((res) => {
        if (res) {
          this.$emit("update:visible", false);
          this.$emit("addSuccess");
          this.$message({
            message: "分组添加成功",
            type: "success",
          });
        }
      });
    },
    update() {
      let params = {
        id: this.editItem.id,
        name: this.from.title,
      };

      this.$axios
        .post(this.API.newNetSchool.group.update, params)
        .then((res) => {
          if (res) {
            this.$emit("update:visible", false);
            this.$emit("addSuccess");
            this.$message({
              message: "分组更新成功",
              type: "success",
            });
          }
        });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./addGroupDialog.scss";
.catory {
  width: 30%;
  height: 20rem;
  padding: 1rem;
  overflow-y: auto;
}
.imageTableContain {
  width: 70%;
  height: 20rem;
}
.imageTable {
  height: 90%;
  overflow-y: auto;
}
.catoryItem {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.3rem 0rem 0rem 0rem;
  span {
    margin-left: 0.2rem;
  }
}
.fileFolder {
  width: 1rem;
  height: 1rem;
}
/deep/ .has-gutter {
  .el-checkbox {
    display: none;
  }
}
::v-deep .el-dialog__footer {
  text-align: center !important;
}
</style>