<template>
  <div class="school">
    <!-- <div style="width:770px;margin:0 auto;">
      <p class="text-red">
        1.可以拖拽模块进行个性化排序,排好后请按保存
        <br />2.点击各模块可以进行模块设置
      </p>
      <el-button type="primary" style="width:375px;" class="mb-10" @click="setData">保存</el-button>
    </div>-->

    <!-- 展示区 -->
    <div class="home">
      <div class="flex-between px-20">
        <i class="el-icon-arrow-left" style="font-size: 18px"></i>
        <p>画室主页</p>
        <img src="@/assets/school/sl.png" alt style="width: 24px" />
      </div>
      <draggable v-model="draggable" v-bind="dragOptions">
        <transition-group type="transition" name="flip-list">
          <div v-for="item in draggable" :key="item.groupId">
            <!-- 轮播 -->
            <div
              v-if="item.groupId == 'banner'"
              class="home-block cursor hovers"
            >
              <div class="w-full" @click="show('isSetRotation')">
                <el-carousel
                  trigger="click"
                  height="132px"
                  indicator-position="none"
                >
                  <el-carousel-item
                    v-for="(list, index) in swipeLists"
                    :key="index"
                  >
                    <img :src="list.url" alt="轮播" class="w-full rounded-sm" />
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
            <!-- 导航icon -->
            <div
              v-else-if="item.groupId == 'toobar'"
              class="home-block cursor hovers"
            >
              <div class="flex-between" @click="show('isSetNav')">
                <div
                  v-for="(navlist, t) in toobar"
                  :key="t"
                  class="w-4 flex flex-col"
                >
                  <img :src="navlist.iconImg" alt class="img-icon" />
                  <p class="img-txt">{{ navlist.displayName }}</p>
                </div>
              </div>
            </div>
            <!-- 相册封面 -->

            <div
              v-else-if="item.groupId == 'comPhoto'"
              class="w-full pb-10 hovers cursor"
            >
              <div class="w-full">
                <div class="w-full flex-between intro">
                  <h3>学校相册</h3>
                  <p class="flex">
                    <span style="font-size: 12px">查看更多</span>
                    <i class="el-icon-arrow-right" style="font-size: 14px"></i>
                  </p>
                </div>
                <div class="relative" @click="show('isChangePicture')">
                  <img :src="photoObj.img" alt class="w-full" />
                  <p class="total">
                    <img src="@/assets/school/tot.png" alt />
                    <span>{{ photoNum }}</span>
                  </p>
                </div>
                <!-- <div class="w-full nowrap">{{ school.description }}</div> -->
              </div>
              <!-- <h3>画室相册</h3>
              <div class="relative" @click="show('isChangePicture')">
                <img :src="photoObj.img" alt class="w-full" />
                <p class="total">
                  <img src="@/assets/school/tot.png" alt />
                  <span>{{ photoNum }}</span>
                </p>
              </div> -->
            </div>
            <!-- 画室简介 -->
            <div
              v-else-if="item.groupId == 'comDesc'"
              class="w-full pb-10 hovers cursor"
              @click="show('isSetBrief')"
            >
              <div class="w-full">
                <div class="w-full flex-between intro">
                  <h3>{{ school.userName }}</h3>
                  <p class="flex">
                    <span style="font-size: 12px">查看简介</span>
                    <i class="el-icon-arrow-right" style="font-size: 14px"></i>
                  </p>
                </div>
                <!-- <div class="w-full nowrap">{{ school.description }}</div> -->
              </div>
            </div>
            <!-- 直播 -->
            <img
              v-else-if="item.groupId == 'liveVideo'"
              src="@/assets/school/zb.jpg"
              alt
              class="w-full cursor hovers pb-10"
              @click="$message('暂未开放')"
            />
            <!--开设 课程 -->
            <div
              v-else-if="item.groupId == 'course'"
              class="w-full bg-gray cursor hovers"
              @click="show('isSetCourse')"
            >
              <div class="flex-between mb-10" style="height: 30px">
                <h3>{{ course.displayName }}（{{ course.list.length }}）</h3>
                <p class="text-xs">
                  查看更多
                  <i class="el-icon-arrow-right"></i>
                </p>
              </div>
              <div
                v-for="(list, x) in course.list.slice(0, 4)"
                :key="x"
                class="w-full flex-between mb-20 bg-white"
                style="height: 95px; padding-right: 10px"
              >
                <img :src="list.url" alt style="width: 43%; height: 100%" />
                <div class="flex-col" style="width: 55%; padding-top: 10px">
                  <div class="text-bold">{{ list.title }}</div>
                  <div class="moreWrap text-xs" style="height: 40px">
                    {{ list.desc2 }}
                  </div>
                  <div class="flex-between text-xs">
                    <div>
                      <img
                        src="@/assets/school/person.png"
                        style="width: 10px; margin-right: 4px"
                      />
                      {{ list.studentCount }}人
                    </div>
                    <div>
                      <span class="text-base text-red text-bold">{{
                        list.fee
                      }}</span>
                      元/期
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 优秀师资 -->
            <div
              v-else-if="item.groupId == 'comTeacher'"
              src="@/assets/school/yxsz.png"
              alt
              class="w-full cursor hovers"
              @click="show('isSetTeacher')"
            >
              <div class="flex-between bg-white mb-10" style="height: 30px">
                <h3>
                  {{ comTeacher.displayName }}（{{ comTeacher.list.length }}）
                </h3>
                <p class="text-xs">
                  查看更多
                  <i class="el-icon-arrow-right"></i>
                </p>
              </div>
              <div class="w-full flex-start" style="flex-wrap: wrap">
                <div
                  v-for="(great, index) in comTeacher.list.slice(0, 6)"
                  :key="index"
                  class="flex flex-col mb-10 greatImg"
                  style="
                    width: 104px;
                    min-height: 140px;
                    align-items: flex-start;
                  "
                >
                  <img
                    :src="great.img ? getNowebpImg(great.img) : headerUrl"
                    alt
                    class="w-full"
                    style="height: 96px; object-fit: cover"
                  />

                  <div
                    class="text-bold"
                    style="line-height: 17px; font-size: 12px"
                  >
                    {{ great.name }}
                  </div>
                  <div
                    class="w-full moreWrap text-xs"
                    style="line-height: 17px"
                  >
                    {{ great.desc }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 优秀画作 -->
            <div
              v-else-if="item.groupId == 'youXiouHuaZuo'"
              src="@/assets/school/yxsz.png"
              alt
              class="w-full cursor hovers"
              @click="show('isSetPaint')"
            >
              <div class="flex-between bg-white mb-10" style="height: 30px">
                <h3>
                  {{ greatPaints.displayName }}（{{ greatPaints.list.length }}）
                </h3>
                <p class="text-xs">
                  查看更多
                  <i class="el-icon-arrow-right"></i>
                </p>
              </div>
              <div class="w-full flex-between" style="flex-wrap: wrap">
                <img
                  v-for="(great, index) in greatPaints.list.slice(0, 3)"
                  :key="index"
                  :src="great.url"
                  alt
                  class="w-full mb-10"
                  style="width: 104px; height: 104px"
                />
              </div>
            </div>
            <!-- 机构视频 -->
            <div
              v-else-if="item.groupId == 'comVideo'"
              src="@/assets/school/yxsz.png"
              alt
              class="w-full cursor hovers"
              @click="show('isSetVideo')"
            >
              <div class="flex-between bg-white mb-10" style="height: 30px">
                <h3>
                  {{ comVideo.displayName }}（{{ comVideo.list.length }}）
                </h3>
                <p class="text-xs">
                  查看更多
                  <i class="el-icon-arrow-right"></i>
                </p>
              </div>
              <div class="w-full flex-between">
                <div
                  v-for="(video, index) in comVideo.list.slice(0, 2)"
                  :key="index"
                  class="mb-10 flex-start flex-col"
                  style="width: 160px"
                >
                  <img
                    :src="video.img"
                    alt
                    class="w-full"
                    style="height: 90px"
                  />
                  <div class="moreWrap text-xs">
                    {{ video.title ? video.title : "" }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 机构位置 -->
            <div
              v-else-if="item.groupId == 'comMap'"
              src="@/assets/school/yxsz.png"
              alt
              class="w-full cursor hovers"
            >
              <div class="flex-between bg-white mb-10" style="height: 30px">
                <h3>机构位置</h3>
              </div>
              <div
                class="w-full bg-gray flex"
                style="border-radius: 9px; height: 43px"
              >
                <img src="@/assets/school/dw.png" alt style="width: 14px" />
                <span style="width: 70%; margin: 0 10px" class="nowrap">{{
                  address
                }}</span>
                <img src="@/assets/school/map.png" alt style="width: 30px" />
              </div>
            </div>

            <!-- 学院评价 -->
            <!-- <img v-else-if="item.groupId==9" src="@/assets/school/xypj.png" alt class="w-full mb-10" /> -->
          </div>
        </transition-group>
      </draggable>
    </div>
    <!-- 设置 -->
    <div class="setHome">
      <div class="w-full flex" style="margin-bottom: 15px">页面设置</div>
      <!-- 相册管理 -->
      <change-picture
        v-show="choose.isChangePicture"
        ref="isChangePicture"
        @update="updatePic"
      />
      <!-- 简介 -->
      <set-about v-show="choose.isSetAbout" ref="isSetAbout" />
      <!-- icon -->
      <set-nav v-show="choose.isSetNav" ref="isSetNav" @update="updateNav" />
      <!-- 轮播 -->
      <set-rotation
        v-show="choose.isSetRotation"
        ref="isSetRotation"
        @update="updateRo"
      />
      <!-- 课程 -->
      <set-course
        v-show="choose.isSetCourse"
        ref="isSetCourse"
        @update="updateCo"
        @upName="updateCoName"
      />
      <!-- 优秀画作 -->
      <set-paint
        v-show="choose.isSetPaint"
        ref="isSetPaint"
        @update="updatePa"
      />
      <!-- 机构视频 -->
      <set-video
        v-show="choose.isSetVideo"
        ref="isSetVideo"
        @update="updateVi"
      />
      <!-- 优秀教师 -->
      <set-teacher
        v-show="choose.isSetTeacher"
        ref="isSetTeacher"
        @update="updateTe"
      />
      <!-- 画室简介 -->
      <set-brief v-show="choose.isSetBrief" ref="isSetBrief" />
      <!-- 分享设置 -->
      <set-share v-show="choose.isSetShare" ref="isSetShare" />
    </div>

    <div class="chooseBal">
      <div class="balBox">
        <div
          v-for="(icon, t) in iconLists"
          :key="t"
          class="bal"
          @click="show(icon.part)"
        >
          <img :src="icon.src" alt style="width: 30px" />
          <span class="text-xs">{{ icon.name }}</span>
        </div>
      </div>
      <p class="text-xs" style="font-weight: 600; color: #5e5e5e">
        可以拖拽模块进行个性化排序,排好后请按保存
      </p>
      <el-button type="primary" class="w-full" @click="setData">保存</el-button>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import changePicture from "./components/changePicture";
import setAbout from "./components/setAbout";
import setNav from "./components/setNav";
import setRotation from "./components/setRotation";
import setCourse from "./components/setCourse";
import setPaint from "./components/setPaint";
import setVideo from "./components/setVideo";
import setTeacher from "./components/setTeacher";
import setShare from "./components/setShare";
import setBrief from "./components/setBrief";

export default {
  components: {
    changePicture,
    setAbout,
    setNav,
    setRotation,
    setCourse,
    draggable,
    setPaint,
    setVideo,
    setTeacher,
    setBrief,
    setShare,
  },
  data() {
    return {
      iconLists: [
        {
          src: require("@/assets/school/lb.png"),
          name: "轮播设置",
          part: "isSetRotation",
        },
        {
          src: require("@/assets/school/xc.png"),
          name: "相册设置",
          part: "isChangePicture",
        },
        {
          src: require("@/assets/school/lc.png"),
          name: "课程设置",
          part: "isSetCourse",
        },
        {
          src: require("@/assets/school/tw.png"),
          name: "图文导航",
          part: "isSetNav",
        },
        {
          src: require("@/assets/school/video.png"),
          name: "机构视频",
          part: "isSetVideo",
        },
        {
          src: require("@/assets/school/hz.png"),
          name: "优秀画作",
          part: "isSetPaint",
        },
        {
          src: require("@/assets/school/sz.png"),
          name: "优秀师资",
          part: "isSetTeacher",
        },
        {
          src: require("@/assets/school/detail.png"),
          name: "画室简介",
          part: "isSetBrief",
        },
        {
          src: require("@/assets/school/settingShare.png"),
          name: "分享设置",
          part: "isSetShare",
        },
      ],
      address: "",
      draggable: [
        {
          groupId: "comPhotos",
        },
        {
          groupId: "comDesc",
        },
        {
          groupId: "banner",
        },
        {
          groupId: "toobar",
        },
        {
          groupId: "course",
        },
        {
          groupId: "youXiouHuaZuo",
        },
        {
          groupId: "comVideo",
        },
        {
          groupId: "comTeacher",
        },
        {
          groupId: "comMap",
        },
        {
          groupId: "liveVideo",
        },
      ],
      choose: {
        isChangePicture: false,
        isSetAbout: false,
        isSetNav: false,
        isSetRotation: true,
        isSetCourse: false,
        isSetPaint: false,
        isSetVideo: false,
        isSetTeacher: false,
        isSetBrief: false,
        isSetShare: false,
      },
      photoNum: 0,
      school: {},
      swipeLists: [
        { url: require("@/assets/school/one.png"), title: "", description: "" },
        { url: require("@/assets/school/one.png"), title: "", description: "" },
      ],
      photoObj: {},
      greatPaints: {
        list: [],
        displayName: "",
      }, // 优秀画作
      comPhotos: {}, // 机构相册
      toobar: {}, // 导航按钮
      course: {
        displayName: "开设课程",
        list: [],
        num: "",
      }, // 课程
      comVideo: {
        list: [],
        displayName: "",
      }, // 机构视频
      comTeacher: {
        list: [],
        displayName: "",
      }, // 优秀教师
      school_id: "",
      objTool: {},
      headerUrl: "/img/mr.png",
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },

  created() {
    this.getInfo();
  },

  methods: {
    getNowebpImg(imgUrl) {
      let nowebpUrl = imgUrl;
      if (imgUrl && imgUrl.indexOf(".webp") != -1) {
        let array = imgUrl.split(".webp");
        if (array && array.length > 1) {
          nowebpUrl = array[0];
        }
      }
      return nowebpUrl;
    },
    setData() {
       if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.$axios
        .post("train/schoolWeb/changeOrderNumber2", this.draggable)
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.$message.success("个性化模块设置成功");
          }
        });
    },
    show(option) {
      if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      for (const key in this.choose) {
        this.choose[key] = false;
      }
      this.choose[option] = true;
      this.$refs[option].$emit("goEdit");
    },
    upToobar(index, name) {
      this.toobar[index].displayName = name;
      this.objTool.json = JSON.stringify(this.toobar);
      this.$axios
        .post("train/schoolWeb/update", this.objTool)
        .then((response) => {
          if (parseInt(response.code) !== 0) {
            this.$message.error(response.message);
          }
        });
    },
    getInfo() {
      this.$axios.post("train/schoolWeb/getSchoolInfo", {}).then((res) => {
        if (parseInt(res.code) === 0) {
          this.draggable = [];
          this.school = res.data.school;
          this.address =
            res.data.school.province +
            res.data.school.city +
            res.data.school.county +
            res.data.school.address; // 机构地址

          for (let t = 0; t < res.data.groups.length; t++) {
            const element = res.data.groups[t];
            this.draggable.push({ groupId: element.groupId });
            if (element.groupId === "banner") {
              this.swipeLists = JSON.parse(element.json);
            } else if (element.groupId === "toobar") {
              this.objTool = element;
              this.toobar = JSON.parse(element.json);
            } else if (element.groupId === "comPhoto") {
              if (element.json) {
                this.photoObj = JSON.parse(element.json);
                if (
                  this.photoObj.items &&
                  this.photoObj.items instanceof Array &&
                  this.photoObj.items.length > 0
                ) {
                  for (let x = 0; x < this.photoObj.items.length; x++) {
                    const list = this.photoObj.items[x];
                    this.photoNum += list.images ? list.images.length : 0;
                  }
                } else {
                  this.photoNum = 1;
                }
              }
            } else if (element.groupId === "course") {
              this.course.displayName = element.displayName;
              this.course.list = JSON.parse(element.json);
              for (let j = 0; j < this.course.list.length; j++) {
                const element2 = this.course.list[j];
                if (!element2.desc2) {
                  element2.desc2 = "";
                }
              }
            } else if (element.groupId === "youXiouHuaZuo") {
              this.greatPaints.displayName = element.displayName;
              this.greatPaints.list = JSON.parse(element.json);
            } else if (element.groupId === "comVideo") {
              this.comVideo.displayName = element.displayName;
              this.comVideo.list = JSON.parse(element.json);
            } else if (element.groupId === "comTeacher") {
              this.comTeacher.displayName = element.displayName;
              this.comTeacher.list = JSON.parse(element.json);
            }
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    updateRo(param) {
      this.swipeLists = param.list;
    },
    updateNav(param) {
      this.toobar = param;
    },
    updatePic(params) {
     

      this.photoNum = 0;
      if (params) {
        this.photoObj = params;
        if (this.photoObj.items && this.photoObj.items instanceof Array) {
          for (let x = 0; x < this.photoObj.items.length; x++) {
            const list = this.photoObj.items[x];
            this.photoNum += list.images ? list.images.length : 0;
          }
        } else {
          this.photoNum = 1;
        }
      }
    },
    updateCo(params) {
      if (parseInt(params.type) === 1) {
        // 删除
        this.course.list = params.lists;
      } else {
        this.course.list = params.course;
      }
    },
    updateCoName(params) {
      this.course.displayName = params.displayName;
      this.upToobar(0, params.displayName);
    },
    updatePa(params) {
      this.greatPaints = params;
      this.upToobar(2, params.displayName);
    },
    updateVi(params) {
      this.comVideo = params;
      this.upToobar(3, params.displayName);
    },
    updateTe(params) {
      this.comTeacher = params;
      this.upToobar(1, params.displayName);
    },
  },
};
</script>
<style scoped>
.school {
  height: calc(100vh - 84px);
  background: #f0f2f5;
  color: #1b1b1b;
  position: relative;
}
.chooseBal {
  width: 200px;
  height: calc(100vh - 84px);
  padding: 40px 20px;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
}
.balBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}
.bal {
  width: 80px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}
.text-xs {
  font-size: 12px;
}
.text-red {
  color: red;
}
.text-base {
  font-size: 18px;
}
.flex-col {
  flex-direction: column;
}
.relative {
  position: relative;
}
.w-full {
  width: 100%;
}
.cursor {
  cursor: pointer;
}
.flex-start {
  display: flex;
}
.h-auto {
  height: auto;
}
.text-bold {
  font-weight: bold;
}
.bg-gray {
  background: rgba(249, 249, 249, 1);
}
.bg-white {
  background: #fff;
}
.w-4 {
  width: 25%;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
}
.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.mb-20 {
  margin-bottom: 20px;
}
.home {
  width: 375px;
  height: calc(100vh - 84px);
  padding: 0 0 20px 0;
  background: #fff;
  margin: 0 auto;
  overflow-y: auto;
}
.px-20 {
  padding-left: 20px;
  padding-right: 20px;
}
.setHome {
  width: 300px;
  height: calc(100vh - 84px);
  padding: 10px;
  background: #fff;
  position: absolute;
  top: 0;
  right: 0;
  overflow: auto;
}
.home-block {
  width: 100%;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.img-icon {
  width: 27px;
}
.img-txt {
  margin: 0;
  font-size: 14px;
}
.py-20 {
  padding: 20px 0;
}
.pb-20 {
  padding-bottom: 12px;
}
.pb-10 {
  padding-bottom: 10px;
}
.mb-10 {
  margin-bottom: 10px;
}
.total {
  position: absolute;
  bottom: 8px;
  right: 14px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;
  color: #fff;
}
.total > img {
  width: 14px;
  margin-right: 5px;
}
.intro {
  height: 40px;
}
.nowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.moreWrap {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.home::-webkit-scrollbar {
  width: 0 !important;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.rounded-sm {
  height: 125px;
  border-radius: 8px;
}
.greatImg {
  margin-right: 8px;
}
.greatImg:nth-child(3n) {
  margin-right: 0;
}
.hovers:hover,
.chooseActive {
  border: 2px solid #2a75ed;
}
.hovers {
  padding: 10px 20px 5px 20px;
}
</style>
