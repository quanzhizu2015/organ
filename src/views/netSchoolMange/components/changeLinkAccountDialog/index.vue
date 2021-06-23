<template>
  <div class="sdialog">
    <el-dialog
      width="55%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false"
    >
      <div slot="title">切换绑定账号</div>
      <div class="flex row jc-sb mb-1">
        <el-button type="primary" @click="linkAccount">绑定账号</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="accountListData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        height="280"
      >
        <el-table-column label="账号">
          <template slot-scope="scope">
            <span>{{ scope.row.loginCode }}</span>
            <span v-show="scope.row.bindSchoolId == currentSchoolId">{{
              "(当前主账号)"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-show="scope.row.bindSchoolId != currentSchoolId" type="text" @click="selectAccount(scope.row)"
              >设置为当前账号</el-button
            >
            <el-button v-show="scope.row.bindSchoolId != currentSchoolId" type="text" @click="delAccount(scope.row)"
              >解绑关联账号</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doAdding">确定</el-button>
      </div>
    </el-dialog>
    <LinkAccountDialog
      :visible.sync="linkVisible"
      @addSuccess="addSuccess"
    ></LinkAccountDialog>
  </div>
</template>

<script>
import LinkAccountDialog from "../linkAccountDialog/index";
export default {
  name: "ChangeLinkAccountDialog",
  components: {
    LinkAccountDialog,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 1,
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
      linkVisible: false,
      currentSchoolId: "",
      accountListData: [],
    };
  },
  created() {},
  methods: {
    open() {
      
      this.currentSchoolId = localStorage.getItem("currentSchoolId");
      this.accountList();

      if (this.isAdd) {
      } else {
      }
    },

    addSuccess() {
      this.linkVisible = false;
       this.$emit("bindSuccess")
    },
    linkAccount() {
      this.linkVisible = true;
    },

    accountList() {
      this.$axios
        .post(this.API.newNetSchool.school.changeSelect, {})
        .then((res) => {
          if (res) {
            this.accountListData = res.data;
          }
        });
    },
    selectAccount(item) {
      this.$axios
        .post(this.API.newNetSchool.school.change+"?bindSchoolId="+item.bindSchoolId)
        .then((res) => {
          if (res) {
           // localStorage.setItem("currentSchoolId",);
            localStorage.setItem("currentSchoolId", item.bindSchoolId)
            this.$emit("addSuccess")
            this.$message({
              type: "success",
              message: "切换成功!",
            });
          }
        });
    },
    delAccount(item) {
      this.$confirm("此操作将解绑网校账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .get(this.API.newNetSchool.school.unbind, {
              params: { unBindSchoolId: item.bindSchoolId },
            })
            .then((res) => {
              if (res) {
                this.$emit("bindSuccess")
                this.$message({
                  type: "success",
                  message: "解绑成功!",
                });
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
    doAdding() {
      this.$emit("update:visible", false);
    },

    onClose() {
      this.$emit("update:visible", false);
    },

    //API
  },
};
</script>


<style lang="scss" scoped>
@import "./changeLinkAccountDialog.scss";
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