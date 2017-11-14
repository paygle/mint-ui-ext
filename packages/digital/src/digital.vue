<template>
  <x-cell
    class="mo-digital"
    :title="label"
    :err-msg="errMsg"
    :is-invalid="isInvalid"
    :is-required="isRequired"
    v-clickoutside="doCloseActive"
    :class="[{
      'is-nolabel': !label
    }]">
    <input
      ref="input"
      type="text"
      class="mo-digital-core"
      :placeholder="placeholder"
      @blur="blurChange"
      @focus="active = true"
      :disabled="disabled"
      :readonly="isReadonly || readonly"
      :value="displayValue">
    <div
      @click="handleClear"
      class="mo-digital-clear"
      v-if="!disableClear && !disabled  && !isReadonly&& !readonly"
      v-show="displayValue && active">
      <i class="mintui mintui-field-error"></i>
    </div>
    <span class="mo-digital-state" v-if="state" :class="['is-' + state]">
      <i class="mintui" :class="['mintui-field-' + state]"></i>
    </span>
    <span class="mo-digital-rate" v-if="!hideRateIcon && type !== 'number'">
      <i class="mintui" :class="['mintui-' + type]"></i>
    </span>
    <div class="mo-digital-other">
      <slot></slot>
    </div>
  </x-cell>
</template>

<script>
import XCell from 'mint-ui/packages/cell/index.js';
import Clickoutside from 'mint-ui/src/utils/clickoutside';
import validator from 'mint-ui/src/mixins/validator';
import math from 'mint-ui/src/utils/math';
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/packages/cell/style.css');
}

/**
 * mt-field
 * @desc 编辑器，依赖 cell
 * @module components/digital
 *
 * @param {string} [type=number] - field 类型，接受 number, percent, permillage
 * @param {number} [precision] 数字精度
 * @param {Boolean}[formated] 是否格式化，三位分组，小数位不处理
 * @param {string} [label] - 标签
 * @param {string} [rows] - textarea 的 rows
 * @param {string} [placeholder] - placeholder
 * @param {string} [disabled] - disabled
 * @param {string} [readonly] - readonly
 * @param {string} [state] - 表单校验状态样式，接受 error, warning, success
 *
 * @example
 * <mt-field v-model="value" label="用户名"></mt-field>
 * <mt-field v-model="value" label="密码" placeholder="请输入密码"></mt-field>
 * <mt-field v-model="value" label="自我介绍" placeholder="自我介绍" type="textarea" rows="4"></mt-field>
 * <mt-field v-model="value" label="邮箱" placeholder="成功状态" state="success"></mt-field>
 */
