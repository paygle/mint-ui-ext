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

  created() {
    this.$parent.options.push({value: this.val, label: this.label});
  }

};
</script>
