<template>
  <el-upload
    ref="upload"
    list-type="picture"
    action
    :before-upload="beforeUpload"
    :file-list="imageList"
    :multiple="false"
    :http-request="uploadImg"
    :on-change="handleUploadChange"
    :on-remove="detel"
  >
    <!-- <i class="el-icon-plus"></i> -->
    <el-button slot="trigger" size="small" type="primary"
      >上传相册封面</el-button
    >
    <el-button
      style="margin-left: 10px"
      size="small"
      type="success"
      @click="submitUpload"
      >保存相册封面</el-button
    >
    <div slot="tip" class="el-upload__tip">
      点击上传相册封面，只能上传jpg/png文件（建议尺寸1005*396）
    </div>
  </el-upload>
</template>

<script>
export default {
  name: "SchoolLocalUpload",
  props: {
    image: {
      type: Array,
      // eslint-disable-next-line space-before-function-paren
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      type: "photo",
      imageList: [],
      ossMess: "",
      url: "",
      list: [],
      type: "",
    };
  },
  watch: {
    image(n, o) {
      this.imageList = [];
      n.forEach((element) => {
        if (element && element.url) {
          this.imageList.push(element);
        }
      });
    },
  },
  created() {
    this.imageList.push(...this.image);
  },
  methods: {
    beforeUpload(file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (file.type == "image/jpeg") {
        this.type = "image/jpg";
      } else {
        this.type = file.type;
      }
    },
    detel() {
      this.url = "";

      // if (this.list.length > 0) {
      //   this.$axios
      //     .post("art/tool/ossDeleteFile", { url: this.list[0] })
      //     .then((res) => {
      //       this.list = [];
      //     });
      // }
    },
    handleUploadChange(file, fileList) {
      this.imageList = fileList.slice(-1);
    },
    submitUpload() {
      this.$emit("saveImg", { url: this.url });
    },
    uploadImg(item) {
      const OSS = require("ali-oss");
      this.$axios.post("art/tool/ossAppConfig").then((res) => {
        if (parseInt(res.code) === 0) {
          this.ossMess = res.data;
          const client = new OSS({
            // region: "oss-cn-hangzhou",
            endpoint: this.ossMess.endpoint,
            accessKeyId: this.ossMess.AccessKeyId,
            accessKeySecret: this.ossMess.AccessKeySecret,
            stsToken: this.ossMess.SecurityToken,
            bucket: this.ossMess.bucket,
            expiration: this.ossMess.Expiration,
            contentType: this.type,
          });

          const filename = Date.parse(new Date());
          const fileExt = item.file.name.toLowerCase().split(".").splice(-1);
          const newFilename =
            res.data.dir +
            filename +
            "-" +
            Math.floor(Math.random() * Math.floor(999999)) +
            "." +
            fileExt[0];
          client.put(newFilename, item.file).then((res) => {
            this.url = res.url;
            this.list.push(res.url);
            // if (this.list.length > 1) {
            //   this.$axios
            //     .post("art/tool/ossDeleteFile", { url: this.list[0] })
            //     .then((res) => {
            //       this.list = this.list.slice(-1);
            //     });
            // }
          });
        }
      });
    },
  },
};
</script>

<style scope>
/* .el-upload--picture-card,
.el-upload-list--picture-card .el-upload-list__item {
  width: 100%;
} */
</style>