export default {
  name: 'mo-digital',
  
  components: { XCell },

  mixins: [validator],

  directives: {
    Clickoutside
  },

  props: {
    value: 0,
    type: {              // 支持类型： number/percent/permillage
      type: String,
      default: 'number'
    },
    hideRateIcon: Boolean,  // 是否隐藏比率图标
    precision: Number,
    isEmpty: Boolean,    // 默认是否可以为空
    max: Number,                // 最大值
    min: Number,                // 最小值
    split: {                // 分隔位数
      type: [Number, String],
      default: 3
    },
    formated: Boolean,      // 是否格式化
    splitMark: {            // 分隔符号
      type: String,
      default: ','
    },
    rows: String,
    label: String,
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    disableClear: Boolean,
    state: {
      type: String,
      default: 'default'
    },
    attr: Object
  },

  data() {
    return {
      active: false,
      isReadonly: false,
      displayValue: '',
      currentValue: '',
      formatValue: ''
    };
  },

  computed: {
    formatRegx() {
      return '^\\-?[\\d\\' + this.splitMark + ']*(\\.?\\d*)$';
    }
  },

  watch: {
    value(val, old) {
      this.goValid = true;
      this.validateFields();  // 监控验证

      if (val === 0 || val === '0') {
        this.currentValue = 0;
        this.formatValue = 0;

      } else if (val !== old) {
        let value;
        if (this.type === 'percent' || this.type === 'permillage') {
          value = this.getRateValue(val);
          this.formatValue = (!isNaN(value) && Number(value) === 0) ? '' : value;
        } else if (this.formated || this.precision) {
          value = this.getFormatVal(val);
          this.formatValue = (!isNaN(value) && Number(value) === 0) ? '' : value;
        } else {
          this.currentValue = val;
        }
      }

      this.$nextTick(() => {
        if (!isNaN(this.max) && typeof this.max !== 'undefined' && this.value > this.max) {
          this.$emit('input', this.max);
        }

        if (!isNaN(this.min) && typeof this.min !== 'undefined' && this.value < this.min) {
          this.$emit('input', this.min);
        }
      });
    },

    currentValue: {
      immediate: true,
      handler(val) {
        if (!(this.formated || this.precision) && this.type === 'number') {
          this.displayValue = val;
        }
      }
    },

    formatValue: {
      immediate: true,
      handler(val) {
        this.displayValue = val;
      }
    },

    attr: {
      immediate: true,
      handler(attrs) {
        this.$nextTick(() => {
          const target = [this.$refs.input, this.$refs.textarea];
          target.forEach(el => {
            if (!el || !attrs) return;
            Object.keys(attrs).map(name => el.setAttribute(name, attrs[name]));
          });
        });
      }
    }
  },

  methods: {
    notEmpty(val) {
      if (!this.isEmpty && (typeof val === 'undefined' || val === '' || /^\s+$/g.test(val))) {
        return true;
      }
      return false;
    },

    // 从 12345678.12 -> 12,345,678.12
    getFormatVal(value, type) {
      value = typeof value === 'undefined' ? String(this.value)
        : String(value).replace(new RegExp(this.splitMark, 'g'), '');

      if (!isNaN(value) && value !== '' && !/e/g.test(value)) {
        let integer, decimal, minus = '';
        let splitVal, integerArray = [];

        if (/^\-/g.test(value)) {
          value = value.replace(/^\-/g, '');
          minus = '-';
        }
        
        splitVal = String(this.setPrecision(value)).split('.');

        if (splitVal.length >= 2) {
          integer = splitVal[0] || 0;
          decimal = splitVal[1];
        } else {
          integer = splitVal[0];
        }

        if (integer && integer.length) {
          let len = integer.length;
          let i = len, tmps = '', end;
          let span = this.split;

          for (; i >= 0;) {
            end = i - span;
            tmps = integer.substring(i, end);
            if (tmps !== '' && tmps.length === span) {
              integerArray.push(tmps);
            } else if (i < span && tmps !== '') {
              integerArray.push(integer.substring(i, 0));
            }
            i = i - span;
          }
        }
        if (decimal && decimal.length) {
          return minus + integerArray.reverse().join(this.splitMark) + '.' + decimal;
        }
        return minus + integerArray.reverse().join(this.splitMark);
      }
      return value;
    },

    setPrecision(value, bit) {
      let numStr, num = null, mbit = bit || this.precision || 0;
      numStr = String(value).split('.');

      if (numStr.length === 2) {
        if (numStr[1].length > mbit) {
          numStr[1] = String(numStr[1]).substr(0, mbit);
        } else if (numStr[1].length < mbit) {
          for (let i = numStr[1].length; i < mbit; i++) numStr[1] += '0';
        }
        num = numStr.join('.');
      } else if (mbit > 0) {
        numStr[1] = '';
        for (let i = 0; i < mbit; i++) numStr[1] += '0';
        num = numStr.join('.');
      }
      return (num === null || isNaN(num)) ? value : num;
    },

    getSizeNumber(val) {
      if (val === '') {
        return '';
      } else if (this.type === 'percent') {
        return math.div(val, 100);
      } else if (this.type === 'permillage') {
        return math.div(val, 1000);
      }
      return val;
    },

    getRateValue(value) {
      if (this.type === 'percent') {
        return this.setPrecision(math.multi(value, 100));
      } else if (this.type === 'permillage') {
        return this.setPrecision(math.multi(value, 1000));
      }
      return value;
    },

    // 从 12,345,678.12 -> 12345678.12
    getValue(value) {

      if (typeof value === 'undefined') {
        if (this.formated || this.precision) {
          value = this.formatValue;
        } else {
          value = this.currentValue;
        }
      }

      if (value && value !== '' && new RegExp(this.formatRegx, 'g').test(value)) {
        value = String(value).replace(new RegExp(this.splitMark, 'g'), '');
        return this.setPrecision(value);
      }

      // 是否允许为空
      if (this.notEmpty(value)) {
        return 0;
      } else {
        return value;
      }
    },

    doCloseActive() {
      this.active = false;
    },

    blurChange(e) {
      let value;

      if (this.type === 'percent' || this.type === 'permillage') {
        value = this.getSizeNumber(this.$refs.input.value);
      } else if (this.formated || this.precision) {
        value = String(this.getValue(this.$refs.input.value));
        value = (!isNaN(value) && value !== '') ? Number(value) : '';
      }

      // 是否允许为空
      if (this.notEmpty(value) || value === 0) {
        this.displayValue = 0;
        this.formatValue = 0;
        this.$refs.input.value = 0;
        value = 0;
      }
      this.$emit('input', value);
      this.$emit('change', value);
    },

    handleClear() {
      if (this.disabled || this.readonly) return;
      this.$refs.input.focus();
      this.$emit('input', '');
    },
    // 设置显示值
    setDisplayValue(val) {
      val = val || this.value;
      if (this.type === 'percent' || this.type === 'permillage') {
        this.formatValue = this.getRateValue(val);
      } else if (this.formated || this.precision) {
        this.formatValue = this.getFormatVal(val);
      } else {
        this.currentValue = val;
      }
    }

  },

  mounted() {
    this.initValidators();  // 初始化验证
    this.setDisplayValue();
  }
};
</script>

<style lang="css">
  @import "../../../src/style/var.css";

  @component-namespace mo {
    @component digital {
      display: flex;

      .mint-cell-title {
        width: 90px;
        flex: none;
      }

      .mint-cell-value {
        flex: 1;
        color: inherit;
        display: flex;
      }

      @descendent core {
        appearance: none;
        border-radius: 0;
        border: 0;
        flex: 1;
        outline: 0;
        line-height: 1.6;
        font-size: inherit;
        width: 100%;
      }

      @descendent clear {
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
