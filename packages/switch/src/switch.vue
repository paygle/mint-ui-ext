<template>
  <label class="mint-switch" :class="classDisabled">
    <input class="mint-switch-input" :disabled="disabled" @change="$emit('change', value)" type="checkbox" v-model="currentValue">
    <span class="mint-switch-core" :class="bgclass" :style="bgcolor"></span>
    <div class="mint-switch-label"><slot></slot></div>
  </label>
</template>

<script>
/**
 * mt-switch
 * @module components/switch
 * @desc 切换按钮
 * @param {boolean} [value] - 绑定值，支持双向绑定
 * @param {slot} - 显示内容
 *
 * @example
 * <mt-switch v-model="value"></mt-switch>
 */
export default {
  name: 'mt-switch',

  props: {
    value: [Boolean, String, Number],
    colorOn: String,
    colorOff: String,
    switchOn: {
      type: [Boolean, String, Number],
      default: true
    },
    switchOff: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bgcolor: {},
      bgclass: ''
    };
  },
  computed: {

    classDisabled() {
      if (this.disabled) {
        return 'disabled';
      }
      return '';
    },
    
    currentValue: {
      get() {
        if (this.switchOn === this.value) {
          return true;
        } else if (this.switchOff === this.value) {
          return false;
        } 
        return;
      },
      set(val) {
        if (val) {
          this.bgcolor = this.getBgcolor(this.switchOn);
          this.$emit('input', this.switchOn);
        } else {
          this.bgcolor = this.getBgcolor(this.switchOff);
          this.$emit('input', this.switchOff);
        }
      }
    }
  },
  methods: {
    getBgcolor(val) {
      this.bgclass = '';
      if (this.disabled) return {};
      if (this.colorOn && val === this.switchOn) {
        return {border: '1px solid ' + this.colorOn, background: this.colorOn};
      } else if (this.colorOff && val === this.switchOff) {
        this.bgclass = 'trans';
        return {border: '1px solid ' + this.colorOff, background: this.colorOff};
      }
      return {};
    }
  },
  mounted() {
    if (this.currentValue) {
      this.bgcolor = this.getBgcolor(this.switchOn);
    } else {
      this.bgcolor = this.getBgcolor(this.switchOff);
    }
  }
};
</script>

<style lang="css">
  @import "../../../src/style/var.css";

  @component-namespace mint {
    @component switch {
      display: flex;
      align-items: center;
      position: relative;

      * {
        pointer-events: none;
      }

      @descendent label {
        margin-left: 10px;
        display: inline-block;

        &:empty {
          margin-left: 0;
        }
      }

      @descendent core {
        display: inline-block;
        position: relative;
        size: 52px 32px;
        border: 1px solid $color-grey;
        border-radius: 16px;
        box-sizing: border-box;
        background: $color-grey;

        &::after, &::before {
          content: " ";
          position: absolute 0 * * 0;
          transition:transform .3s;
          border-radius: 15px;
        }

        &::after {
          size: 30px;
          background-color: $color-white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
        }

        &::before {
          size: 50px 30px;
          background-color: #fdfdfd;
        }

        &.trans::before {
          background-color: transparent;
        }
      }

      &.disabled > .mint-switch-core {
        border: 1px solid #ddd;
        background: #ddd;
        &::after {
          background-color: #eee;
        }

        &::before {
          background-color: #ddd;
        }
      }

      @descendent input {
        display: none;

        &:checked {
          + .mint-switch-core {
            border-color: $color-blue;
            background-color: $color-blue;

            &::before {
              transform: scale(0);
            }

            &::after {
              transform: translateX(20px);
            }
          }
        }
      }
    }
  }
</style>
