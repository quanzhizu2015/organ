<template>
  <div class="wrap">
    <div>
      <div><span class="tx-09 tx-wb">基本信息</span></div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="图文名称" prop="title">
          <el-input
            v-model="ruleForm.title"
            maxlength="40"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="图文简介" prop="abbre">
          <el-input
            v-model="ruleForm.abbre"
            type="textarea"
            maxlength="200"
            :show-word-limit="true"
            :rows="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="图文封面">
          <div class="flex row ai-c">
            <el-image
              style="width: 100px; height: 100px"
              :src="ruleForm.coverUrl"
              fit="cover"
            ></el-image>
            <el-button @click="imageAction" class="ml-1" type="primary"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </div>
          <span>只支持 .jpg,.jpeg,.png,.gif,.bmp文件</span>
          <!-- <AliImageSmallUpload
            :imageUrl.sync="ruleForm.coverUrl"
            :configUrl="API.upLoadImageApi.upLoadImageConfig"
          /> -->
        </el-form-item>
        <el-form-item label="图文详情" required>
          <Tinymce
            ref="desc"
            v-model="ruleForm.detail"
            height="300"
            :isCheckSize="true"
          />
        </el-form-item>
        <el-form-item label="试看内容">
          <Tinymce
            ref="redesc"
            v-model="ruleForm.tryDetail"
            height="300"
            :isCheckSize="true"
          />
        </el-form-item>
        <!-- <el-form-item label="相关资料">
          <div class="flex column ai-s">
            <el-button @click="filesAction" class="ml-1" type="primary"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <span>最多添加20个文件</span>
            <div class="ml-1 mt-1">
              <div
                v-for="item in ruleForm.additions"
                :key="item.url + item.tag"
              >
                <div class="flex row ai-c">
                  <el-image
                    style="width: 30px; height: 30px"
                    :src="
                      item.type == 1
                        ? item.url
                        : item.type == 2
                        ? item.coverUrl
                        : './img/defaultFile.png'
                    "
                    fit="cover"
                  ></el-image>
                  <span>{{ item.title }}</span>
                  <div class="ml-2" @click="delFile(item)">
                    <i class="el-icon-circle-close"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item> -->
        <el-form-item label="图文类型" required>
          <el-radio-group v-model="ruleForm.isGoods">
            <el-radio :label="1">图文信息是商品</el-radio>
            <el-radio :label="0">图文信息是非商品</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="mt-1" label="商品分组">
          <el-select v-model="ruleForm.groupId" placeholder="请选择分组">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-show="ruleForm.isGoods == 1">
        <div>
          <span class="tx-09 tx-wb">商品信息</span>
        </div>

        <el-form
          :model="ruleForm"
          ref="ruleForm1"
          label-width="100px"
          class="demo-ruleForm"
        >
          <!-- 1:付费,2:免费,3:加密-->
          <el-form-item label="售卖方式" required>
            <el-radio-group
              v-model="ruleForm.saleModel"
              @change="saleModelChange"
            >
              <el-radio :label="2">免费</el-radio>
              <el-radio :label="1">付费</el-radio>

              <el-radio :label="3">加密</el-radio>
            </el-radio-group>
            <div v-show="ruleForm.saleModel == 1" class="pd-2">
              <div class="flex row ai-c">
                <el-form-item
                  label="商品价格"
                  placeholder="请输入价格"
                  required
                >
                  <el-input
                    style="width: 20rem"
                    v-model="ruleForm.price"
                    placeholder="请输入价格"
                  ></el-input>
                </el-form-item>
                <p class="ml-1">元</p>
              </div>
              <div class="flex row ai-c">
                <el-form-item class="mt-1" label="划线价格">
                  <el-input
                    style="width: 20rem"
                    v-model="ruleForm.originalPrice"
                    placeholder="请输入划线价格"
                  ></el-input>
                </el-form-item>
                <p class="ml-1">元</p>
              </div>
            </div>

            <div v-show="ruleForm.saleModel == 3" class="pd-2">
              <el-form-item label="密码" required>
                <el-input
                  style="width: 20rem"
                  v-model="ruleForm.password"
                  placeholder="请输入密码"
                >
                </el-input>
              </el-form-item>
            </div>
          </el-form-item>
        </el-form>
        <div v-show="!productId">
          <span class="tx-09 tx-wb">上架设置</span>
        </div>

        <el-form
          :model="ruleForm"
          ref="ruleForm2"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item v-show="!productId" label="上架设置" required>
            <el-radio-group v-model="ruleForm.onlineState">
              <div class="flex column h-8 jc-sb pd-1">
                <el-radio :label="1">立即上架</el-radio>
                <!-- <div>
                  <el-radio :label="2">定时上架</el-radio>
                  <el-date-picker
                    v-model="ruleForm.dateTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :disabled="ruleForm.putOnType != 2"
                    :clearable="false"
                  >
                  </el-date-picker>
                </div> -->
                <el-radio :label="0">暂不上架</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <div class="pd-2 ta-c w-p100">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </div>
      <!--图文封面-->
      <AddFilesDialog
        :visible.sync="isImageVisible"
        @addSuccess="addImageSuccess"
        :type="1"
        @input="selectedImage"
      />
      <!--图文相关文件-->
      <AddFilesDialog
        :visible.sync="isFileVisible"
        @addSuccess="addFileSuccess"
        :type="4"
        @input="selectedFile"
      />
    </div>
  </div>
