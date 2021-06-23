<template>
  <!-- 展示区 -->
  <div class="school" v-loading="loading">
    <div class="home">
      <div class="flex-between px-20 mh-4" key="naviheader">
        <i class="el-icon-arrow-left" style="font-size: 18px"></i>
        <p>{{ schoolPageData.title }}</p>
        <img src="@/assets/school/sl.png" alt style="width: 24px" />
      </div>
      <draggable
        class="dragArea list-group"
        :list="schoolPageData.divs"
        :group="{
          name: 'people1',
          pull: 'clone',
          put: true,
          animation: 120,
        }"
        @change="log"
      >
        <transition-group type="transition" name="flip-list">
          <div
            class="item-contain"
            v-for="element in schoolPageData.divs"
            :key="element.type + '.' + element.id"
            :id="'' + element.id"
          >
            <!-- 轮播 -->
            <div
              :class="[
                'banner',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 1"
            >
              <el-carousel
                trigger="click"
                height="132px"
                indicator-position="none"
              >
                <el-carousel-item
                  v-for="list in element.divDatas"
                  :key="element.type + '.' + element.id + '.' + list.id"
                >
                  <img
                    :src="list.url"
                    alt="轮播"
                    style="height: 132px"
                    class="w-full rounded-sm of-co"
                  />
                </el-carousel-item>
                <div v-if="!element.divDatas || element.divDatas.length <= 0">
                  <img class="w-full h-705" src="/img/default.png" />
                </div>
              </el-carousel>
            </div>

            <!-- 图文导航icon -->
            <div
              :class="[
                'menus',
                'cursor',
                'noTopHovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 2"
            >
              <el-carousel
                trigger="click"
                height="60px"
                indicator-position="none"
                :interval="0"
              >
                <el-carousel-item
                  v-for="(list, index) in arrTrans(4, element.divDatas)"
                  :key="
                    element.type +
                    '.' +
                    element.id +
                    '.' +
                    index +
                    element.title
                  "
                >
                  <div class="navi-wrap">
                    <div
                      v-for="item in list"
                      :key="element.type + '.' + element.id + '.' + item.id"
                      class="item-wrap"
                    >
                      <img :src="item.url" alt class="h-2 w-2" />
                      <span class="text-025 text-color3B">{{
                        item.title
                      }}</span>
                    </div>
                    <div class="item-wrap" v-if="list.length < 3"></div>
                    <div class="item-wrap" v-if="list.length < 4"></div>
                  </div>
                </el-carousel-item>
                <el-carousel-item
                  v-if="!element.divDatas || element.divDatas.length <= 0"
                >
                  <img class="w-full h-4" src="/img/default.png" />
                </el-carousel-item>
              </el-carousel>
            </div>

            <!-- 富文本icon -->
            <div
              :class="[
                'eidter',
                'cursor',
                'hovers-205',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 3"
            >
              <div v-show="element.showTitle" class="editer-header">
                <img
                  v-show="element.showTitle"
                  src="@/assets/school/editHeader1.png"
                />
                <div class="editer-title">
                  <span class="txc-1b tx-04 tx-wb">{{ element.title }}</span>
                </div>
              </div>
              <div v-show="element.showTitle" class="editer-middle">
                <img
                  v-show="element.showTitle"
                  src="@/assets/school/editHeader2.png"
                />
              </div>
              <div v-show="element.showTitle" class="editer-bottom">
                <img
                  v-show="element.showTitle"
                  src="@/assets/school/editHeader3.png"
                />
              </div>

              <div class="editer-wrap">
                <div class="editer-contain">
                  <div v-html="element.detail" class="editer-content"></div>
                </div>
              </div>
            </div>

            <!-- 图文简介icon -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                element.contentStyle == 1 ? '' : 'textImage-nomargin',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 4"
            >
              <div class="flex row jc-sb ai-c h-2">
                <div>
                  <p v-show="element.showTitle == 1">{{ element.title }}</p>
                </div>

                <div>
                  <p v-show="element.showMore == 1" class="text-xs">
                    更多
                    <i class="el-icon-arrow-right"></i>
                  </p>
                </div>
              </div>
              <div
                :class="[
                  'textImage-content',
                  element.lineSize == 1 ? '' : 'textImage-row',
                ]"
              >
                <template v-for="(item, index) in element.divDatas">
                  <div
                    v-if="index >= element.pageSize"
                    :key="element.type + '.' + element.id + '.' + item.id"
                  ></div>
                  <div
                    v-else
                    :class="[
                      element.lineSize == 1
                        ? 'row1'
                        : element.lineSize == 2
                        ? 'row2'
                        : 'row3',
                    ]"
                    :key="element.type + '.' + element.id + '' + item.id"
                  >
                    <img
                      v-show="item.compatible == 1"
                      class="text-img"
                      :src="item.url"
                    />
                    <div class="flex column mb-02">
                      <span
                        class="tx-008 tx-wb txc-60 tx-nowrap txov-el ov-h"
                        >{{ item.title }}</span
                      >
                      <span class="tx-05 txc-60 ds-3 w-p100">{{
                        item.abbre
                      }}</span>
                    </div>
                  </div>
                </template>

                <div
                  class="row3"
                  v-if="
                    element.pageSize > element.divDatas.length
                      ? element.lineSize == 4 &&
                        element.divDatas.length % 3 == 2
                      : element.lineSize == 4 && element.pageSize % 3 == 2
                  "
                ></div>
                <template v-for="i in 3">
                  <div
                    v-if="!element.divDatas || element.divDatas.length <= 0"
                    :key="i"
                    :class="[
                      element.lineSize == 1
                        ? 'row1'
                        : element.lineSize == 2
                        ? 'row2'
                        : 'row3',
                    ]"
                  >
                    <img class="w-full h-705" src="/img/default.png" />
                    <div class="flex column mb-02">
                      <span class="tx-008 tx-wb txc-60 tx-nowrap txov-el ov-h"
                        >此处显示图文标题</span
                      >
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 优秀教师icon -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 5"
            >
              <div class="flex row jc-sb ai-c" v-show="element.showTitle == 1">
                <span style="width: 12rem" class="ta-l">{{
                  element.title
                }}</span>
                <span class="tx-05" v-show="element.showTitle == 1"
                  >查看更多</span
                >
              </div>
              <div class="flex row jc-sb" style="flex-wrap: wrap">
                <div
                  v-for="great in element.divDatas.slice(0, 6)"
                  :key="great.id"
                  class="flex column"
                  style="
                    width: 100px;
                    min-height: 140px;
                    align-items: flex-start;
                  "
                >
                  <img
                    :src="great.url ? getNowebpImg(great.url) : '/img/mr.png'"
                    alt
                    class="w-full"
                    style="height: 96px; object-fit: cover"
                  />

                  <div
                    class="text-bold"
                    style="line-height: 17px; font-size: 12px"
                  >
                    {{ great.title }}
                  </div>
                  <div
                    class="w-full moreWrap text-xs"
                    style="line-height: 17px"
                  >
                    {{ great.abbre }}
                  </div>
                </div>
                <div
                  style="
                    width: 100px;
                    min-height: 140px;
                    align-items: flex-start;
                  "
                  v-if="element.divDatas.slice(0, 6).length % 3 > 1"
                ></div>
                <div
                  style="
                    width: 100px;
                    min-height: 140px;
                    align-items: flex-start;
                  "
                  v-if="element.divDatas.slice(0, 6).length % 3 > 2"
                ></div>
              </div>
            </div>

            <!--分类导航icon -->
            <!--element 里的data是分类 ， data里item的data是商品 -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                'contain-center',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 6"
            >
              <div class="flex row jc-sb ai-c h-2">
                <div>
                  <p v-show="element.showTitle == 1">{{ element.title }}</p>
                </div>

                <!-- <div>
                  <p v-show="element.showMore == 1" class="text-xs">
                    更多
                    <i class="el-icon-arrow-right"></i>
                  </p>
                </div> -->
              </div>
              <van-tabs title-active-color="#2a75ed" color="#2a75ed">
                <van-tab
                  v-for="item in element.divDatas && element.divDatas.length > 0
                    ? element.divDatas
                    : [
                        { id: 1, title: '分类一', subDivData: [] },
                        { id: 2, title: '分类二', subDivData: [] },
                      ]"
                  :title="item.title"
                  :key="element.type + '.' + element.id + '.' + item.id"
                >
                  <div
                    :class="[
                      'catory-content',
                      element.listStyle == '1' ? '' : 'catory-row',
                    ]"
                  >
                    <template v-for="(product, index) in item.subDivData">
                      <div
                        v-if="element.pageSize > index ? true : false"
                        :class="[
                          element.listStyle == '1'
                            ? 'row1'
                            : element.listStyle == '2'
                            ? 'row2'
                            : element.listStyle == '3'
                            ? 'row3'
                            : 'row4',
                        ]"
                        :key="
                          element.type +
                          '.' +
                          element.id +
                          '.' +
                          item.id +
                          '.' +
                          product.id
                        "
                      >
                        <img
                          v-show="product.compatible == 1"
                          :src="product.url"
                        />
                        <div
                          :class="[
                            'title-contain',
                            product.compatible == 1 ? '' : 'wi-p100',
                          ]"
                        >
                          <span class="tx-008 tx-wb txc-60 ds-1 ta-l">{{
                            product.title
                          }}</span>
                          <span class="tx-05 txc-60 ds-2 ta-l">{{
                            product.abbre
                          }}</span>
                          <div class="w-full" v-show="product.isGoods == 1">
       
                            <div
                              v-show="product.saleModel == 1"
                              class="price-contain"
                            >
                              <div class="w-3"></div>
                              <span class="txc-red">{{
                                "￥" + product.price / 100.0
                              }}</span>
                            </div>
                            <div
                              v-show="product.saleModel == 2"
                              class="price-contain"
                            >
                              <div class="w-3"></div>
                              <span class="txc-red">免费</span>
                            </div>
                            <div
                              v-show="product.saleModel == 3"
                              class="price-contain"
                            >
                              <div class="w-3"></div>
                              <span class="txc-red">加密</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      v-if="
                        (element.pageSize >= item.subDivData.length
                          ? item.subDivData.length % 3 == 2
                          : element.pageSize % 3 == 2) &&
                        element.listStyle == '4'
                      "
                      :class="[
                        element.listStyle == '1'
                          ? 'row1'
                          : element.listStyle == '2'
                          ? 'row2'
                          : element.listStyle == '3'
                          ? 'row3'
                          : 'row4',
                      ]"
                    ></div>
                    <template v-for="i in 3">
                      <div
                        v-if="!item.subDivData || item.subDivData.length <= 0"
                        :key="i"
                        :class="[
                          element.listStyle == '1'
                            ? 'row1'
                            : element.listStyle == '2'
                            ? 'row2'
                            : element.listStyle == '3'
                            ? 'row3'
                            : 'row4',
                        ]"
                      >
                        <img class="w-full h-705" src="/img/default.png" />
                        <div :class="['title-contain', 'wi-p100']">
                          <span class="tx-008 tx-wb txc-60 ds-1 ta-l"
                            >此处显示商品名称</span
                          >
                        </div>
                      </div>
                    </template>
                  </div>
                  <div v-show="element.showMore == 1" class="mt-1">
                    <span class="text-xs">查看更多</span>
                  </div>
                  <!-- <div
                    v-show="
                      item.subDivData != null &&
                      item.subDivData.length > element.pageSize
                    "
                  >
                    <span class="text-xs">查看更多</span>
                  </div> -->
                </van-tab>
              </van-tabs>
            </div>

            <!-- 商品列表icon -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 7"
            >
              <div class="flex row jc-sb ai-c h-2">
                <div>
                  <p v-show="element.showTitle == 1">{{ element.title }}</p>
                </div>

                <div>
                  <p v-show="element.showMore == 1" class="text-xs">
                    更多
                    <i class="el-icon-arrow-right"></i>
                  </p>
                </div>
              </div>
              <div
                :class="[
                  'catory-content',
                  element.listStyle == '1' ? '' : 'catory-row',
                ]"
              >
                <template v-for="(product, index) in element.divDatas">
                  <div
                    v-if="index >= element.pageSize"
                    :key="element.type + '.' + element.id + '.' + product.id"
                  ></div>
                  <div
                    v-else
                    :class="[
                      element.listStyle == '1'
                        ? 'row1'
                        : element.listStyle == '2'
                        ? 'row2'
                        : element.listStyle == '3'
                        ? 'row3'
                        : 'row4',
                    ]"
                    :key="element.type + '.' + element.id + '.' + product.id"
                  >
                    <img
                      v-show="product.compatible == 1"
                      :src="product.url"
                    />
                    <div
                      :class="[
                        'title-contain',
                        product.compatible == 1 ? '' : 'wi-p100',
                      ]"
                    >
                      <span class="tx-008 tx-wb txc-60 ds-1 ta-l">{{
                        product.title
                      }}</span>
                      <span class="tx-05 txc-60 ds-2">{{ product.abbre }}</span>
                      <div class="w-full" v-show="product.isGoods == 1">
                        <div
                          v-show="product.saleModel == 1"
                          class="price-contain"
                        >
                          <div class="w-3"></div>
                          <span class="txc-red">{{
                            "￥" + product.price / 100.0
                          }}</span>
                        </div>
                        <div
                          v-show="product.saleModel == 2"
                          class="price-contain"
                        >
                          <div class="w-3"></div>
                          <span class="txc-red">免费</span>
                        </div>
                        <div
                          v-show="product.saleModel == 3"
                          class="price-contain"
                        >
                          <div class="w-3"></div>
                          <span class="txc-red">加密</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div
                  v-if="
                    element.divDatas &&
                    element.divDatas.length % 3 == 2 &&
                    element.listStyle == '4'
                  "
                  :class="[
                    element.listStyle == '1'
                      ? 'row1'
                      : element.listStyle == '2'
                      ? 'row2'
                      : element.listStyle == '3'
                      ? 'row3'
                      : 'row4',
                  ]"
                ></div>

                <template v-for="i in 3">
                  <div
                    v-if="!element.divDatas || element.divDatas.length <= 0"
                    :key="i"
                    :class="[
                      element.listStyle == '1'
                        ? 'row1'
                        : element.listStyle == '2'
                        ? 'row2'
                        : element.listStyle == '3'
                        ? 'row3'
                        : 'row4',
                    ]"
                  >
                    <img src="/img/default.png" />
                    <div :class="['title-contain', 'wi-p100']">
                      <span class="tx-008 tx-wb txc-60 ds-1 ta-l"
                        >此处显示商品名称</span
                      >
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 专栏icon -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 9"
            >
              <div class="flex row jc-sb ai-c" v-show="element.showTitle">
                <span>{{ element.name }}</span>
              </div>
              <div
                :class="[
                  'column-content',
                  element.isLargeImage == '1' ? '' : 'catory-row',
                ]"
              >
                <template v-for="product in element.data">
                  <div
                    :key="element.type + '.' + element.id + '.' + product.id"
                    class="column-item flex row"
                  >
                    <img class="w-8 h-6" :src="product.url" />
                    <div class="w-p100">
                      <div class="flex column ml-03">
                        <span>{{ product.title }}</span>
                        <span class="tx-05">{{ product.catory }}</span>
                      </div>
                      <div class="flex row w-p100 jc-sb">
                        <div></div>
                        <div class="attendButton">
                          <span>订阅</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 优惠券icon -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 10"
            ></div>

            <!-- 直播icon -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 11"
            ></div>
            <!-- 关注公众号icon -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 12"
            >
              <div class="account-content flex row jc-sb ai-c">
                <div class="flex row ai-c">
                  <div>
                    <el-avatar size="medium" :src="element.applets"></el-avatar>
                  </div>
                  <div class="flex column ml-03 w-10">
                    <span
                      class="tx-09 txw-b tx-nowrap ov-h txov-el"
                      style="line-height: 12px"
                      >{{ element.title }}</span
                    >
                    <span class="txc-3b tx-05 tx-nowrap ov-h txov-el">{{
                      element.guideWords
                    }}</span>
                  </div>
                </div>
                <div class="accountAttendButton">
                  <span>{{ element.buttonWords }}</span>
                </div>
              </div>
            </div>
            <!-- 关注小程序icon -->
            <div
              :class="[
                'item',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 13"
            >
              <span class="txc-3b tx-05 tx-nowrap ov-h txov-el"
                >小程序公众号</span
              >
              <div class="program-content flex row jc-sb ai-c">
                <div class="flex row ai-c">
                  <div>
                    <el-avatar
                      size="medium"
                      :src="element.coverImage"
                    ></el-avatar>
                  </div>
                  <div class="flex column ml-03 w-10">
                    <span
                      class="tx-09 txw-b tx-nowrap ov-h txov-el"
                      style="line-height: 12px"
                      >{{ element.accountName }}</span
                    >
                    <span class="txc-3b tx-05 tx-nowrap ov-h txov-el">{{
                      element.guideText
                    }}</span>
                  </div>
                </div>
                <div class="accountAttendButton">
                  <span>{{ element.buttonText }}</span>
                </div>
              </div>
            </div>
            <!-- 联系客服icon -->
            <div
              :class="[
                'customService',
                'cursor',
                'hovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 14"
            >
              <div class="customService-content">
                <img class="w-2 h-2" src="@/assets/school/service.png" />
              </div>
            </div>
            <!-- 机构地址 -->
            <div
              :class="[
                'item',
                'cursor',
                'noHovers',
                element.selected ? 'item-selected' : '',
              ]"
              @click="selected(element)"
              v-if="element.type == 15"
            >
              <div class="address">
                <div class="flex column jc-c h-6 plr-05">
                  <div class="flex row ai-c">
                    <img class="w-1 h-013" src="@/assets/school/addr3.png" />
                    <p class="txc-1b tx-09 ml-05 tx-wb lh-05">
                      {{ element.title }}
                    </p>
                  </div>
                  <div class="flex row ai-c jc-sb">
                    <p class="txc-1b tx-07 ds-1">
                      {{
                        element.province +
                        element.city +
                        element.area +
                        element.guideWords
                      }}
                    </p>
                    <img class="w-2 h-2" src="@/assets/school/addr2.png" />
                  </div>
                </div>
              </div>
            </div>
            <div
              :class="[element.type != 14 ? 'selected' : 'serviceSelected']"
              v-if="element.selected"
            >
              <div class="selected-wrap" @click="upAction(element)">
                <i class="el-icon-top"></i>
              </div>
              <div class="selected-wrap" @click="downAction(element)">
                <i class="el-icon-bottom"></i>
              </div>
              <div class="selected-wrap" @click="delAction(element)">
                <i class="el-icon-circle-close"></i>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <!-- 设置 -->
    <div class="setHome">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :label="false">页面设置</el-radio-button>
        <el-radio-button :label="true">组件设置</el-radio-button>
      </el-radio-group>
      <div v-show="!isCollapse && !expired">
        <div style="margin-bottom: 15px">页面设置</div>
        <el-input
          v-model="schoolPageData.title"
          placeholder="请输入标题"
        ></el-input>
      </div>
      <div v-show="isCollapse">
        <set-banner
          v-show="selectedObject.type == 1"
          ref="1"
          v-model="editerBanner"
        ></set-banner>
        <set-menu
          v-show="selectedObject.type == 2"
          v-model="editerMenu"
          ref="2"
        />
        <set-editer
          v-show="selectedObject.type == 3"
          v-model="editerObject"
          ref="3"
        ></set-editer>
        <set-text-image
          v-show="selectedObject.type == 4"
          ref="4"
          v-model="editerTextImage"
        ></set-text-image>
        <set-teacher
          v-show="selectedObject.type == 5"
          ref="5"
          v-model="editerTeacher"
        ></set-teacher>

        <set-catory
          v-show="selectedObject.type == 6"
          ref="6"
          v-model="editerCatory"
        ></set-catory>
        <set-product
          v-show="selectedObject.type == 7"
          ref="7"
          v-model="editerProduct"
        ></set-product>

        <set-share v-show="selectedObject.type == 8" ref="8"> </set-share>

        <set-column
          v-show="selectedObject.type == 9"
          ref="9"
          v-model="editerColumn"
        ></set-column>
        <set-account
          v-show="selectedObject.type == 12"
          ref="12"
          v-model="editerAccount"
        ></set-account>
        <set-program
          v-show="selectedObject.type == 13"
          ref="13"
          v-model="editerProgram"
        ></set-program>
        <set-custom-service
          v-show="selectedObject.type == 14"
          ref="14"
          v-model="editerCustomService"
        ></set-custom-service>
        <set-address
          v-show="selectedObject.type == 15"
          ref="15"
          v-model="editerAddress"
          @changeItem="changeItem"
        ></set-address>
      </div>
    </div>

    <div class="chooseBal">
      <div class="balBox">
        <el-collapse
          style="min-width: 13rem"
          v-model="activeNames"
          @change="handleChange"
          accordion
        >
          <template v-for="item in iconLists">
            <el-collapse-item
              :title="item.title"
              :name="item.title"
              :key="item.title"
            >
              <div class="bal-wrap">
                <div
                  v-for="(icon, t) in item.data"
                  :key="t"
                  @click="show(icon)"
                  class="bal"
                >
                  <img :src="icon.src" alt style="width: 30px" />
                  <p class="tx-008">{{ icon.name }}</p>
                </div>
              </div>
            </el-collapse-item>
          </template>
        </el-collapse>

        <div class="pd-025 w-p100">
          <p class="text-025" style="font-weight: 600; color: #2a75ed">
            {{ "H5到期时间:" + serverDateData.effectiveDate }}
          </p>
        </div>
        <div class="pd-025 w-p100" v-show="serverDateData.appletsEffectiveDate">
          <p class="text-025" style="font-weight: 600; color: #2a75ed">
            {{ "小程序到期时间:" + serverDateData.appletsEffectiveDate }}
          </p>
        </div>
        <div class="pd-025" v-show="currentSchoolType == '1'">
          <el-button type="primary" @click="changeAccount"
            >切换绑定账号</el-button
          >
        </div>
        <div class="pd-025">
          <el-button type="primary" @click="setData">保存历史主页</el-button>
        </div>
        <div class="pd-025">
          <el-button type="primary" @click="reViewData">预览</el-button>
          <el-button type="primary" @click="saveData">发布</el-button>
        </div>
      </div>
    </div>
    <ChangeLinkAccountDialog
      :visible.sync="visible"
      :isAdd="isChangeAccount"
      @addSuccess="addSuccess"
      @bindSuccess="bindSuccess"
    ></ChangeLinkAccountDialog>
    <QrCodeDialog
      :visible.sync="codeVisible"
      :editItem="codeItem"
      @addSuccess="addCodeSuccess"
    ></QrCodeDialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import $ from "jquery";
