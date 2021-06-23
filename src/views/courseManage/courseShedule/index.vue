<template>
  <section class="courseForm_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-col :span="5">
          <el-select
            v-model="search.class"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索班级"
            :remote-method="searchClass"
            :loading="loading"
            @change="changeClass"
            value-key="id"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.className"
              :value="item"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="search.month"
            type="month"
            value-format="yyyy-MM-dd"
            placeholder="选择月"
            @change="change"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="onSubmit">开始排课</el-button>
        </el-col>
      </el-form>
    </div>
    <!--列表 第一周-->
    <el-table
      :data="weekDays"
      v-if="isWeekEdit > 0 && isReadyShe ? true : false"
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#08223c',
        border: 'none',
      }"
    >
      <el-table-column
        label="课时"
        header-align="center"
        align="center"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-time-picker
            v-model="weekDays[scope.$index]['courseStartTime']"
            placeholder="开始时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <span>至</span>
          <el-time-picker
            v-model="weekDays[scope.$index]['courseEndTime']"
            placeholder="结束时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <!-- <el-time-picker
            is-range
            size="mini"
            v-model="weekDays[scope.$index]['courseTime']"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            style="width: 140px"
            :clearable="false"
          >
          </el-time-picker> -->
          <el-button
            type="primary"
            size="mini"
            class="classButton"
            v-if="scope.$index === weekDays.length - 1"
            @click="addCourse(0, {}, new Date(), getAfterHourTime())"
            >增加课时</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in weekHeaderData"
        header-align="center"
        align="center"
        :key="index"
        :width="item.width"
        :render-header="renderHeader"
        :label="item.week + ' ' + item.date"
      >
        <template slot-scope="scope">
          <div>
            <div
              v-if="isHasEdit(scope.row, item.props)"
              @click="editItem(scope.row, item.props, scope.$index, 0)"
            >
              <div>{{ getCourseName(scope.row, item.props) }}</div>
              <div>
                {{ getCourseTeacherName(scope.row, item.props) }}
              </div>
              <div>{{ getCourseTime(scope.row, item.props) }}</div>
              <div class="item-icon">
                <i class="el-icon-edit"></i>
              </div>
              <div
                class="item-icon-close"
                @click="deleteItem(scope.row, item.props, scope.$index, 0)"
                @click.stop="stopProp"
              >
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div
              v-else
              @click="addItem(scope.row, item.props, scope.$index, 0)"
            >
              <i class="el-icon-edit"></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 第二周-->
    <el-table
      :data="weekDays1"
      v-if="isWeekEdit > 1 && isReadyShe ? true : false"
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#08223c',
        border: 'none',
      }"
    >
      <el-table-column
        label="课时"
        header-align="center"
        align="center"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-time-picker
            v-model="weekDays1[scope.$index]['courseStartTime']"
            placeholder="开始时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <span>至</span>
          <el-time-picker
            v-model="weekDays1[scope.$index]['courseEndTime']"
            placeholder="结束时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <!-- <el-time-picker
            is-range
            size="mini"
            v-model="weekDays1[scope.$index]['courseTime']"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            style="width: 140px"
            :clearable="false"
          >
          </el-time-picker> -->
          <el-button
            type="primary"
            size="mini"
            class="classButton"
            v-if="scope.$index === weekDays1.length - 1"
            @click="addCourse(1, {}, new Date(), getAfterHourTime())"
            >增加课时</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in weekHeaderData1"
        header-align="center"
        align="center"
        :key="index"
        :width="item.width"
        :render-header="renderHeader"
        :label="item.week + ' ' + item.date"
      >
        <template slot-scope="scope">
          <div>
            <div
              v-if="isHasEdit(scope.row, item.props)"
              @click="editItem(scope.row, item.props, scope.$index, 1)"
            >
              <div>{{ getCourseName(scope.row, item.props) }}</div>
              <div>
                {{ getCourseTeacherName(scope.row, item.props) }}
              </div>
              <div>{{ getCourseTime(scope.row, item.props) }}</div>
              <div class="item-icon">
                <i class="el-icon-edit"></i>
              </div>
              <div
                class="item-icon-close"
                @click="deleteItem(scope.row, item.props, scope.$index, 0)"
                @click.stop="stopProp"
              >
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div
              v-else
              @click="addItem(scope.row, item.props, scope.$index, 1)"
            >
              <i class="el-icon-edit"></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 第三周-->
    <el-table
      :data="weekDays2"
      v-if="
        isWeekEdit > 2 && isReadyShe && isInMonth(weekHeaderData2[0]['date'])
          ? true
          : false
      "
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#08223c',
        border: 'none',
      }"
    >
      <el-table-column
        label="课时"
        header-align="center"
        align="center"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-time-picker
            v-model="weekDays2[scope.$index]['courseStartTime']"
            placeholder="开始时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <span>至</span>
          <el-time-picker
            v-model="weekDays2[scope.$index]['courseEndTime']"
            placeholder="结束时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <!-- <el-time-picker
            is-range
            size="mini"
            v-model="weekDays2[scope.$index]['courseTime']"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            style="width: 140px"
            :clearable="false"
          >
          </el-time-picker> -->
          <el-button
            type="primary"
            size="mini"
            class="classButton"
            v-if="scope.$index === weekDays2.length - 1"
            @click="addCourse(2, {}, new Date(), getAfterHourTime())"
            >增加课时</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in weekHeaderData2"
        header-align="center"
        align="center"
        :key="index"
        :width="item.width"
        :render-header="renderHeader"
        :label="item.week + ' ' + item.date"
      >
        <template slot-scope="scope">
          <div>
            <div
              v-if="isHasEdit(scope.row, item.props)"
              @click="editItem(scope.row, item.props, scope.$index, 2)"
            >
              <div>{{ getCourseName(scope.row, item.props) }}</div>
              <div>
                {{ getCourseTeacherName(scope.row, item.props) }}
              </div>
              <div>{{ getCourseTime(scope.row, item.props) }}</div>
              <div class="item-icon">
                <i class="el-icon-edit"></i>
              </div>
              <div
                class="item-icon-close"
                @click="deleteItem(scope.row, item.props, scope.$index, 0)"
                @click.stop="stopProp"
              >
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div
              v-else
              @click="addItem(scope.row, item.props, scope.$index, 2)"
            >
              <i class="el-icon-edit"></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 第四周-->
    <el-table
      :data="weekDays3"
      v-if="
        isWeekEdit > 3 && isReadyShe && isInMonth(weekHeaderData3[0]['date'])
          ? true
          : false
      "
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#08223c',
        border: 'none',
      }"
    >
      <el-table-column
        label="课时"
        header-align="center"
        align="center"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-time-picker
            v-model="weekDays3[scope.$index]['courseStartTime']"
            placeholder="开始时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <span>至</span>
          <el-time-picker
            v-model="weekDays3[scope.$index]['courseEndTime']"
            placeholder="结束时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <!-- <el-time-picker
            is-range
            size="mini"
            v-model="weekDays3[scope.$index]['courseTime']"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            style="width: 140px"
            :clearable="false"
          >
          </el-time-picker> -->
          <el-button
            type="primary"
            size="mini"
            class="classButton"
            v-if="scope.$index === weekDays3.length - 1"
            @click="addCourse(3, {}, new Date(), getAfterHourTime())"
            >增加课时</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in weekHeaderData3"
        header-align="center"
        align="center"
        :key="index"
        :width="item.width"
        :render-header="renderHeader"
        :label="item.week + ' ' + item.date"
      >
        <template slot-scope="scope">
          <div>
            <div
              v-if="isHasEdit(scope.row, item.props)"
              @click="editItem(scope.row, item.props, scope.$index, 3)"
            >
              <div>{{ getCourseName(scope.row, item.props) }}</div>
              <div>
                {{ getCourseTeacherName(scope.row, item.props) }}
              </div>
              <div>{{ getCourseTime(scope.row, item.props) }}</div>
              <div class="item-icon">
                <i class="el-icon-edit"></i>
              </div>
              <div
                class="item-icon-close"
                @click="deleteItem(scope.row, item.props, scope.$index, 0)"
                @click.stop="stopProp"
              >
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div
              v-else
              @click="addItem(scope.row, item.props, scope.$index, 3)"
            >
              <i class="el-icon-edit"></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 第五周-->
    <el-table
      :data="weekDays4"
      v-if="
        isWeekEdit > 4 && isReadyShe && isInMonth(weekHeaderData4[0]['date'])
          ? true
          : false
      "
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#08223c',
        border: 'none',
      }"
    >
      <el-table-column
        label="课时"
        header-align="center"
        align="center"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-time-picker
            v-model="weekDays4[scope.$index]['courseStartTime']"
            placeholder="开始时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <span>至</span>
          <el-time-picker
            v-model="weekDays4[scope.$index]['courseEndTime']"
            placeholder="结束时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <!-- <el-time-picker
            is-range
            size="mini"
            v-model="weekDays4[scope.$index]['courseTime']"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            style="width: 140px"
            :clearable="false"
          >
          </el-time-picker> -->
          <el-button
            type="primary"
            size="mini"
            class="classButton"
            v-if="scope.$index === weekDays4.length - 1"
            @click="addCourse(4, {}, new Date(), getAfterHourTime())"
            >增加课时</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in weekHeaderData4"
        header-align="center"
        align="center"
        :key="index"
        :width="item.width"
        :render-header="renderHeader"
        :label="item.week + ' ' + item.date"
      >
        <template slot-scope="scope">
          <div>
            <div
              v-if="isHasEdit(scope.row, item.props)"
              @click="editItem(scope.row, item.props, scope.$index, 4)"
            >
              <div>{{ getCourseName(scope.row, item.props) }}</div>
              <div>
                {{ getCourseTeacherName(scope.row, item.props) }}
              </div>
              <div>{{ getCourseTime(scope.row, item.props) }}</div>
              <div class="item-icon">
                <i class="el-icon-edit"></i>
              </div>
              <div
                class="item-icon-close"
                @click="deleteItem(scope.row, item.props, scope.$index, 0)"
                @click.stop="stopProp"
              >
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div
              v-else
              @click="addItem(scope.row, item.props, scope.$index, 4)"
            >
              <i class="el-icon-edit"></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 第六周-->
    <el-table
      :data="weekDays5"
      v-if="
        isWeekEdit > 5 && isReadyShe && isInMonth(weekHeaderData5[0]['date'])
          ? true
          : false
      "
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#08223c',
        border: 'none',
      }"
    >
      <el-table-column
        label="课时"
        header-align="center"
        align="center"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-time-picker
            v-model="weekDays5[scope.$index]['courseStartTime']"
            placeholder="开始时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <span>至</span>
          <el-time-picker
            v-model="weekDays5[scope.$index]['courseEndTime']"
            placeholder="结束时间"
            size="mini"
            format="HH:mm"
            style="width: 100px"
            :clearable="false"
          >
          </el-time-picker>
          <!-- <el-time-picker
            is-range
            size="mini"
            v-model="weekDays5[scope.$index]['courseTime']"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            style="width: 140px"
            :clearable="false"
          >
          </el-time-picker> -->
          <el-button
            type="primary"
            size="mini"
            class="classButton"
            v-if="scope.$index === weekDays5.length - 1"
            @click="addCourse(5, {}, new Date(), getAfterHourTime())"
            >增加课时</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in weekHeaderData5"
        header-align="center"
        align="center"
        :key="index"
        :width="item.width"
        :render-header="renderHeader"
        :label="item.week + ' ' + item.date"
      >
        <template slot-scope="scope">
          <div>
            <div
              v-if="isHasEdit(scope.row, item.props)"
              @click="editItem(scope.row, item.props, scope.$index, 5)"
            >
              <div>{{ getCourseName(scope.row, item.props) }}</div>
              <div>
                {{ getCourseTeacherName(scope.row, item.props) }}
              </div>
              <div>{{ getCourseTime(scope.row, item.props) }}</div>
              <div class="item-icon">
                <i class="el-icon-edit"></i>
              </div>
              <div
                class="item-icon-close"
                @click="deleteItem(scope.row, item.props, scope.$index, 0)"
                @click.stop="stopProp"
              >
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div
              v-else
              @click="addItem(scope.row, item.props, scope.$index, 5)"
            >
              <i class="el-icon-edit"></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <CourseDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem.sync="editItemData"
      :node="node"
      :week="week"
      :courseTime="courseTime"
      :startTime="courseStartTime"
      :endTime="courseEndTime"
      @addSuccess="addSuccess"
    >
    </CourseDialog>

    <!--工具条-->
    <div class="header" v-if="isReadyShe && isInWeekMonth()">
      <el-button type="primary" @click="nextWeek">编辑下一周</el-button>
    </div>
  </section>