</template>
<script>
import AliImageSmallUpload from "@/components/Upload/AliImageSmallUpload.vue";
import Tinymce from "@/components/Tinymce/index.vue";
import AliMultiUpload from "@/components/Upload/AliMultiUpload";
import AliOssUpload from "@/components/Upload/AliOssUpload";
import AliMultiUpLoadFiles from "@/components/Upload/AliMultiUpLoadFiles";
import AddFilesDialog from "../../components/addFilesDialog";
export default {
  components: {
    AliImageSmallUpload,
    Tinymce,
    AliMultiUpload,
    AliOssUpload,
    AliMultiUpLoadFiles,
    AddFilesDialog,
  },
  data() {
    return {
      //       additions	[...]
      // coverUrl	string
      // 封面

      // detail*	string
      // 详情(富文本)

      // groupId	integer($int32)
      // 数据组id 0表示默认分组

      // isGoods*	integer($int32)
      // 是否商品 0:不是,1:是

      // onlineState	integer($int32)
      // 上架状态 0:下架,1:上架(默认1)

      // originalPrice	integer($int32)
      // 原价(单位分)

      // password	string
      // 密码

      // price	integer($int32)
      // 价格(单位分)

      // saleModel	integer($int32)
      // 售卖方式 1:付费,2:免费,3:加密

      // title*	string
      // 标题

      // tryDetail	string
      // 试看(富文本)

      // type*	integer($int32)
      // 数据类型 1:图文,2:视频,3:文本

      // url	string
      // 链接
      isImageVisible: false,
      isFileVisible: false,
      filesLength: 0,

      productId: "",
      ruleForm: {
        title: "",
        abbre: "",
        coverUrl: "/img/default.png",
        detail: "",
        tryDetail: "",
        files: [],
        additions: [],

        url: "",

        isGoods: 1,
        saleModel: 2,
        groupId: 0,
        onlineState: 1,

        price: "",
        originalPrice: "",
        password: "",
        dateTime: "",
        type: 1, // 1:图文,2:视频,3:文本
      },
      productGroups: [],
      options: [],
      rules: {
        title: [{ required: true, message: "请输入图文名称", trigger: "blur" }],
        abbre: [{ required: true, message: "请输入图文简介", trigger: "blur" }],
      },
    };
  },
  created() {
    if (this.$route.query.productId) {
      this.productId = this.$route.query.productId;
      this.getDetail();
    } else {
      this.$nextTick(() => {
        this.ruleForm.files = [];
      });
    }
    this.getGroupList();
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
        this.ruleForm.coverUrl = element.url;
      });
    },
    filesAction() {
      this.isFileVisible = true;
    },
    addFileSuccess() {},
    selectedFile(items, showType) {
      this.isFileVisible = false;
      if (!items || items.length < 1) {
        return;
      }
      let files = [];
      if (this.ruleForm.additions && this.ruleForm.additions.length > 0) {
        files = [...this.ruleForm.additions];
      }
      let length = files.length + items.length;
      if (length > 20) {
        this.$message.error("相关资料数量不能大于20");
        return;
      }

      items.forEach((element) => {
        if (files.length < 21) {
          files.push({ ...element, tag: this.filesLength++ });
        }
      });
      this.ruleForm.additions = files;
      console.log("selectedFile" + JSON.stringify(files) + showType);
    },

    mutiUpdate(params) {
      let filesData = [];
      params.forEach((element) => {
        filesData.push({
          url: element.url,
          size: element.size / 1024,
          name: element.name,
        });
      });

      if (this.productId) {
        this.update(filesData);
      } else {
        this.add(filesData);
      }
    },
    submitForm(formName) {
      let filesData = [];
      this.ruleForm.additions.forEach((item) => {
        filesData.push({ url: item.url, title: item.title, type: item.type });
      });
      if (this.productId) {
        this.update(filesData);
      } else {
        this.add(filesData);
      }
    },
    saleModelChange(saleMod) {
      //售卖方式 1:付费,2:免费,3:加密
      if (saleMod == 2) {
        this.ruleForm.price = "";
        this.ruleForm.originalPrice = "";
        this.ruleForm.password = "";
      } else if (saleMod == 1) {
        this.ruleForm.password = "";
      } else if (saleMod == 3) {
        this.ruleForm.price = "";
        this.ruleForm.originalPrice = "";
      }
    },
    delFile(item) {
      let files = [];
      this.ruleForm.additions.forEach((file) => {
        if (file.tag != item.tag) {
          files.push(file);
        }
      });
      this.ruleForm.additions = files;
    },
    getFiles(params) {
      this.ruleForm.additions = params;
      if (this.productId) {
        this.update(this.ruleForm.additions);
      } else {
        this.add(this.ruleForm.additions);
      }
    },

    //api
    getDetail() {
      this.$axios
        .get(this.API.newNetSchool.schoolData.detail + "?id=" + this.productId)
        .then((res) => {
          if (res) {
            this.ruleForm = { ...res.data };
            if (this.ruleForm.price) {
              this.ruleForm.price = res.data.price / 100.0;
            }
            if (this.ruleForm.originalPrice) {
              this.ruleForm.originalPrice = res.data.originalPrice / 100.0;
            }

            // if (res.data.url) {
            //   this.videos = [res.data.url];
            // }
            let files = [];
            res.data.additions.forEach((item) => {
              files.push({ ...item, tag: this.filesLength++ });
            });

            this.ruleForm.additions = files;
          }
        });
    },
    getGroupList() {
      this.$axios
        .get(this.API.newNetSchool.schoolGroup.groupSelect + "?name=")
        .then((res) => {
          if (res) {
            this.options = res.data;
          }
        });
    },
    add(filesData) {
      if (!this.ruleForm.title) {
        this.$message.error("请输入标题");
        return;
      }
      if (!this.ruleForm.abbre) {
        this.$message.error("请输入简介");
        return;
      }
      if (!this.ruleForm.detail) {
        this.$message.error("请输入详情");
        return;
      }

      if (
        this.ruleForm.isGoods &&
        this.ruleForm.saleModel == 1 &&
        !this.ruleForm.price
      ) {
        //售卖方式 1:付费,2:免费,3:加密
        this.$message.error("请输入价格");
        return;
      }
      if (
        this.ruleForm.isGoods &&
        this.ruleForm.saleModel == 1 &&
        this.ruleForm.price &&
        this.ruleForm.originalPrice &&
        parseFloat(this.ruleForm.originalPrice) <
          parseFloat(this.ruleForm.price)
      ) {
        //售卖方式 1:付费,2:免费,3:加密
        this.$message.error("划线价格不能小于商品价格");
        return;
      }
      if (
        this.ruleForm.isGoods &&
        this.ruleForm.saleModel == 3 &&
        !this.ruleForm.password
      ) {
        //售卖方式 1:付费,2:免费,3:加密
        this.$message.error("请输入密码");
        return;
      }
      let params = {
        title: this.ruleForm.title,
        abbre: this.ruleForm.abbre,
        coverUrl: this.ruleForm.coverUrl,
        detail: this.ruleForm.detail,
        tryDetail: this.ruleForm.tryDetail,

        additions: filesData,

        isGoods: this.ruleForm.isGoods,
        saleModel: this.ruleForm.saleModel,
        groupId: this.ruleForm.groupId,
        onlineState: this.ruleForm.onlineState,

        price: this.ruleForm.price * 100,
        originalPrice: this.ruleForm.originalPrice * 100,
        password: this.ruleForm.password,
        type: 1,
      };
      this.$axios
        .post(this.API.newNetSchool.schoolData.add, params)
        .then((res) => {
          if (res) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.$router.push({
              path: "/netSchoolUpLoadPage",
              query: { type: 1 },
            });
          }
        });
    },
    update(filesData) {
      if (!this.ruleForm.title) {
        this.$message.error("请输入标题");
        return;
      }
      if (!this.ruleForm.abbre) {
        this.$message.error("请输入简介");
        return;
      }
      if (!this.ruleForm.detail) {
        this.$message.error("请输入详情");
        return;
      }

      if (
        this.ruleForm.isGoods &&
        this.ruleForm.saleModel == 1 &&
        !this.ruleForm.price
      ) {
        //售卖方式 1:付费,2:免费,3:加密
        this.$message.error("请输入价格");
        return;
      }
      if (
        this.ruleForm.isGoods &&
        this.ruleForm.saleModel == 1 &&
        this.ruleForm.price &&
        this.ruleForm.originalPrice &&
        parseFloat(this.ruleForm.originalPrice) <
          parseFloat(this.ruleForm.price)
      ) {
        //售卖方式 1:付费,2:免费,3:加密
        this.$message.error("划线价格不能小于商品价格");
        return;
      }
      if (
        this.ruleForm.isGoods &&
        this.ruleForm.saleModel == 3 &&
        !this.ruleForm.password
      ) {
        //售卖方式 1:付费,2:免费,3:加密
        this.$message.error("请输入密码");
        return;
      }
      let params = {
        title: this.ruleForm.title,
        abbre: this.ruleForm.abbre,
        coverUrl: this.ruleForm.coverUrl,
        detail: this.ruleForm.detail,
        tryDetail: this.ruleForm.tryDetail,

        additions: filesData,

        isGoods: this.ruleForm.isGoods,
        saleModel: this.ruleForm.saleModel,
        groupId: this.ruleForm.groupId,

        price: this.ruleForm.price * 100,
        originalPrice: this.ruleForm.originalPrice * 100,
        password: this.ruleForm.password,
        type: 1,
        id: this.productId,
      };
      this.$axios
        .post(this.API.newNetSchool.schoolData.update, params)
        .then((res) => {
          if (res) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.$router.push({
              path: "/netSchoolUpLoadPage",
              query: { type: 1 },
            });
          }
        });
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 60px;
  left: 0px;
  background-color: #fff;
  padding: 2rem 5rem 2rem 2rem;
  overflow-y: auto;
}
</style>