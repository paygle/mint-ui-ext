<template>
  <x-cell
    class="mo-select"
    :title="label"
    v-clickoutside="doCloseActive"
    :class="[{
      'is-nolabel': !label
    }]">
    <label :class="['mo-select-label', multiple ? 'is-multiple': '']">
      <span v-if="isEmptylabel" class="placeholder" v-text="placeholder"></span>
      <span v-else class="label" v-text="labelText"></span>
      <select 
        ref="innerSelect"
        class="mo-select-core"
        @focus="active = true"
        v-model="currentValue" 
        :disabled="disabled"
        :readonly="readonly"
        :multiple="multiple">
        <template v-if="cacheData">
          <mo-option 
            v-for="(item, idx) in cacheData"
            :key="idx"
            :val="item.value" 
            :label="item.label">
          </mo-option>
        </template>
        <slot v-else></slot>
      </select>
      <div
        @click="handleClear"
        class="mo-select-clear"
        v-if="!disableClear"
        v-show="currentValue && active">
        <i class="mintui mintui-field-error"></i>
      </div>
    </label>
    <span class="mo-select-state" v-if="state" :class="['is-' + state]">
      <i class="mintui" :class="['mintui-field-' + state]"></i>
    </span>
    <div class="mo-select-other">
      <slot name="append"></slot>
    </div>
  </x-cell>
</template>

<script>
import XCell from 'mint-ui/packages/cell/index.js';
import Clickoutside from 'mint-ui/src/utils/clickoutside';
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/packages/cell/style.css');
}

/**
 * mo-select 组件
 * <mo-select v-model="select" multiple>
    <mo-option val="1" label="选项1"></mo-option>
    <mo-option val="2" label="选项2"></mo-option>
    <mo-option val="3" label="选项3"></mo-option>
  </mo-select>
 *
 */
import MoOption from './option';

export default {
  name: 'mo-select',
  directives: {
    Clickoutside
  },
  components: {
    XCell,
    MoOption
  },
  props: {
    value: {},
    disabled: Boolean,
    readonly: Boolean,
    disableClear: Boolean,
    multiple: Boolean,
    optionsData: Array,         // 初始化option 数据集合 { value: '123', label: '123' }
    fillParams: {},             // 回调参数
    fillOptions: Function,      // 填充 option 数据
    placeholder: {
      type: String,
      default: ''
    },
    label: String,
    state: {
      type: String,
      default: 'default'
    },
    attr: Object
  },

  data() {
    return {
      active: false,
      currentLabel: '',
      labelText: '',
      cacheData: null,
      optionlist: [],
      isEmptylabel: true
    };
  },

  computed: {
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
    value(n, o) {
      if (!n || n === '') {
        this.currentValue = '';
        this.setLabel(n);
      } else {
        this.currentValue = n;
      }
    },

    currentValue(n, o) {
      this.setLabel(n);
    },

    optionlist(n, o) {
      if (Array.isArray(this.cacheData)) {
        if (this.cacheData.length === n.length) {
          this.setLabel(this.currentValue);
        }
      } else {
        this.setLabel(this.currentValue);
      }
    },

    attr: {
      immediate: true,
      handler(attrs) {
        this.$nextTick(() => {
          const target = [this.$refs.innerSelect];
          target.forEach(el => {
            if (!el || !attrs) return;
            Object.keys(attrs).map(name => el.setAttribute(name, attrs[name]));
          });
        });
      }
    }
  },

  methods: {
    checkEmpty() {
      let lbl = this.currentLabel;
      if (typeof lbl === 'string' && lbl === '' || typeof lbl === 'undefined') {
        this.isEmptylabel = true;
      } else if (Array.isArray(lbl) && lbl.length === 0) {
        this.isEmptylabel = true;
      } else {
        this.isEmptylabel = false;
      }
    },

    doCloseActive() {
      this.active = false;
    },

    handleClear() {
      if (this.disabled || this.readonly) return;
      if (Array.isArray(this.currentValue)) {
        this.currentValue = [];
      } else {
        this.currentValue = '';
      }
    },

    setLabel(val) {
      let that = this;

      that.optionlist.forEach(item => {
        if (typeof val === 'string') {
          if (item.value === val) { that.currentLabel = item.label; }
        } else if (Array.isArray(val)) {
          val.forEach(v => {
            if (v === item.value) {
              that.currentLabel.push(item.label);
            }
          });
        }
      });

      if (typeof val === 'undefined' || val === '') {
        if (Array.isArray(this.currentLabel)) {
          this.currentLabel = [];
        } else {
          this.currentLabel = '';
        }
        this.labelText = '';
      } else if (Array.isArray(this.currentLabel)) {
        this.labelText = this.currentLabel.join(',');
      } else {
        this.labelText = this.currentLabel;
      }
      this.checkEmpty();
    }
  },

  mounted() {
    this.checkEmpty();
    if (typeof this.fillOptions === 'function') {
      setTimeout(()=>{
        this.cacheData = this.fillOptions.call(null, this.fillParams);
      }, 100);
    }
  },

  created() {
    this.cacheData = this.optionsData;
  }
};
</script>

<style lang="css">
  @import "../../../src/style/var.css";
 
  @component-namespace mo {
    @component select {
      display: flex;
       
      @descendent label {
        display: block;
        position: relative;
        border: 0;
        width: 100%;
        border-radius: 3px;
        padding: 5px 0;

        span {
          display: block;
          text-indent: 10px;
        }
        .placeholder {
          color: #767676;
        }

        @when multiple {
          overflow: hidden;
        }
      }

      .mint-cell-title {
        width: 105px;
        flex: none;
      }

      .mint-cell-value {
        flex: 1;
        color: inherit;
        display: flex;
      }

      @descendent core {
        position: absolute;
        background-color:transparent;
	      -webkit-appearance: none;
        appearance: none;
        opacity: 0;
        left: 0;
        top: 0;
        width: 100%;
        border-radius: 0;
        border: 0;
        outline: 0;
        line-height: 1.6;
        font-size: inherit;
      }

      @descendent clear {
        position: absolute;
        right: 2px;
        top: 3px;
        opacity: .2;

        &>i {
          font-size: 18px;
        }
      }

      @descendent state {
        color: inherit;
        margin-left: 20px;

        .mintui {
          font-size: 20px;
        }

        @when error {
          color: $error-color;
        }

        @when warning {
          color: $warning-color;
        }

        @when success {
          color: $success-color;
        }

        @when default {
          margin-left: 0;
        }
      }

      @descendent other {
        position: relative 0 0 * *;
      }

      @when nolabel {
        .mint-cell-title {
          display: none;
        }
      }
    }
  }
</style>
