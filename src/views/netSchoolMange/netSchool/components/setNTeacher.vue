<template>
  <div>
    <el-form ref="form" label-position="left" label-width="25%">
      <el-form-item label="栏目名称">
        <!--comTeacher.displayName-->
        <el-input
          v-model="value.title"
          placeholder="请输入"
          class="classInput"
          maxlength="4"
          show-word-limit
          style="width: 13.5rem"
        />
      </el-form-item>

      <el-form-item label="选择老师">
        <el-select v-model="greatTeachers" placeholder="请选择" multiple>
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="w-full" @click="save">保存</el-button>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return { divDatas: [], title: "" };
      },
    },
  },
  data() {
    return {
      comTeacher: { displayName: "" },
      greatTeachers: [],
      options: [{ id: "", name: "" }],
      lists: [],
      showTitle: 1,
      showMore: 1,
    };
  },
  created() {
    this.getTeacher();
    this.$on("goEdit", () => {
      this.getInfo();
    });
  },

  methods: {
    getInfo() {
      this.greatTeachers = [];
      this.$axios
        .post("train/schoolWeb/getSchoolInfoByGroupId", {
          id: localStorage.getItem("school_id"),
          groupId: "comTeacher",
        })
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.comTeacher = res.data;
            this.value.title = res.data.displayName;
            const teacherJson = JSON.parse(res.data.json);
            this.value.divDatas = [];
            for (let x = 0; x < teacherJson.length; x++) {
              const element = teacherJson[x];
              if (element.id) {
                this.greatTeachers.push(element.id);
              }
              this.value.divDatas.push({
                clickUrl: "", //点击图标
                dataId: element.id, //绑定的数据源
                jumpDetail: 5, //跳转详情,如果是外部跳转就是具体链接,如果是内部跳转,1:图文,2:视频,3:文本,4:商品组5.教师详情
                jumpType: 1, //跳转类型 1:内部跳转,2:外部链接
                subDivData: [],
                title: element.name, //标题
                dataCoverUrl:"",//商品封面
                type: 1, //组件数据类型 1:非关联数据,2:tab数据,3:关联单数据,4:关联数据组
                url: element.img, //链接
                id: element.id,
                tag: element.id,
                isGoods: 0, //是否商品 0:不是,1:是
                saleModel: 2, //售卖方式 1:付费,2:免费,3:加密
                abbre: element.desc, //简介
                compatible: 1, //1:图文,2:纯文本
              });
            }
          } else {
            this.$message.error(res.message);
          }
        });
    },
    getTeacher() {
      this.$axios
        .post("train/teacher/page", {
          pageIndex: 1,
          pageSize: 300,
          model: {
            state: 0,
          },
        })
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.options = res.records;
          } else {
            //this.$message.error(res.message);
          }
        });
    },
    save() {
      this.lists = [];
      let teachers = [];
      for (let index = 0; index < this.greatTeachers.length; index++) {
        const element = this.greatTeachers[index];
        this.value.divDatas.forEach((teacher) => {
          if (parseInt(element) === parseInt(teacher.dataId)) {
            teachers.push({ ...teacher });
          }
        });

        for (let j = 0; j < this.options.length; j++) {
          const option = this.options[j];
          if (parseInt(element) === parseInt(option.id)) {
            this.lists.push({
              id: option.id,
              name: option.name,
              img: option.imgUrl,
              desc: option.description,
            });
          }
        }
      }
      if (!this.lists || this.lists.length < 1) {
        this.$message.error("教师数据不能为空");
        return;
      }

      this.value.divDatas.splice(0, this.value.divDatas.length);
      teachers.forEach((teacher) => {
        this.value.divDatas.push({ ...teacher });
      });

      this.$nextTick(() => {
        this.comTeacher.json = JSON.stringify(this.lists);
        this.$axios
          .post("train/schoolWeb/update", {
            ...this.comTeacher,
            displayName: this.value.title,
          })
          .then((res) => {
            if (parseInt(res.code) === 0) {
              this.$emit("update", {
                displayName: this.comTeacher.displayName,
                list: this.lists,
              });
              this.getInfo();
            } else {
              this.$message.error(res.message);
            }
          });
      });
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
