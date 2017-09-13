<template>
  <div class="mo-collapse" >
    <slot></slot>
  </div>
</template>

<script>
/**
 * mo-collapse
 */
export default {
  name: 'mo-collapse',

  props: {
    value: [Number, Array]
  },

  data() {
    return {
      items: [],
      currentVal: []
    };
  },

  watch: {
    value(n, o) {
      if (n !== o) {
        this.items.forEach((item) => { item.update(); });
      }
    }
  },

  methods: {
    update() {
      this.$emit('input', this.currentVal);
    }
  }
};
</script>
