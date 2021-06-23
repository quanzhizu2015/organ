<template>
  <div>
    <p>
      设置标题：
      <el-input v-model="about.title" placeholder="请输入内容"></el-input>
    </p>
    <p style="line-height:40px;">图文详情：</p>
    <Tinymce />
    <div class="w-full flex mt-20">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary">保存</el-button>
    </div>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce/min";
export default {
  components: { Tinymce },
  data() {
    return {
      about: { title: "" }
    };
  },

  methods: {}
};
</script>
<style scoped>
.cursor {
  cursor: pointer;
}
.text-base {
  font-size: 14px;
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
</style>
