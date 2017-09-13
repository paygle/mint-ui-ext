<template>
  <div class="mo-select">
    <label class="mo-select-label">
      <span v-if="currentLabel === ''" class="placeholder" v-text="placeholder"></span>
      <span v-else class="label" v-text="currentLabel"></span>
      <select class="select" v-model="currentValue">
        <slot></slot>
      </select>
    </label>
  </div>
</template>

<script>
/**
 * mo-select
 */
export default {
  name: 'mo-select',

  props: {
    value: String,
    placeholder: {
      type: String,
      default: '请选择'
    }
  },

  data() {
    return {
      currentValue: '',
      currentLabel: '',
      options: []
    };
  }

};
</script>

<style lang="css">
  @import "../../../src/style/var.css";

  @component-namespace mo {
    @component select {
 
      @descendent label {
        display: block;
        position: relative;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 5px 10px;

        span {
          display: block;
        }
      }

      select {
        position: absolute;
        background-color:transparent;
	      -webkit-appearance: initial;
        border: solid 0px;
        opacity: 0;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
