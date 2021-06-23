<template>
  <div>
    <Tinymce ref="desc" v-model="user.description" height="250"/>
    <!-- <el-form ref="form" label-position="left" label-width="25%">
      <el-form-item label="分享标题">
        <el-input
          v-model="sharForm.displayName"
          placeholder="请输入分享标题"
          class="classInput"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="分享内容">
     
        <el-input
          v-model="sharForm.desc"
          type="textarea"
          :rows="15"
          placeholder="请输入分享内容"
          class="classInput"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form> -->
    <!-- <span> {{sharForm.displayName +"我是父的"}}</span>
  
    <brief-input v-model="sharForm.displayName"></brief-input>
    <el-button type="primary" class="w-full" @click="save">保存</el-button> -->
    <el-button
      style="margin-top: 2rem"
      type="primary"
      class="w-full"
      @click="save"
      >保存</el-button
    >
  </div>
</template>
<script>
import BriefInput from "./briefInput.vue";
import Tinymce from "@/components/Tinymce/index.vue";
export default {
  components: {
    BriefInput,
    Tinymce,
  },
  data() {
    return {
      sharForm: {
        displayName: "quanzhizu",
        desc: "",
      },
      user: { description: "" },
      comTeacher: { displayName: "" },
      greatTeachers: [],
      options: [{ id: "", name: "" }],
      lists: [],
      description: "",
    };
  },
  created() {
    this.$on("goEdit", () => {
      this.getInfo();
    });
  },
  methods: {
    getInfo() {
      this.$axios.post("train/schoolWeb/getSchoolBaseInfo", {}).then((res) => {
        if (parseInt(res.code) === 0) {
          this.user = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    update() {
     
      this.$axios
        .post("train/schoolWeb/updateSchoolBaseInfo", this.user)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            // localStorage.setItem("user_name", this.user.userName);
            // localStorage.setItem("user_avatar", this.image);
            // this.$bus.$emit("upDateUserInfo", {});
            //this.$router.push({ path: "/" });
            this.$notify({
              title: "温馨提示",
              message: "个人信息已更新",
              type: "success",
            });
          } else {
            this.$message.error(response.message);
          }
          // this.$refs["upload"].$emit("clear");
        });
    },
    save() {
       this.update()
    },
  },
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
