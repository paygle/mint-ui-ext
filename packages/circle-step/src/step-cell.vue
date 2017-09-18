<template>
  <span 
    @click="stepClick"
    :style="styl"
    v-text="val">
  </span>
</template>
<script>
export default {
  name: 'StepCell',

  props: {
    val: {},
    actived: Boolean
  },

  computed: {
    styl() {
      let styls = this.$parent.setting;
      function getCellStyl(styl, acted) {
        if (acted) {
          return { background: styl.activedbg, color: styl.activedColor };
        }
        return { background: styl.background, color: styl.color };
      }

      if (Array.isArray(styls)) {

        if (styls.length === 1) {
          return getCellStyl(styls[0], this.actived);
        } else if (typeof styls[this.val - 1] === 'object') {
          return getCellStyl(styls[this.val - 1], this.actived);
        } else {
          return getCellStyl(styls[styls.length - 1], this.actived);
        }
      }
    }
  },

  methods: {
    stepClick() {
      this.$parent.$emit('input', this.val);
      this.$parent.$emit('step-click', this.val);
    }
  }
};
</script>