import SetEditer from "./components/setEditer.vue";
import SetBanner from "./components/setBanner.vue";
import SetMenu from "./components/setMenu.vue";
import SetTextImage from "./components/setTextImage.vue";
import SetTeacher from "./components/setNTeacher";
import SetShare from "./components/setNShare";
import ChangeLinkAccountDialog from "../components/changeLinkAccountDialog/index";
import SetCatory from "./components/setCatory";
import SetProduct from "./components/setProduct";
import SetColumn from "./components/setColumn";
import SetAccount from "./components/setAccount.vue";
import SetProgram from "./components/setProgram.vue";
import SetCustomService from "./components/setCustomService.vue";
import SetAddress from "./components/setAddress.vue";
import QrCodeDialog from "../components/qrCodeDialog";
import ResizeImg from "@/utils/tool.js";

export default {
  name: "clone",
  display: "Clone",
  order: 2,
  components: {
    draggable,
    SetEditer,
    SetBanner,
    SetMenu,
    SetTextImage,
    SetTeacher,
    SetShare,
    SetCatory,
    SetProduct,
    SetColumn,
    SetAccount,
    SetProgram,
    SetCustomService,
    ChangeLinkAccountDialog,
    QrCodeDialog,
    SetAddress,
  },
  data() {
    return {
      schoolPageData: {
        divs: [],
        title: "首页",
      },
      schoolId: "",
      activeNames: ["基础组件"],
      length: 0,
      visible: false,
      isChangeAccount: 0,
      swipeLists: [],
      editerBanner: { divDatas: [] },
      editerMenu: { divDatas: [] },
      editerObject: { divDatas: [], detail: "" },
      editerTextImage: { divDatas: [] },
      editerTeacher: { divDatas: [] },
      editerAddress: { divDatas: [], title: "", guideWords: "" },
      editerCatory: { divDatas: [] },
      editerProduct: { divDatas: [] },
      editerColumn: { divDatas: [] },
      editerAccount: { divDatas: [] },
      editerProgram: { divDatas: [] },
      editerCustomService: { divDatas: [] },
      selectedObject: {},
      isCollapse: false,
      currentSchoolType: "1",
      serverDateData: {
        appletsEffectiveDate: "",
        effectiveDate: "",
      },

      codeVisible: false,
      codeItem: {},

      loading: false,
      expired: false,

      iconLists: [
        {
          title: "基础组件",
          selected: false,
          data: [
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "轮播图", //标题
              type: 1, //// 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/lb.png"),
              name: "轮播图",
              refs: "isBanner",
            },
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "图文导航", //标题
              type: 2, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/xc.png"),
              name: "图文导航",
              refs: "isMenu",
            },
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "富文本", //标题
              type: 3, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/lc.png"),
              name: "富文本",
              refs: "isEditer",
            },
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 3, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "图文介绍", //标题
              type: 4, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/tw.png"),
              name: "图文介绍",
              refs: "isTextImage",
            },
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "优秀师资", //标题
              type: 5, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/sz.png"),
              name: "优秀师资",
              refs: "isSetTeacher",
            },
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              province: "",
              city: "",
              area: "",
              guideWords: "",
              title: "机构地址", //标题
              type: 15, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服 15机构地址
              src: require("@/assets/school/address.png"),
              name: "机构地址",
              refs: "isSetTeacher",
            },

            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 0, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "分享设置", //标题
              type: 8, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/settingShare.png"),
              name: "分享设置",
              refs: "isShare",
            },
          ],
        },
        {
          title: "商品组件",
          selected: false,
          data: [
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 10, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "分类导航", //标题
              type: 6, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/classify.png"),
              name: "分类导航",
              refs: "isCatory",
            },
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 10, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "商品列表", //标题
              type: 7, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/shopList.png"),
              name: "商品列表",
              refs: "isProduct",
            },
            {
              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "专栏", //标题
              type: 9, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/columns.png"),
              name: "专栏",
              refs: "isColumn",
            },
          ],
        },
        {
          title: "营销组件",
          selected: false,
          data: [
            {
              applets: "", //微信
              buttonWords: "", //按钮文案
              contact: "", //联系方式
              guideWords: "", //引导文案
              guideType: 1, //引导方式 1:弹窗引导,2:跳转链接

              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "优惠券", //标题
              type: 10, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/coupon.png"),
              name: "优惠券",
              refs: "isSetCoupon",
            },
          ],
        },
        {
          title: "直播组件",
          selected: false,
          data: [
            {
              applets: "", //微信
              buttonWords: "", //按钮文案
              contact: "", //联系方式
              guideWords: "", //引导文案
              guideType: 1, //引导方式 1:弹窗引导,2:跳转链接

              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "直播", //标题
              type: 11, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/video.png"),
              name: "直播",
              refs: "isLive",
            },
          ],
        },
        {
          title: "其他",
          selected: false,
          data: [
            {
              applets: "", //微信
              buttonWords: "关注", //按钮文案
              contact: "", //联系方式
              guideWords: "关注公众号", //引导文案
              guideType: 1, //引导方式 1:弹窗引导,2:跳转链接

              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [{ title: "", abbre: "", url: "" }],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "公众号名称", //标题
              type: 12, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/officialAccount.png"),
              name: "关注公众号",
              refs: "isAccount",
            },
            {
              applets: "", //微信
              buttonWords: "", //按钮文案
              contact: "", //联系方式
              guideWords: "", //引导文案
              guideType: 1, //引导方式 1:弹窗引导,2:跳转链接

              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "关注小程序", //标题
              type: 13, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/program.png"),
              name: "关注小程序",
              refs: "isProgram",

              part: "isChangePicture",
              data: [],
              accountName: "公众号名称", //公众号名称
              guideText: "关注公众号", //引导文案
              buttonText: "关注", //按钮文案
              coverImage:
                "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //公众号封面
            },
            {
              applets: "", //微信
              buttonWords: "", //按钮文案
              contact: "", //联系方式
              guideWords: "", //引导文案
              guideType: 1, //引导方式 1:弹窗引导,2:跳转链接

              contentStyle: 1, //内容样式 1:留边,2:填充
              detail: "", //详情(富文本)
              divDatas: [],
              lineSize: 1, //每行显示几张
              listStyle: 1, //列表样式 1:列表,2:小图,3:大图,4:九宫格
              pageSize: 1, //主页列表数据条数
              showTitle: 1, //是否展示标题 0:否,1:是
              showMore: 1,
              title: "", //标题
              type: 14, // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
              src: require("@/assets/school/service.png"),
              name: "联系客服",
              refs: "isCustomService",

              part: "isCustomService",
              data: [],
              contentType: "1", //弹窗引导  2 跳转链接
              phone: "", //电话
              isPhone: true,
              isWeiChat: true,
              weichatImg: "",
              tipText: "",
              url: "www.top.cn",
            },
          ],
        },
      ],
    };
  },
  created() {
    if (this.$route.query.id) {
      this.schoolId = this.$route.query.id;
    } else {
      this.schoolId = "";
    }
    this.currentSchoolType = localStorage.getItem("currentSchoolType");
    console.log("currentSchoolType" + this.currentSchoolType);
    if (this.currentSchoolType != "1") {
      let filterIcons = [];
      this.iconLists.forEach((iconObject) => {
        let icons = [];
        iconObject.data.forEach((icon) => {
          if (icon.type != 5) {
            icons.push(icon);
          }
        });
        filterIcons.push({ ...iconObject, data: icons });
      });
      this.iconLists = filterIcons;
    }

    this.getDetail();
    this.serverDate();
  },
  methods: {
    rzImageUlr: ResizeImg.rzImageUlr,
    arrTrans(num, arr) {
      // 一维数组转换为二维数组
      const iconsArr = []; // 声明数组
      arr.forEach((item, index) => {
        const page = Math.floor(index / num); // 计算该元素为第几个素组内
        if (!iconsArr[page]) {
          // 判断是否存在
          iconsArr[page] = [];
        }
        iconsArr[page].push(item);
      });
      return iconsArr;
    },

    changeItem(item) {
      this.editerAddress = item;
      let pagesData = [];
      this.schoolPageData.divs.forEach((element) => {
        if (element.type == 15) {
          pagesData.push(this.editerAddress);
        } else {
          pagesData.push(element);
        }
      });
      this.schoolPageData.divs = pagesData;
    },

    selected(item) {
      if (this.expired) {
        this.isCollapse = false;
        (this.selectedObject = {}),
          this.$message.info("该网校已经过期，请系统商品菜单中购买服务！");
        return;
      }
      if (!item) {
        return;
      }
      this.selectedObject = item;
      (this.isCollapse = true),
        this.schoolPageData.divs.forEach((element) => {
          if (element.id == item.id) {
            element.selected = true;
          } else {
            element.selected = false;
          }
        });
      if (item.type == 1) {
        //选中BANNER
        this.editerBanner = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 2) {
        //选中图文导航
        this.editerMenu = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 3) {
        //选中富文本
        this.editerObject = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 4) {
        //选中图文
        this.editerTextImage = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 5) {
        //优秀师资
        this.editerTeacher = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 6) {
        //分类导航
        this.editerCatory = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 7) {
        //商品列表
        this.editerProduct = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 8) {
        //分享

        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 9) {
        //专栏
        this.editerColumn = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 12) {
        //公众号
        this.editerAccount = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 13) {
        //小程序
        this.editerProgram = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 14) {
        //客服
        this.editerCustomService = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
      if (item.type == 15) {
        //地址
        this.editerAddress = item;
        this.$refs[item.type + ""].$emit("goEdit");
      }
    },
    upAction(item) {
      this.swapArray(
        this.schoolPageData.divs,
        $.inArray(item, this.schoolPageData.divs),
        $.inArray(item, this.schoolPageData.divs) - 1
      );
    },
    downAction(item) {
      this.swapArray(
        this.schoolPageData.divs,
        $.inArray(item, this.schoolPageData.divs),
        $.inArray(item, this.schoolPageData.divs) + 1
      );
    },
    addCodeSuccess() {
      this.codeVisible = false;
    },
    delAction(item) {
      this.selectedObject.type = 1000;

      this.schoolPageData.divs.splice(
        $.inArray(item, this.schoolPageData.divs),
        1
      );
      this.isCollapse = false;
    },

    //富文本内容监听
    editerInput(desc) {
      this.editerObject.detail = desc;
    },
    //数组元素互换位置
    swapArray(arr, index1, index2) {
      if (index2 < 0 || index2 >= arr.length) {
        return;
      }
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },

    clone(item) {
      return { ...item, selected: false };
    },

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
    show(element) {
      //       contentStyle	integer($int32)
      // 内容样式 1:留边,2:填充

      // detail	string
      // 详情(富文本)

      // divDatas	[...]
      // lineSize	integer($int32)
      // 每行显示几张

      // listStyle	integer($int32)
      // 列表样式 1:列表,2:小图,3:九宫格

      // pageSize	integer($int32)
      // 主页列表数据条数

      // showTitle	integer($int32)
      // 是否展示标题 0:否,1:是

      // title	string
      // 标题

      // type	integer($int32)
      // 组件类型 1:轮播图就,2:图文导航,3:富文本,4:图文介绍,5:优秀师资,6:分类导航,7:商品列表 8分享 9专栏 10优惠券 11直播 12关注公众号 13关注小程序 14联系客服
      if (this.expired) {
        this.isCollapse = false;
        (this.selectedObject = {}),
          this.$message.info("该网校已经过期，请系统商品菜单中购买服务！");
        return;
      }
      let isHasTeacher = false;
      if (element.type == 5) {
        this.schoolPageData.divs.forEach((teacher) => {
          if (teacher.type == 5) {
            isHasTeacher = true;
          }
        });
        if (isHasTeacher) {
          this.$message.error("优秀师资最多只能添加一栏！页面中已存在优秀师资");
          return;
        }
      }
      if (element.type == 14) {
        this.schoolPageData.divs.forEach((data) => {
          if (data.type == 14) {
            isHasTeacher = true;
          }
        });
        if (isHasTeacher) {
          this.$message.error("页面中已存在联系客服，联系客服只允许添加一次");
          return;
        }
      }
      if (element.type == 15) {
        this.schoolPageData.divs.forEach((data) => {
          if (data.type == 15) {
            isHasTeacher = true;
          }
        });
        if (isHasTeacher) {
          this.$message.error("页面中已存在地址，地址只允许添加一次");
          return;
        }
      }
      if (element.type == 9 || element.type == 10 || element.type == 11) {
        //选中优惠券和直播
        this.$message.error("该功暂未开放，请联系客服");

        return;
      }
      this.length++;
      let obj = {};

      if ([element.divDatas instanceof Array]) {
        obj = {
          ...element,
          id: this.length,
          tag: this.length,
          selected: false,
          divDatas: new Array(...element.divDatas),
        };
      } else {
        obj = {
          ...element,
          id: this.length,
          tag: this.length,
          selected: false,
        };
      }

      let reObj = JSON.parse(JSON.stringify(obj));

      if (element.type != 8) {
        //分享设置
        this.schoolPageData.divs.push(reObj);

        this.$nextTick(() => {
          document.getElementById("" + reObj.id).scrollIntoView();
        });
      }
      let objects = [];
      let serviceObj = null;
      this.schoolPageData.divs.forEach((object, index) => {
        if (object.type != 14) {
          //联系客服
          objects.push(object);
        } else {
          serviceObj = object;
        }
      });
      if (serviceObj != null) {
        objects.push(serviceObj);
      }
      this.schoolPageData.divs = objects;

      this.selected(reObj);
    },

    changeAccount() {
      this.visible = true;
    },
    addSuccess() {
      this.visible = false;
      this.schoolId = null;
      this.getDetail();
      this.serverDate();
    },
    bindSuccess() {
      this.visible = false;
      this.serverDate();
    },
    setData() {
      if (this.expired) {
        this.isCollapse = false;
        (this.selectedObject = {}),
          this.$message.info("该网校已经过期，请系统商品菜单中购买服务！");
        return;
      }
      let isData = true;
      let noDataObject = null;
      if (!this.schoolPageData.title) {
        this.isCollapse = false;
        this.$message.error("页面标题不能为空");
        return;
      }
      if (!this.schoolPageData.divs || this.schoolPageData.divs.length <= 0) {
        isData = false;
        this.$message.error("模块数据不能为空");
        return;
      }
      this.schoolPageData.divs.forEach((data) => {
        data.selected = false;
        if (data.type == 3) {
          if (!data.detail) {
            isData = false;
            noDataObject = data;
          }
        } else {
          if (data.type == 14) {
            if (data.guideType == 1) {
              if (!data.contact || !data.applets) {
                isData = false;
                noDataObject = data;
              }
            } else {
              if (!data.jumpDetail) {
                isData = false;
                noDataObject = data;
              }
            }
          } else {
            if (
              data.type == 15 ||
              (data.divDatas && data.divDatas.length > 0)
            ) {
            } else {
              isData = false;
              noDataObject = data;
            }
          }
        }

        let isHaveProducts = this.isHaveSubProduct(data);
        if (!isHaveProducts) {
          noDataObject = data;
          isData = false;
        }
      });
      if (!isData) {
        this.selected(noDataObject);
        if (noDataObject.type != 8) {
          //分享设置
          this.$nextTick(() => {
            document.getElementById("" + noDataObject.id).scrollIntoView();
          });
        }
        this.$message.error("模块数据不能为空");
        return;
      }
      this.create(false);
    },
    reViewData() {
      if (this.expired) {
        this.isCollapse = false;
        (this.selectedObject = {}),
          this.$message.info("该网校已经过期，请系统商品菜单中购买服务！");
        return;
      }
      let isData = true;
      let noDataObject = null;
      if (!this.schoolPageData.title) {
        this.isCollapse = false;
        this.$message.error("页面标题不能为空");
        return;
      }
      if (!this.schoolPageData.divs || this.schoolPageData.divs.length <= 0) {
        isData = false;
        this.$message.error("模块数据不能为空");
        return;
      }
      this.schoolPageData.divs.forEach((data) => {
        data.selected = false;
        if (data.type == 3) {
          if (!data.detail) {
            noDataObject = data;
            isData = false;
          }
        } else {
          if (data.type == 14) {
            if (data.guideType == 1) {
              if (!data.contact || !data.applets) {
                noDataObject = data;
                isData = false;
              }
            } else {
              if (!data.jumpDetail) {
                noDataObject = data;
                isData = false;
              }
            }
          } else {
            if (
              data.type == 15 ||
              (data.divDatas && data.divDatas.length > 0)
            ) {
            } else {
              noDataObject = data;
              isData = false;
            }
          }
        }

        let isHaveProducts = this.isHaveSubProduct(data);
        if (!isHaveProducts) {
          noDataObject = data;
          isData = false;
        }
      });
      if (!isData) {
        this.selected(noDataObject);
        if (noDataObject.type != 8) {
          //分享设置
          this.$nextTick(() => {
            document.getElementById("" + noDataObject.id).scrollIntoView();
          });
        }
        this.$message.error("模块数据不能为空");
        return;
      }
      let params = { ...this.schoolPageData, enable: 0 };
      this.loading = true;
      this.$axios
        .post(this.API.newNetSchool.schoolPage.create, params)
        .then((res) => {
          if (res) {
            this.codeItem = res;
            this.codeVisible = true;
            if (!this.schoolPageData.id) {
              this.getDetail();
            }
          }
          this.loading = false;
        });
    },
    saveData() {
      if (this.expired) {
        this.isCollapse = false;
        (this.selectedObject = {}),
          this.$message.info("该网校已经过期，请系统商品菜单中购买服务！");
        return;
      }
      let isData = true;
      let noDataObject = null;
      if (!this.schoolPageData.title) {
        this.isCollapse = false;
        this.$message.error("页面标题不能为空");
        return;
      }
      if (!this.schoolPageData.divs || this.schoolPageData.divs.length <= 0) {
        isData = false;
        this.$message.error("模块数据不能为空");
        return;
      }
      this.schoolPageData.divs.forEach((data) => {
        data.selected = false;
        if (data.type == 3) {
          if (!data.detail) {
            noDataObject = data;
            isData = false;
          }
        } else {
          if (data.type == 14) {
            if (data.guideType == 1) {
              if (!data.contact || !data.applets) {
                noDataObject = data;
                isData = false;
              }
            } else {
              if (!data.jumpDetail) {
                noDataObject = data;
                isData = false;
              }
            }
          } else {
            if (
              data.type == 15 ||
              (data.divDatas && data.divDatas.length > 0)
            ) {
            } else {
              noDataObject = data;
              isData = false;
            }
          }
        }

        let isHaveProducts = this.isHaveSubProduct(data);
        if (!isHaveProducts) {
          noDataObject = data;
          isData = false;
        }
      });
      if (!isData) {
        this.selected(noDataObject);
        if (noDataObject.type != 8) {
          //分享设置
          this.$nextTick(() => {
            document.getElementById("" + noDataObject.id).scrollIntoView();
          });
        }
        this.$message.error("模块数据不能为空");
        return;
      }
      this.create(true);
    },
    log: function (evt) {},
    handleChange(val) {},

    isHaveSubProduct(data) {
      let isHaveProduct = true;
      if (data.type == 1 || data.type == 2 || data.type == 4) {
        data.divDatas.forEach((item) => {
          // if (item.subDivData && item.subDivData.length > 0) {
          // } else {
          //   isHaveProduct = false;
          // }
          if (item.jumpType == 2) {
            if (!item.jumpDetail) {
              isHaveProduct = false;
            }
          } else {
            if (item.dataId) {
            } else {
              isHaveProduct = false;
            }
          }
        });
      }
      return isHaveProduct;
    },

    //api
    create(enable) {
      let params = { ...this.schoolPageData };
      if (enable) {
        params = { ...this.schoolPageData, enable: 1 };
      } else {
        params = { ...this.schoolPageData, id: null };
      }
      this.loading = true;
      this.$axios
        .post(this.API.newNetSchool.schoolPage.create, params)
        .then((res) => {
          this.loading = false;
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
            if (enable) {
              this.codeItem = res;
              this.codeVisible = true;
            }
          }
        });
    },

    getDetail() {
      let url = this.API.newNetSchool.schoolPage.detail;
      if (this.schoolId) {
        url = this.API.newNetSchool.schoolPage.detail + "?id=" + this.schoolId;
      }
      this.$axios.get(url).then((res) => {
        if (res) {
          this.isCollapse = false;
          this.selectedObject = {};
          if (res.data) {
            let data = { ...res.data };
            let divs = [];
            res.data.divs.forEach((item, index) => {
              divs.push({ ...item, selected: false, tag: index });
            });
            data.divs = divs;
            this.schoolPageData = data;
          } else {
            this.schoolPageData = {
              divs: [],
              title: "",
            };
          }
        }
      });
    },

    serverDate() {
      this.$axios
        .get(this.API.newNetSchool.schoolPage.serverDate)
        .then((res) => {
          if (res) {
            if (res.code == 0) {
              this.serverDateData = res.data;
              if (res.data.expire) {
                this.expired = true;
              } else {
                this.expired = false;
              }
            }
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.school {
  height: calc(100vh - 50px);
  background: #f0f2f5;
  color: #1b1b1b;
  position: relative;
}
.chooseBal {
  width: 15rem;
  height: calc(100vh - 50px);
  padding: 40px 20px;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
  .draghovers:hover {
    background-color: #2a75ed;
  }
  .balBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    .bal-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}

// .chooseBal::-webkit-scrollbar {
//     display: none;
// }

.home {
  width: 400px;
  height: calc(100vh - 84px);
  //padding: 0 0 20px 0;
  padding: 40px 0 20px 0;
  //background: #edeff2;
  margin: 0 auto;
  overflow-y: auto;

  .px-20 {
    padding-left: 20px;
    padding-right: 20px;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    background: #fff;
  }

  .item-contain {
    width: 400px;
    display: flex;
    flex-direction: row;
    position: relative;
    .selected {
      width: 2rem;
      height: 5.5rem;
      position: absolute;
      display: flex;
      background-color: #fbfbfb;

      flex-direction: column;
      align-items: center;
      left: 90%;
      z-index: 999;
      .selected-wrap {
        padding: 0.01rem 0.4rem 0.001rem 0.4rem;
      }
    }
    .serviceSelected {
      width: 2rem;
      height: 5.5rem;
      position: absolute;
      display: flex;
      top: -60px;
      background-color: #fbfbfb;

      flex-direction: column;
      align-items: center;
      left: 90%;
      z-index: 999;
      .selected-wrap {
        padding: 0.01rem 0.4rem 0.001rem 0.4rem;
      }
    }

    .eidter {
      width: 90%;
      background-color: #f9faf9;
      margin-top: 0.3rem;

      .editer-wrap {
        padding: 0px 10px 0px 10px;
        margin-top: -32px;
        position: relative;
      }
      .editer-contain {
        background-color: #fff;
        padding: 2px 15px 20px 15px;
        border-radius: 5px;
        box-shadow: 2px 2px 5px #e6e6e6;
      }
      .editer-middle {
        width: 100%;
        padding-top: 10px;
        img {
          width: 100%;
        }
      }
      .editer-bottom {
        width: 100%;
        margin-top: -10px;
        img {
          width: 100%;
        }
      }

      .editer-header {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: yellow;
        .editer-title {
          position: absolute;
        }

        img {
          width: 100%;
          position: absolute;
        }
      }
      .editer-content {
        width: 100%;
        min-height: 2rem;
        ::v-deep {
          img {
            width: 100%;
          }
          ul {
            padding-left: 0.8rem;
            padding-top: 0.5rem;
            list-style: disc;
            list-style-type: disc;
          }
          ol {
            padding-left: 0.8rem;
            padding-top: 0.5rem;
            list-style: decimal;
            list-style-type: decimal;
          }
          p {
            width: 100%;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            line-height: 1.4rem;
            font-size: 0.7rem;
          }
          span {
            width: 100%;
          }
        }
        .img-content {
          min-height: 2rem;
        }
      }
    }
    .banner {
      width: 90%;
      background-color: #f9faf9;
    }
    .menus {
      width: 90%;
      background-color: #f9faf9;
    }
    .item {
      width: 90%;
      background-color: #f9faf9;
      margin-top: 0.3rem;

      .textImage-content {
        width: 100%;
        min-height: 5rem;
        .row1 {
          width: 100%;
          img {
            width: 100%;
            height: 12rem;
            object-fit: cover;
          }
        }
        .row2 {
          width: 48%;
          img {
            width: 100%;
            object-fit: cover;
            height: 8rem;
          }
        }
        .row3 {
          width: 30%;
          img {
            width: 100%;
            height: 6rem;
            object-fit: cover;
          }
        }
      }
      .catory-content {
        width: 100%;
        min-height: 2rem;
        .row1 {
          width: 100%;
          display: flex;
          flex-direction: row;
          object-fit: cover;
          padding: 0.8rem 0 0 0;
          .title-contain {
            margin-left: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            overflow: hidden;
            width: 70%;
            .price-contain {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              width: 100%;
            }
          }

          img {
            width: 6rem;
            height: 5rem;
            object-fit: cover;
          }
        }
        .row2 {
          width: 48%;
          padding: 0.8rem 0 0 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          .title-contain {
            margin-left: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            .price-contain {
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }
          }

          img {
            width: 100%;
            height: 8rem;
            object-fit: cover;
          }
        }
        .row4 {
          width: 30%;
          padding: 0.8rem 0 0 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          .title-contain {
            margin-left: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            .price-contain {
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }
          }

          img {
            width: 100%;
            height: 6rem;
            object-fit: cover;
          }
        }
        .row3 {
          width: 100%;
          padding: 0.8rem 0 0 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          .title-contain {
            margin-left: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            .price-contain {
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }
          }

          img {
            width: 100%;
            height: 12rem;
            object-fit: cover;
          }
        }
      }

      .column-content {
        width: 100%;
        min-height: 2rem;
        .column-item {
          width: 100%;
          min-height: 2rem;
          padding: 1rem 0 0.5rem 0;
        }
      }
      .account-content {
        width: 100%;
        min-height: 2rem;
      }
      .program-content {
        width: 100%;
        min-height: 2rem;
      }

      .address {
        width: 100%;
        height: 6rem;
        background-size: 100% 6rem;
        padding-left: 1rem;
        padding-right: 1rem;
        background-image: url("/img/addr_bg.png");
        background-repeat: no-repeat;
      }
    }
    .item-selected {
      border: 2px solid #2a75ed;
    }
    .hovers:hover,
    .chooseActive {
      border: 2px solid #2a75ed;
    }
    .hovers {
      padding: 10px 20px 5px 20px;
    }

    .hovers-205 {
      padding: 2.5rem 20px 15px 20px;
    }

    .noLeftHovers {
      padding: 0px 20px 0px 0px;
    }

    .noTopHovers {
      padding: 0px 20px 0px 20px;
    }
    .noHovers {
      padding: 0px 0px 0px 0px;
    }
  }
}

.customService {
  background-color: #ffffff;
  position: absolute;
  right: 45px;
  bottom: 10px;
  z-index: 777;
  .customService-content {
    width: 100%;
    min-height: 2rem;
  }
}
.catory-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}
.textImage-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.textImage-nomargin {
  padding: 0px 0px 5px 0px !important;
}
.setHome {
  width: 400px;
  height: calc(100vh - 10px);
  padding: 10px;
  background: #fff;
  position: absolute;
  text-align: center;

  top: 0;
  right: 0;
  overflow: auto;
  padding: 4rem 2rem 3rem 2rem;
}

.home::-webkit-scrollbar {
  width: 0 !important;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.cursor {
  cursor: pointer;
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

.navi-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow-x: hidden;
  white-space: nowrap;
  min-height: 3rem;
}
.item-wrap {
  height: 4rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.3rem;
  padding: 0.3rem 0 0.3rem 0;
}

.attendButton {
  padding: 0.1rem 1rem 0.1rem 1rem;
  border-radius: 1.2rem;
  border: #fff 0px solid;
  background-color: #26a726;
  span {
    color: #fff;
    font-size: 0.9rem;
  }
}
.accountAttendButton {
  padding: 0.1rem 1rem 0.1rem 1rem;
  border-radius: 1.2rem;
  border: #26a726 1px solid;
  span {
    color: #3b3b3b;
    font-size: 0.9rem;
  }
}

.navi-wrap::-webkit-scrollbar {
  width: 0 !important;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
.w-full {
  width: 100%;
}

.mh-2 {
  min-height: 2rem;
}
.mh-3 {
  min-height: 3rem;
}
.mh-4 {
  min-height: 3.5rem;
}

.text-color3B {
  color: #3b3b3b;
}
.text-025 {
  font-size: 0.25rem;
}
.pd-025 {
  padding: 0.25rem;
}
.text-center {
  text-align: center;
}
.text-bold {
  font-weight: bold;
}
.text-xs {
  font-size: 12px;
}
.moreWrap {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.contain-center {
  text-align: center;
}
::v-deep .van-tabs__wrap--scrollable .van-tab {
  padding: 0 12px 0 0;
}
::v-deep .van-tabs__nav--complete {
  padding-left: 0px;
}
::v-deep .van-tabs__line {
  left: 0px;
}
::v-deep .van-tabs__nav {
  background-color: #f9faf9;
}
</style>


