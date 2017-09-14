<template>
  <div class="mo-select">
    <label class="mo-select-label">
      <span v-if="isEmptylabel" class="placeholder" v-text="placeholder"></span>
      <span v-else class="label" v-text="labelText"></span>
      <select class="select" v-model="currentValue" :disabled="disabled" :multiple="multiple">
        <slot></slot>
      </select>
    </label>
  </div>
</template>

<script>
/**
 * mo-select 组件
 * <mo-select v-model="select" multiple>
    <mo-option val="1" label="选项1"></mo-option>
    <mo-option val="2" label="选项2"></mo-option>
    <mo-option val="3" label="选项3"></mo-option>
  </mo-select>
 *
 */
export default {
  name: 'mo-select',

  props: {
    value: [String, Array],
    disabled: Boolean,
    multiple: Boolean,
    placeholder: {
      type: String,
      default: '请选择'
    }
  },

  data() {
    return {
      loading: false,
      currentLabel: '',
      labelText: '',
      options: []
    };
  },

  computed: {
    isEmptylabel() {
      let lbl = this.currentLabel;
      if (typeof lbl === 'string' && lbl === '') {
        return true;
      } else if (Array.isArray(lbl) && lbl.length === 0) {
        return true;
      }
      return false;
    },

    currentValue: {
      get() {
        let value = this.value;
        if (this.multiple) {
          this.currentLabel = [];
          if (typeof value === 'string' && value !== '') {
            return [value];
          } else if (Array.isArray(value)) {
            return value;
          }
          return [];
        } else {
          return value;
        }
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },

  watch: {
    currentValue(n, o) {
      let that = this;
      that.options.forEach(item => {
        if (typeof n === 'string') {
          if (item.value === n) { that.currentLabel = item.label; }
        } else if (Array.isArray(n)) {
          n.forEach(v => {
            if (v === item.value) {
              that.currentLabel.push(item.label);
            }
          });
        }
      });

      if (Array.isArray(that.currentLabel)) {
        this.labelText = that.currentLabel.join(',');
      } else {
        this.labelText = that.currentLabel;
      }
    }
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
        .placeholder {
          color: #767676;
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
