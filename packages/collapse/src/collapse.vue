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

<style lang="css">
  @import "../../../src/style/var.css";

  @component-namespace mo {
    @component collapse {
 
      @descendent item {
        display: block;
        padding: 0 10px;

        .item-title{
          font-size: 14px;
          font-weight: bold;
          padding: 10px 0;
        }

        .item-content{
          overflow: hidden;
        }

        .content-wrapper{
          height: 0;
          margin-top: -100%;
          transform: translate3d(0, -100%, 0);
          transition: all .2s ease-in 50ms;
        }

        .content-wrapper.is-expand{
          height: auto;
          margin-top: 0;
          transform: translate3d(0, 0, 0);
          transition: all .2s ease-in 50ms;
        }
      }
    }
  }
</style>
