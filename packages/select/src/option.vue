<template>
  <option :value="val" v-text="label" :disabled="disabled"></option>
</template>

<script>
/**
 * mo-option
 */
export default {
  name: 'mo-option',

  props: {
    val: String,
    label: String,
    disabled: Boolean
  },

  mounted() {
    this.$nextTick(() => {
      if (Array.isArray(this.$parent.$parent.optionlist)) {
        this.$parent.$parent.optionlist.push({value: this.val, label: this.label});
      }
    });
  }
};
</script>
