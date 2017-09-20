<template>
  <div class="mo-collapse-item" >
    <div class="item-title" @click="doExpand"><slot name="title"></slot></div>
    <div class="item-content">
      <div :class="['content-wrapper', isExpand ? 'is-expand' : '']">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * mo-collapse-item
 */
export default {
  name: 'mo-collapse-item',

  data() {
    return {
      isExpand: false,
      $index: 0
    };
  },

  methods: {
    doExpand() {
      let expands = [];
      let $index = this.$index;
      let isExpand = this.isExpand = !this.isExpand;
      if (!this.chkParent()) return;
      if (typeof this.$parent.value === 'number') {
        this.$parent.currentVal.push(this.$parent.value);
      } else if (Array.isArray(this.$parent.value)) {
        expands = this.$parent.value.filter((item) => item > -1);
      }

      if (isExpand) {
        expands.push($index);
        this.$parent.currentVal = expands;
      } else {
        this.$parent.currentVal = expands.filter((item) => item !== $index);
      }
      this.$parent.update();
      this.$emit('expand', $index);
    },

    update() {
      let $index = this.$index;
      if (!this.chkParent()) return;
      if (typeof this.$parent.value === 'number' && this.$parent.value === this.$index) {
        this.isExpand = true;
      } else if (Array.isArray(this.$parent.value) &&
        this.$parent.value.filter((item) => item === $index).length) {
        this.isExpand = true;
      } else {
        this.isExpand = false;
      }
    },

    chkParent() {
      let $p = this.$parent;
      if ($p.items && $p.value && $p.currentVal) { return true; }
      console && console.warn('Need Collapse component!');
      return false;
    }
  },

  created() {
    let items = this.$parent.items;
    if (!this.chkParent()) return;
    items.push(this);
    this.$index = items.length - 1;
    this.update();
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
          margin-top: -100%;
          transform: translate3d(0, -100%, 0);
          transition: all .2s ease-in 50ms;
        }

        .content-wrapper.is-expand{
          margin-top: 0;
          transform: translate3d(0, 0, 0);
          transition: all .2s ease-in 50ms;
        }
      }

    }
  }
</style>
