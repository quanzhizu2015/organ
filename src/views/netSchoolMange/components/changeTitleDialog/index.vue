<template>
  <div class="sdialog">
    <el-dialog
      width="30%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">
        {{
          type == 1
            ? "编辑图片信息"
            : type == 2
            ? "编辑视频信息"
            : "编辑文档信息"
        }}
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
        <el-form-item label="选择分类" required>
          <el-col :span="15">
            <el-select v-model="from.catoryValue" placeholder="请选择分类">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          :label="type == 1 ? '图片名称' : type == 2 ? '视频名称' : '文档名称'"
          required
        >
          <el-input
            v-model="from.title"
            :placeholder="
              type == 1
                ? '请输入图片名称'
                : type == 2
                ? '请输入视频名称'
                : '请输入文档名称'
            "
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="上传图片" required>
          <el-col class="header-img" :span="10">
            <AliImageUpload
              :imageUrl.sync="from.url"
              @files="files"
              :configUrl="API.upLoadImageApi.upLoadImageConfig"
            />
          </el-col>
        </el-form-item> -->
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
  name: "ChangeTitleDialog",

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
      default: 1,
    },
    currentGroup: {
      type: Object,
      default: () => {
        return {};
      },
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
        catoryValue: null,
      },
      options: [],
      rules: {
        catoryValue: [{ required: true, message: "选择分类", trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    open() {
    
      this.from.title = this.editItem.title;
      this.options = [this.currentGroup];
      this.from.catoryValue = this.currentGroup.id;
      this.getGroup();
      if (this.isAdd) {
      } else {
      }
    },
    getGroup() {
      this.$axios
        .get(this.API.newNetSchool.material.groupSelect, {
          params: { name: "", type: this.type },
        })
        .then((res) => {
          this.options = res.data;
        });
    },
    doAdding() {
      if (!this.from.title) {
        let tipStr =
          this.type == 1
            ? "请输入图片名称"
            : this.type == 2
            ? "请输入视频名称"
            : "请输入文档名称";
        this.$message.error(tipStr);
        return;
      }
      let params = {
        groupId: this.from.catoryValue,
        id: this.editItem.id,
        title: this.from.title,
      };

      let sucStr =
        this.type == 1
          ? "图片更新成功"
          : this.type == 2
          ? "视频更新成功"
          : "文档更新成功";

      this.$axios
        .post(this.API.newNetSchool.material.update, params)
        .then((res) => {
          if (res) {
            this.$emit("update:visible", false);
            this.$emit("addSuccess");

            this.$message({
              message: sucStr,

              type: "success",
            });
          }
        });
    },

    onClose() {
      this.$emit("update:visible", false);
    },

    //API
  },
};
</script>


<style lang="scss" scoped>
@import "./changeTitleDialog.scss";
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