</template>

<script>
import CourseDialog from "../courseDialog";
export default {
  components: {
    CourseDialog,
  },
  mounted() {
    this.searchClass("");
  },
  data() {
    return {
      listLoading: false,
      sels: [], //列表选中列
      loading: false,
      isWeekEdit: 1, //0 第一周 1第二周 2 第三周 3 第四周
      weekFirstDay: "",
      realFirstDay: "",
      realLastDay: "",
      isReadyShe: false,

      weekDays: [{ week: "", date: "" }],
      weekHeaderData: [
        { week: "周一", date: "" },
        { week: "周二", date: "" },
        { week: "周三", date: "" },
        { week: "周四", date: "" },
        { week: "周五", date: "" },
        { week: "周六", date: "" },
        { week: "周日", date: "" },
      ],
      weekDays1: [{ week: "周一", date: "" }],
      weekHeaderData1: [
        { week: "周一", date: "" },
        { week: "周二", date: "" },
        { week: "周三", date: "" },
        { week: "周四", date: "" },
        { week: "周五", date: "" },
        { week: "周六", date: "" },
        { week: "周日", date: "" },
      ],
      weekDays2: [{ week: "周一", date: "" }],
      weekHeaderData2: [
        { week: "周一", date: "" },
        { week: "周二", date: "" },
        { week: "周三", date: "" },
        { week: "周四", date: "" },
        { week: "周五", date: "" },
        { week: "周六", date: "" },
        { week: "周日", date: "" },
      ],
      weekDays3: [{ week: "周一", date: "" }],
      weekHeaderData3: [
        { week: "周一", date: "" },
        { week: "周二", date: "" },
        { week: "周三", date: "" },
        { week: "周四", date: "" },
        { week: "周五", date: "" },
        { week: "周六", date: "" },
        { week: "周日", date: "" },
      ],
      weekDays4: [{ week: "周一", date: "" }],
      weekHeaderData4: [
        { week: "周一", date: "" },
        { week: "周二", date: "" },
        { week: "周三", date: "" },
        { week: "周四", date: "" },
        { week: "周五", date: "" },
        { week: "周六", date: "" },
        { week: "周日", date: "" },
      ],
      weekDays5: [{ week: "周一", date: "" }],
      weekHeaderData5: [
        { week: "周一", date: "" },
        { week: "周二", date: "" },
        { week: "周三", date: "" },
        { week: "周四", date: "" },
        { week: "周五", date: "" },
        { week: "周六", date: "" },
        { week: "周日", date: "" },
      ],
      search: {
        className: "",
        dateRange: [],
        startDate: "",
        endDate: "",
        month: "",
        class: {},
      },
      node: 0,
      week: 0,

      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      options: [],
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      isAdd: false,
      isCheck: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
      courseTime: [],
      courseStartTime: new Date(),
      courseEndTime: new Date(),
    };
  },
  created() {},

  methods: {
    change() {
      this.isReadyShe = false;
      if (Object.keys(this.search.class).length == 0) {
        this.$message.error("请选择需要排课的班级");
        this.search.month = "";
        return;
      }

      this.weekFirstDay = this.getMonday(new Date(this.search.month));
      this.realFirstDay = this.weekFirstDay;
      this.isWeekEdit = 1;

      this.weekHeaderData = this.getDayData(this.weekFirstDay);
      this.weekHeaderData1 = this.getDayData(this.weekFirstDay);
      this.weekHeaderData2 = this.getDayData(this.weekFirstDay);
      this.weekHeaderData3 = this.getDayData(this.weekFirstDay);
      this.weekHeaderData4 = this.getDayData(this.weekFirstDay);
      this.weekHeaderData5 = this.getDayData(this.weekFirstDay);

      this.realLastDay = this.weekFirstDay;
    },

    getWeekDay() {
      this.weekDays = new Array();
      this.addCourse(0, {}, new Date(), this.getAfterHourTime());

      this.weekDays1 = new Array();
      this.addCourse(1, {}, new Date(), this.getAfterHourTime());

      this.weekDays2 = new Array();
      this.addCourse(2, {}, new Date(), this.getAfterHourTime());

      this.weekDays3 = new Array();
      this.addCourse(3, {}, new Date(), this.getAfterHourTime());

      this.weekDays4 = new Array();
      this.addCourse(4, {}, new Date(), this.getAfterHourTime());

      this.weekDays5 = new Array();
      this.addCourse(5, {}, new Date(), this.getAfterHourTime());
      this.isReadyShe = true;

      this.data.records.forEach((item, index) => {
        // 每一天

        let inweek = -1; //查询在第几周
        if (item && item.length > 0) {
          if (this.isDayInWeek(item[0]["classDate"], this.weekHeaderData)) {
            inweek = 0;
          } else if (
            this.isDayInWeek(item[0]["classDate"], this.weekHeaderData1)
          ) {
            inweek = 1;
          } else if (
            this.isDayInWeek(item[0]["classDate"], this.weekHeaderData2)
          ) {
            inweek = 2;
          } else if (
            this.isDayInWeek(item[0]["classDate"], this.weekHeaderData3)
          ) {
            inweek = 3;
          } else if (
            this.isDayInWeek(item[0]["classDate"], this.weekHeaderData4)
          ) {
            inweek = 4;
          } else if (
            this.isDayInWeek(item[0]["classDate"], this.weekHeaderData5)
          ) {
            inweek = 5;
          }
        }

        if (inweek >= 0) {
          this.getCourseData(inweek, item);
        }
      });
    },

    getCourseData(week, item) {
      item.forEach((subItem, subIndex) => {
        // 每一个课时
        if (subItem["node"] != null && subItem["node"] >= 0) {
          this.fixWeekData(week, subItem["node"]);
        }
      });
      item.forEach((subItem, subIndex) => {
        // 每一个课时
        if (subItem["node"] != null && subItem["node"] >= 0) {
          this.addCourse(
            week,
            subItem,
            new Date(subItem["startTime"].replace(/-/g, "/")),
            new Date(subItem["endTime"].replace(/-/g, "/"))
          );
        }
      });
    },

    fixWeekData(week, node) {
      let weekDays = this.weekData;

      switch (week) {
        case 0:
          weekDays = this.weekDays;
          break;

        case 1:
          weekDays = this.weekDays1;
          break;
        case 2:
          weekDays = this.weekDays2;
          break;
        case 3:
          weekDays = this.weekDays3;
          break;
        case 4:
          weekDays = this.weekDays4;
          break;
        case 5:
          weekDays = this.weekDays5;
          break;
        case 6:
          weekDays = this.weekDays6;
          break;
        default:
          break;
      }

      //console.log(weekDays.length + "====" + node + "aaaaa" + week);
      if (weekDays.length > node) {
        return true;
      } else {
        this.addCourse(week, {}, new Date(), this.getAfterHourTime());
        return this.fixWeekData(week, node);
      }
    },

    isDayInWeek(day, weekHeader) {
      let result = false;
      weekHeader.forEach((item, index) => {
        if (item["date"] == day) {
          result = true;
        }
      });
      return result;
    },

    isInMonth(month) {
      let m1 = this.$dayjs(this.search.month).month();
      let m2 = this.$dayjs(month).month();
      if (m1 == m2) {
        return true;
      }
      return false;
    },

    isInWeekMonth() {
      let month = this.search.month;
      switch (this.isWeekEdit) {
        case 1:
          break;
        case 2:
          break;

        case 3:
          month = this.weekHeaderData3[0]["date"];
          break;
        case 4:
          month = this.weekHeaderData4[0]["date"];
          break;
        case 5:
          month = this.weekHeaderData5[0]["date"];
          break;
        case 6:
          month = this.weekHeaderData5[0]["date"];
          break;
        default:
          break;
      }

      let m1 = this.$dayjs(this.search.month).month();
      let m2 = this.$dayjs(month).month();
      if (m1 == m2) {
        return true;
      }
      return false;
    },

    setReadyCourseData(subItem) {
      this.weekDays.forEach((weekData, index));
    },

    changeClass(value) {
      this.search.class = value;
      this.weekDays = new Array();
      this.addCourse(0, {}, new Date(), this.getAfterHourTime());

      this.weekDays1 = new Array();
      this.addCourse(1, {}, new Date(), this.getAfterHourTime());

      this.weekDays2 = new Array();
      this.addCourse(2, {}, new Date(), this.getAfterHourTime());

      this.weekDays3 = new Array();
      this.addCourse(3, {}, new Date(), this.getAfterHourTime());

      this.weekDays4 = new Array();
      this.addCourse(4, {}, new Date(), this.getAfterHourTime());

      this.weekDays5 = new Array();
      this.addCourse(5, {}, new Date(), this.getAfterHourTime());
      this.isWeekEdit = 1;
      this.isReadyShe = false;
    },

    addCourse(index, courseData, courseStartTime, courseEndTime) {
      switch (index) {
        case 0:
          this.getCourseDate(
            this.weekHeaderData,
            this.weekDays,
            courseData,
            courseStartTime,
            courseEndTime
          );
          break;
        case 1:
          this.getCourseDate(
            this.weekHeaderData1,
            this.weekDays1,
            courseData,
            courseStartTime,
            courseEndTime
          );
          break;
        case 2:
          this.getCourseDate(
            this.weekHeaderData2,
            this.weekDays2,
            courseData,
            courseStartTime,
            courseEndTime
          );
          break;
        case 3:
          this.getCourseDate(
            this.weekHeaderData3,
            this.weekDays3,
            courseData,
            courseStartTime,
            courseEndTime
          );
          break;
        case 4:
          this.getCourseDate(
            this.weekHeaderData4,
            this.weekDays4,
            courseData,
            courseStartTime,
            courseEndTime
          );
          break;
        case 5:
          this.getCourseDate(
            this.weekHeaderData5,
            this.weekDays5,
            courseData,
            courseStartTime,
            courseEndTime
          );
          break;

        default:
          break;
      }
    },
    getAfterHourTime() {
      let date = new Date();
      let courseTime = date.setHours(date.getHours() + 4);
      return new Date(courseTime);
    },
    getCourseDate(
      headerData,
      weekDays,
      courseData,
      courseStartTime,
      courseEndTime
    ) {
      let courseObject = {};
      // console.log(
      //   "courseData" + courseData["node"] + "   =====" + courseData["weekNum"]
      // );

      if (Object.keys(courseData).length > 0) {
        if (weekDays.length > courseData["node"]) {
          //已有当前课时  补充课时内容
          courseObject = weekDays[courseData["node"]];
          courseObject[
            "week" + (courseData["weekNum"] - 1)
          ].courseData = courseData;
          courseObject["courseTime"] = [courseStartTime, courseEndTime];
          courseObject["courseStartTime"] = courseStartTime;
          courseObject["courseEndTime"] = courseEndTime;
        } else {
          // 没有课时  重新创建课时
          headerData.forEach((element, index) => {
            let key = "week" + index;
            let weekObject = {};
            if (index == courseData["weekNum"] - 1) {
              weekObject = {
                ...element,
                class: this.search.class,
                courseData: courseData,
              };
            } else {
              weekObject = {
                ...element,
                class: this.search.class,
                courseData: {},
              };
            }
            courseObject[key] = weekObject;
          });
          courseObject["courseTime"] = [courseStartTime, courseEndTime];
          courseObject["courseStartTime"] = courseStartTime;
          courseObject["courseEndTime"] = courseEndTime;
          weekDays.push(courseObject);
        }
      } else {
        headerData.forEach((element, index) => {
          let key = "week" + index;
          let weekObject = {
            ...element,
            class: this.search.class,
            courseData: courseData,
          };
          courseObject[key] = weekObject;
        });
        courseObject["courseTime"] = [courseStartTime, courseEndTime];
        courseObject["courseStartTime"] = courseStartTime;
        courseObject["courseEndTime"] = courseEndTime;

        weekDays.push(courseObject);
      }
    },

    getDayData(dd) {
      let days = new Array();
      let dayjs = this.$dayjs(dd);

      for (let i = 0; i < 7; i++) {
        days.push({
          date: dayjs.add(i, "day").format("YYYY-MM-DD"),
          week: this.getWeek(i),
          props: "week" + i,
        });
      }
      this.weekFirstDay = dayjs.add(7, "day").format("YYYY-MM-DD");
      return days;
    },

    getWeek(i) {
      switch (i) {
        case 0:
          return "周一";
          break;
        case 1:
          return "周二";
          break;
        case 2:
          return "周三";
          break;
        case 3:
          return "周四";
          break;
        case 4:
          return "周五";
          break;
        case 5:
          return "周六";
          break;
        case 6:
          return "周日";
          break;
        default:
          return "";
          break;
      }
    },

    //获取当前日期的周一
    getMonday(dd) {
      let week = dd.getDay(); //获取时间的星期数，周日是0
      let minus = week ? week - 1 : 6;
      dd.setDate(dd.getDate() - minus); //获取minus天前的日期
      let y = dd.getFullYear();
      let m = dd.getMonth() + 1; //获取月份
      m = m < 10 ? "0" + m : m;
      let d = dd.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    onSubmit() {
        if (!this.$route.meta.usable) {
        this.$message.error("该功能权限暂未开放，请联系客服");
        return;
      }
      this.getList();
    },
    // 阻止事件传播
    stopProp(e) {
      e.stopPropagation();
    },

    addSuccess() {
      this.isAdd = false;
      //this.getList();
    },
    nextWeek() {
      this.$confirm("复用课程将会覆盖下周课程,是否复用上周课程?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          this.isWeekEdit++;
          this.saveLastWeekCourse();
        })
        .catch(() => {
          this.isWeekEdit++;
        });
    },
    isHasEdit(item, props) {
      //console.log(item[props]);
      if (Object.keys(item[props]["courseData"]).length > 0) {
        return true;
      }
      return false;
    },
    getCourseName(item, props) {
      return item[props]["courseData"]["courseName"];
    },
    getCourseTeacherName(item, props) {
      return item[props]["courseData"]["teacherName"];
    },
    getCourseTime(item, props) {
      return (
        this.$dayjs(item[props]["courseData"]["startTime"]).format("HH:mm") +
        " " +
        this.$dayjs(item[props]["courseData"]["endTime"]).format("HH:mm")
      );
    },

    editItem(item, props, node, week) {
      this.editItemData = item[props];
      this.courseTime = item["courseTime"];
      this.courseStartTime = item["courseStartTime"];
      this.courseEndTime = item["courseEndTime"];
      this.isAddType = 0;
      this.isAdd = true;
      this.node = node;
      this.week = week;
    },
    deleteItem(item, props, node, week) {
      this.$confirm("该操作将删除改排课是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          this.delete(item[props]["courseData"]);
        })
        .catch(() => {});
    },

    addItem(item, props, node, week) {
      this.editItemData = item[props];
      this.courseTime = item["courseTime"];
      this.courseStartTime = item["courseStartTime"];
      this.courseEndTime = item["courseEndTime"];
      this.isAddType = 1;
      this.isAdd = true;
      this.node = node;
      this.week = week;
    },

    isReadyShedule() {
      if (Object.keys(this.search.class).length == 0 || !this.search.month) {
        return false;
      }
      return true;
    },

    // api

    delete(item) {
      // console.log(item);
      let params = {
        id: item.id,
      };
      this.$axios
        .post(this.API.courseMan.delete, params)
        .then((res) => {
          this.getList();
        })
        .catch(() => {});
    },

    getList() {
      if (Object.keys(this.search.class).length == 0) {
        this.$message.error("请选择需要排课的班级");
        return;
      }
      if (!this.search.month) {
        this.$message.error("请选择需要排课的月份");
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "正在努力加载课表，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let params = {
        classId: this.search.class.id,
        startDate: this.realFirstDay,
        endDate: this.realLastDay,
      };
      this.$axios
        .post(this.API.courseMan.list, params)
        .then((res) => {
          this.data.records = res.data;

          this.getWeekDay();
          this.$nextTick(() => {
            loading.close();
          });
        })
        .catch(() => {});
    },
    searchClass(query) {
      this.loading = true;
      this.$axios
        .post(this.API.class.list, {
          pageIndex: 1,
          pageSize: 300,
          model: {
            state: 0,
            className: query,
          },
        })
        .then((response) => {
          if (parseInt(response.code) === 0) {
            this.options = response.records;
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },

    saveLastWeekCourse() {
      let startWeek = "";
      switch (this.isWeekEdit) {
        case 2: {
          startWeek = this.weekHeaderData1[0]["date"];

          break;
        }
        case 3: {
          startWeek = this.weekHeaderData2[0]["date"];
          break;
        }
        case 4: {
          startWeek = this.weekHeaderData3[0]["date"];
          break;
        }
        case 5: {
          startWeek = this.weekHeaderData4[0]["date"];
          break;
        }
        case 6: {
          startWeek = this.weekHeaderData5[0]["date"];
          break;
        }
        default: {
          break;
        }
      }

      let params = {
        classId: this.search.class.id,
        startWeek: startWeek,
      };
      this.$axios
        .post(this.API.courseMan.saveLastWeekCourse, params)
        .then((res) => {
          this.getList();
        })
        .catch(() => {});
    },

    renderHeader(h, { column }) {
      let header = column.label.split(" ");
      return h("p", [
        h("p", { style: "line-height:.5rem" }, header[0]),
        h(
          "span",
          { style: "color:#979797;font-size:.5rem;margin-top:0" },
          header[1]
        ),
      ]);
    }, // 文本分别添加到p,span标签中
  },

  beforeCreate() {},
};
</script>

<style>
.courseForm_border .el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}

.courseForm_border .el-date-editor .el-range-input {
  width: 40px;
}

.courseForm_border .el-date-editor .el-range-separator {
  width: 20px;
}
</style>

<style lang="scss" scoped>
@import "./courseShedule.scss";
</style>