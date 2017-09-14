<template>
  <div class="mo-collapse" >
    <slot></slot>
  </div>
</template>

<script>
/**
 * mo-collapse 组件
  <mo-collapse v-model="collapse">
    <mo-collapse-item>
      <div slot="title">Vue 采用最小成本</div>
      <div slot="content">官方指南会预先假定你已具有中级知识水平。</div>
    </mo-collapse-item>
  </mo-collapse>
 *
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
