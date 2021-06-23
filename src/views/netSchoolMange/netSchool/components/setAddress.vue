<template>
  <div>
    <div class="ta-l"><span>专栏</span></div>

    <el-form>
      <el-form-item label="标题">
        <el-input
          v-model.trim="editItem.title"
          maxlength="12"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="机构地址">
        <el-cascader
          ref="address"
          v-model="selectedOptions"
          :options="options"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model.trim="editItem.guideWords" type="textarea" maxlength="50"
          show-word-limit />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import SelectImageDialog from "../../components/selectImageDialog";
import $ from "jquery";
export default {
  name: "SetAddress",
  components: {
    SelectImageDialog,
  },
  props: {
    // value: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       divDatas: [],
    //       applets: "", //微信
    //       buttonWords: "", //按钮文案
    //       contact: "", //联系方式
    //       guideWords: "", //引导文案
    //       title: "", //标题
    //     };
    //   },
    // },
    editItem: {
      type: Object,
      default: () => {
        return {
          divDatas: [],
          applets: "", //微信
          buttonWords: "", //按钮文案
          contact: "", //联系方式
          province: "浙江省",
          city: "杭州市",
          area: "西湖区",
          guideWords: "",
          title: "", //标题
        };
      },
    },
  },
  model: {
    prop: "editItem",
    event: "changeItem",
  },
  watch: {
    editItem: {
      handler(val) {
        this.dataItem = val;
      },
      deep: true,
    },
  },
  data() {
    return {
      image: "",
      user: {},
      options: regionData,
      selectedOptions: [],
      dataItem: this.editItem,
    };
  },

  created() {
    this.$on("goEdit", () => {
      setTimeout(() => {
        this.setAddress();
      }, 100);
    });
  },
  methods: {
    setAddress() {
      let sOptions = new Array();
      if (this.editItem.province) {
        sOptions.push(TextToCode[this.editItem.province].code);
      }
      if (this.editItem.province && this.editItem.city) {
        sOptions.push(
          TextToCode[this.editItem.province][this.editItem.city].code
        );
      }
      if (this.editItem.province && this.editItem.city && this.editItem.area) {
        sOptions.push(
          TextToCode[this.editItem.province][this.editItem.city][
            this.editItem.area
          ].code
        );
      }
      this.selectedOptions = sOptions;
    },
    handleChange(value) {
      this.dataItem.province = CodeToText[value[0]];
      this.dataItem.area = CodeToText[value[2]];
      this.dataItem.city = CodeToText[value[1]];
      this.$emit("changeItem", this.dataItem);
    },
  },
};
</script>
<style lang="scss" scoped>
.w-full {
  width: 100%;
}
.col-b {
  color: #2a75ed;
}
.col-w {
  color: #fff;
}
.fs-08 {
  font-size: 0.8rem;
}
.fs-05 {
  font-size: 0.5rem;
}
</style>