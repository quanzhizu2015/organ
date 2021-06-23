<template>
  <div>
    <span>{{ checked +"我是子的"}}</span>
    <input :value="checked" @input="(event)=>{this.$emit('change', event.target.value)}" />
  </div>
</template>


<script>
export default {
  name: "BriefInput",
  model: {
    prop: "checked",
    event: "change",
  },
  props: {
    // value: {
    //   type: String,
    //   default: "",
    // },
    checked:{
        type: String,
        default: "",
    }
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>