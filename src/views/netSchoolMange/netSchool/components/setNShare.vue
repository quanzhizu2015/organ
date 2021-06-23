<template>
  <div>
    <el-form ref="form" label-position="left" label-width="30%">
      <el-form-item label="机构LOGO">
        <!-- <LocalUpload ref="upload" :image="image" @upload="getUrl"></LocalUpload> -->
        <!-- <AliOssUpload ref="upload" :image="image" @update="getUrl"  /> -->
        <!-- <el-col class="header-img" :span="22">
          <AliImageUpload
            :imageUrl.sync="sharForm.logo"
            :configUrl="API.upLoadImageApi.upLoadImageConfig"
          />
        </el-col> -->
        <div class="flex row ai-c">
          <el-image
            style="width: 100px; height: 100px"
            :src="sharForm.logo?sharForm.logo:'/img/default.png'"
            fit="cover"
          ></el-image>
          <el-button @click="imageAction" class="ml-1" type="primary"
            >上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
        </div>
        <p class="lh-105">只支持.jpg,.jpeg,.png,.gif,.bmp文件</p>
      </el-form-item>
      <el-form-item label="分享标题">
        <el-input
          v-model="sharForm.displayName"
          placeholder="请输入分享标题"
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
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <el-button type="primary" class="w-full" @click="save">保存</el-button>

    <AddFilesDialog
      :visible.sync="isImageVisible"
      @addSuccess="addImageSuccess"
      :type="1"
      @input="selectedImage"
    />
  </div>
</template>
<script>
import AliImageUpload from "@/components/Upload/aliImageUpload.vue";
import AddFilesDialog from "../../components/addFilesDialog";
export default {
  components: { AliImageUpload,AddFilesDialog },
  data() {
    return {
      isImageVisible: false,
      sharForm: {
        displayName: "",
        desc: "",
        logo: "",
      },
      user: { imgUrl: "" },
      image: "",
      comTeacher: { displayName: "" },
      greatTeachers: [],
      options: [{ id: "", name: "" }],
      lists: [],
    };
  },
  created() {
    this.$on("goEdit", () => {
      this.getInfo();
      // this.getSchoolInfo();
    });
  },
  methods: {
    imageAction() {
      this.isImageVisible = true;
    },
    addImageSuccess() {},
    selectedImage(items, showType) {
      // console.log("selectedImage" + JSON.stringify(items) + showType);
      this.isImageVisible = false;
      items.forEach((element) => {
        this.sharForm.logo = element.url;
      });
    },
    getInfo() {
      this.$axios.get(this.API.organ.getShareInfo).then((res) => {
        if (res) {
          this.sharForm = {
            displayName: res.data.shareTitle,
            desc: res.data.shareContent,
            logo: res.data.schoolLogo,
          };
        }
      });
    },
    getUrl(url) {
      //this.user.imgUrl = url;
      this.sharForm.logo = url;
    },

    getSchoolInfo() {
      this.$axios.post("train/schoolWeb/getSchoolBaseInfo", {}).then((res) => {
        if (parseInt(res.code) === 0) {
          this.user = res.data;

          if (res.data.imgUrl) {
            this.image = res.data.imgUrl;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    update() {
      let params = {
        ...this.user,
        imgUrl: this.image,
      };
      this.$axios
        .post("train/schoolWeb/updateSchoolBaseInfo", params)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            localStorage.setItem("user_name", this.user.userName);
            localStorage.setItem("user_avatar", this.image);

            this.$bus.$emit("upDateUserInfo", {});

            //this.$router.push({ path: "/" });
            // this.$notify({
            //   title: "温馨提示",
            //   message: "个人信息已更新",
            //   type: "success",
            // });
          } else {
            this.$message.error(response.message);
          }
          //this.$refs["upload"].$emit("clear");
        });
    },

    save() {
      if (!this.sharForm.displayName) {
        this.$message.error("请输入分享标题");
        return;
      }
      if (!this.sharForm.desc) {
        this.$message.error("请输入分享内容");
        return;
      }
      if (!this.sharForm.logo) {
        this.$message.error("请设置分享图片");
        return;
      }
      // this.update();

      this.$axios
        .post(this.API.organ.shareInfo, {
          shareContent: this.sharForm.desc,
          shareTitle: this.sharForm.displayName,
          logo: this.sharForm.logo,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
          }
        });
    },
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
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
<style scoped>
.header-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

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
