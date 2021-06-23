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
        <el-form-item label="视频名称" prop="title">
          <el-input
            v-model="ruleForm.title"
            maxlength="40"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="视频简介" prop="abbre">
          <el-input
            v-model="ruleForm.abbre"
            type="textarea"
            maxlength="200"
            :show-word-limit="true"
            :rows="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="视频上传" required>
          <!-- <AliOssMultiVideos ref="upload" @input="getVideo" :image="videos" /> -->
          <div class="flex row ai-c">
            <div style="width: 100px; height: 100px; position: relative">
              <el-image
                style="width: 100px; height: 100px"
                :src="ruleForm.videoUrl"
                fit="cover"
                @click="openVideo(ruleForm.url)"
              >
              </el-image>
              <i
                class="el-icon-video-play playImg"
                @click="openVideo(ruleForm.url)"
              ></i>
            </div>

            <!-- <video-player
              class="video-player-box vjs-custom-skin"
              ref="videoPlayer"
              :options="playerOptions"
              :playsinline="true"
              customEventName="customstatechangedeventname"
              @play="onPlayerPlay($event)"
              @pause="onPlayerPause($event)"
              @ended="onPlayerEnded($event)"
              @waiting="onPlayerWaiting($event)"
              @playing="onPlayerPlaying($event)"
              @loadeddata="onPlayerLoadeddata($event)"
              @timeupdate="onPlayerTimeupdate($event)"
              @canplay="onPlayerCanplay($event)"
              @canplaythrough="onPlayerCanplaythrough($event)"
              @statechanged="playerStateChanged($event)"
              @ready="playerReadied"
            >
            </video-player> -->
            <el-button class="ml-1" @click="videoAction" type="primary"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </div>
          <span> 视频文件建议90M以内,只支持 mp4 文件</span>
        </el-form-item>
        <el-form-item label="视频封面">
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
        <el-form-item label="视频详情" required>
          <Tinymce
            ref="desc"
            v-model="ruleForm.detail"
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
        <el-form-item label="视频类型" required>
          <el-radio-group v-model="ruleForm.isGoods">
            <el-radio :label="1">视频信息是商品</el-radio>
            <el-radio :label="0">视频信息是非商品</el-radio>
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
                <el-form-item label="商品价格" required>
                  <el-input
                    v-model="ruleForm.price"
                    style="width: 20rem"
                  ></el-input>
                </el-form-item>
                <p class="ml-1">元</p>
              </div>

              <div class="flex row ai-c">
                <el-form-item class="mt-1" label="划线价格">
                  <el-input
                    v-model="ruleForm.originalPrice"
                    style="width: 20rem"
                  ></el-input>
                </el-form-item>
                <p class="ml-1">元</p>
              </div>
            </div>

            <div v-show="ruleForm.saleModel == 3" class="pd-2">
              <el-form-item label="密码" required>
                <el-input v-model="ruleForm.password" style="width: 20rem">
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
                    :disabled="ruleForm.onlineState != 2"
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
    </div>
    <AddFilesDialog
      :visible.sync="isVideoVisible"
      @addSuccess="addVideoSuccess"
      :type="2"
      @input="selectedVideo"
    />
    <AddFilesDialog
      :visible.sync="isImageVisible"
      @addSuccess="addImageSuccess"
      :type="1"
      @input="selectedImage"
    />
    <AddFilesDialog
      :visible.sync="isFileVisible"
      @addSuccess="addFileSuccess"
      :type="4"
      @input="selectedFile"
    />
  </div>
