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
