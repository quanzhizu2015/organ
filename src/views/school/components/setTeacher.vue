<template>
  <div>
    <el-form ref="form" label-position="left" label-width="25%">
      <el-form-item label="栏目名称">
        <el-input
          v-model="comTeacher.displayName"
          placeholder="请输入"
          class="classInput"
          maxlength="4"
          show-word-limit
          style="width:13.5rem"
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
  data() {
    return {
      comTeacher: { displayName: "" },
      greatTeachers: [],
      options: [{ id: "", name: "" }],
      lists: [],
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
            const teacherJson = JSON.parse(res.data.json);
            for (let x = 0; x < teacherJson.length; x++) {
              const element = teacherJson[x];
              if (element.id) {
                this.greatTeachers.push(element.id);
              }
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
      for (let index = 0; index < this.greatTeachers.length; index++) {
        const element = this.greatTeachers[index];
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
      this.$nextTick(() => {
        this.comTeacher.json = JSON.stringify(this.lists);
        this.$axios
          .post("train/schoolWeb/update", this.comTeacher)
          .then((res) => {
            if (parseInt(res.code) === 0) {
              this.$emit("update", {
                displayName: this.comTeacher.displayName,
                list: this.lists,
              });
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