</template>
<script>
// require styles
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import AliImageSmallUpload from "@/components/Upload/AliImageSmallUpload.vue";
import Tinymce from "@/components/Tinymce/index.vue";
import AliMultiUpload from "@/components/Upload/AliMultiUpload";
import AliOssUpload from "@/components/Upload/AliOssUpload";
import AliOssMultiVideos from "@/components/Upload/AliOssMultiVideos";
import AliMultiUpLoadFiles from "@/components/Upload/AliMultiUpLoadFiles";
import AddFilesDialog from "../../components/addFilesDialog";
import { videoPlayer } from "vue-video-player";
export default {
  components: {
    AliImageSmallUpload,
    Tinymce,
    AliMultiUpload,
    AliOssUpload,
    AliOssMultiVideos,
    AliMultiUpLoadFiles,
    AddFilesDialog,
    videoPlayer,
  },
  data() {
    return {
      isVideoVisible: false,
      isImageVisible: false,
      isFileVisible: false,
      filesLength: 0,

      productId: "",
      ruleForm: {
        title: "",
        abbre: "",
        videoUrl: "/img/default.png",
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
        type: 2, // 1:图文,2:视频,3:文本
      },
      data: { title: "", url: "", size: "", img: "", timeLenght: "" },
      videos: [],
      productGroups: [],
      options: [],
      rules: {
        title: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
        abbre: [{ required: true, message: "请输入视频简介", trigger: "blur" }],
      },
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "",
            //src: require("../assets/img/sp.mp4"), // url地址
          },
        ],
        poster: "/img/default.png", // 封面地址
        // notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
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
    openVideo(url) {
      window.open(url);
    },
    open() {},
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event

    onPlayerEnded(player) {},
    onPlayerWaiting(player) {},
    onPlayerPlaying(player) {},
    onPlayerLoadeddata(player) {},
    onPlayerTimeupdate(player) {},
    onPlayerCanplay(player) {},
    onPlayerCanplaythrough() {},

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log("the player is readied", player);
      // you can use it to do something...
      // player.[methods]
    },
    videoAction() {
      this.isVideoVisible = true;
    },
    addVideoSuccess() {},
    selectedVideo(items, showType) {
      this.isVideoVisible = false;
      items.forEach((element) => {
        this.ruleForm.url = element.url;
        this.ruleForm.videoUrl = element.coverUrl;
      });
    },
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

    delFile(item) {
      let files = [];
      this.ruleForm.additions.forEach((file) => {
        if (file.tag != item.tag) {
          files.push(file);
        }
      });
      this.ruleForm.additions = files;
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
      console.log("selectedFile" + JSON.stringify(items) + showType);
      items.forEach((element) => {
        if (files.length < 21) {
          files.push({ ...element, tag: this.filesLength++ });
        }
      });
      this.ruleForm.additions = files;
    },

    getVideo(params) {
      this.data.url = params.url;
      this.data.img = params.img;
      this.data.timeLenght = params.timeLenght;
      this.data.size = params.size;
    },
    getDetail() {
      this.$axios
        .get(this.API.newNetSchool.schoolData.detail + "?id=" + this.productId)
        .then((res) => {
          if (res) {
            this.ruleForm = { ...res.data };
            // if (res.data.url) {
            //   this.videos = [res.data.url];
            // }
            if (this.ruleForm.price) {
              this.ruleForm.price = res.data.price / 100.0;
            }
            if (this.ruleForm.originalPrice) {
              this.ruleForm.originalPrice = res.data.originalPrice / 100.0;
            }
            let files = [];
            res.data.additions.forEach((item) => {
              files.push({ ...item, tag: this.filesLength++ });
            });

            this.ruleForm.additions = files;
            this.ruleForm.files = res.data.additions;
            this.ruleForm.videoUrl = res.data.coverUrl;
          }
        });
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
    getFiles(params) {
      this.ruleForm.additions = params;
      if (this.productId) {
        this.update(this.ruleForm.additions);
      } else {
        this.add(this.ruleForm.additions);
      }
    },

    //api
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
      if (!this.ruleForm.abbre) {
        this.$message.error("请输入简介");
        return;
      }
      if (!this.ruleForm.coverUrl) {
        this.$message.error("请上传视频封面");
        return;
      }
      if (!this.ruleForm.url) {
        this.$message.error("请上传视频");
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
        url: this.ruleForm.url,

        isGoods: this.ruleForm.isGoods,
        saleModel: this.ruleForm.saleModel,
        groupId: this.ruleForm.groupId,
        onlineState: this.ruleForm.onlineState,

        price: this.ruleForm.price * 100,
        originalPrice: this.ruleForm.originalPrice * 100,
        password: this.ruleForm.password,
        type: 2,
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
              query: { type: 2 },
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

      if (!this.ruleForm.coverUrl) {
        this.$message.error("请上传视频封面");
        return;
      }
      if (!this.ruleForm.url) {
        this.$message.error("请上传视频");
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

        url: this.ruleForm.url,

        additions: filesData,

        isGoods: this.ruleForm.isGoods,
        saleModel: this.ruleForm.saleModel,
        groupId: this.ruleForm.groupId,

        price: this.ruleForm.price * 100,
        originalPrice: this.ruleForm.originalPrice * 100,
        password: this.ruleForm.password,
        type: 2,
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
              query: { type: 2 },
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
.playImg {
  position: absolute;
  bottom: 35px;
  right: 35px;

  font-size: 30px;
}
</style>