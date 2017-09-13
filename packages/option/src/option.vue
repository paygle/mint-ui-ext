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

  data() {
    return {
      $index: 0
    };
  },

  created() {
    this.$parent.options.push(this);
    this.$index = this.$parent.options.length - 1;
  }

};
</script>
