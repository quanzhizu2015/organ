<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="40%"
    center
  >
    <div slot="title">新增</div>
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      ref="ruleForm"
    >
      <el-form-item label="教师名称">
        <el-input v-model="from.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="所属机构">
        <el-input v-model="from.schoolName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="账号" >
        <el-input v-model="from.account" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="电话" >
        <el-input v-model="from.phone" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="任课班级" >
        <el-input v-model="from.name" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import ossClient from "@/utils/aliyun.oss.client";
import AliImageUpload from "@/components/Upload/aliImageUpload.vue";
export default {
  components: {
    AliImageUpload,
  },
  name: "CheckTeacherDialog",
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

  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    open() {
      //console.log(this.editItem)
      if (this.isAdd) {
        this.from = {
          title: "",
          url: "",
        };
      } else {

        //console.log("open")
        let schoolName = ""
        this.editItem.schoolList.forEach((element,index) => {
          if(index==0){
            schoolName = element;
          }else{
            schoolName = schoolName+","+ element;
          }
         
          
        });
        this.from = {
          name: this.editItem.name,
          schoolName: schoolName,
          account: this.editItem.loginCode,
          phone:this.editItem.mobilePhone,

        };
      }
    },
    confirm() {
      if (this.isAdd) {
        this.add();
      } else {
        this.edit();
      }
    },

    handleClose() {
      this.$emit("update:visible", false);
    },

    // api
    add() {
      
    },

    edit() {
    
    },
  },
  data() {
    return {
      from: {
        name: "",
        schoolName: "",
        account: "",
        phone:"",
        classInfo:""
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
@import "./checkTeacherDialog.scss";
</style>