<template>
  <div>
    <div class="ta-l"><span>富文本</span></div>
    <div class="ta-l flex row jc-sb mt-05">
      <span class="tx-008 tx-wb txc-60">标题</span>
      <el-input
        size="small "
        v-model="value.title"
        placeholder="请输入标题"
        class="w-15"
        maxlength="12"
        show-word-limit
      ></el-input>
    </div>
    <div class="ta-l flex row jc-sb mt-05 mb-2">
      <span class="tx-008 tx-wb txc-60">是否显示标题</span>
      <el-checkbox
        v-model="value.showTitle"
        :true-label="1"
        :false-label="0"
      ></el-checkbox>
    </div>
    <Tinymce
      ref="desc"
      v-model="value.detail"
      :isCheckSize="true"
      height="250"
      @input="editerInput"
    />
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce/index.vue";
export default {
  components: {
    Tinymce,
  },
  props: {
    value: {
      divDatas: [],
      showTitle: 1,
      detail: "",
    },
  },
  data() {
    return {
      hasChange: false,
    };
  },
  created() {
    this.$on("goEdit", () => {
      //this.getInfo();
      this.hasChange = false;
    });
  },
  watch: {
    value(val) {
      if (!this.hasChange) {
        this.$refs.desc.$emit("desc", val.detail);
      }
    },
  },
  setContent(desc) {
    this.$refs.desc.$emit("desc", desc);
  },
  methods: {
    editerInput(desc) {
     // this.$emit("input", desc);
      this.hasChange = true;
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
.flex-warp {
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
