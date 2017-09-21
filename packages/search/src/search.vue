<template>
  <div class="mint-search">
    <div class="mint-searchbar">
      <div class="mint-searchbar-inner">
        <i v-if="isLoading" class="loading mintui mintui-loading"></i>
        <i v-else class="mintui mintui-search"></i>
        <input
          ref="input"
          @click="visible = true"
          type="search"
          v-model="currentValue"
          :placeholder="placeholder"
          class="mint-searchbar-core">
      </div>
      <a
        class="mint-searchbar-cancel"
        
        @click="visible = false, currentValue = ''"
        v-show="visible && cancelText !== ''"
        v-text="cancelText">
      </a>
    </div>
    <div class="mint-search-list" v-if="!listNone" v-show="show || currentValue">
      <div class="mint-search-list-warp">
        <slot :result="queryResult">
          <x-cell v-for="(item, index) in queryResult" :key="index" :title="item"></x-cell>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import XCell from 'mint-ui/packages/cell/index.js';
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/packages/cell/style.css');
}

/**
 * mt-search
 * @module components/search
 * @desc 搜索框
 * @param {string} value - 绑定值
 * @param {function} query - 查询结果 参数：(val, filterResult, setLoading)
 * @param {number} [delay=500] - 延时查询时间 ms
 * @param {boolean} [loading=false] - 是否显示 loading 图标
 * @param {boolean} [list-none=false] - 是停用列表
 * @param {string} [cancel-text=取消] - 取消按钮文字
 * @param {string} [placeholder=取消] - 搜索框占位内容
 * @param {boolean} [autofocus=false] - 自动 focus
 * @param {boolean} [show=false] - 始终显示列表
 * @param {string[]} [result] - 结果列表
 * @param {slot} 结果列表
 *
 * @example
 * <mt-search :value.sync="value" :result.sync="result"></mt-search>
 * <mt-search :value.sync="value">
 *   <mt-cell v-for="item in result" :title="item"></mt-cell>
 * </mt-search>
 */
export default {
  name: 'mt-search',

  data() {
    return {
      isLoading: false,
      visible: false,
      queryResult: [],
      thandle: null,
      currentValue: this.value
    };
  },

  components: { XCell },

  watch: {
    currentValue(val, o) {
      if (val !== o) {
        this.$emit('input', val);
      }
      if (typeof this.query === 'function') {
        clearTimeout(this.thandle);
        this.thandle = setTimeout(()=>{
          if (typeof this.loading !== 'undefined') {
            this.$emit('update:loading', true);
          } else {
            this.isLoading = true;
          }
          this.queryResult = this.query.call(null, val, this.filterResult, this.setLoading) || [];
        }, this.delay);
      }
    },

    value(val) {
      this.currentValue = val;
    },

    loading(val) {
      this.isLoading = val;
    }
  },

  props: {
    value: String,
    autofocus: Boolean,
    show: Boolean,
    loading: Boolean,
    cancelText: {
      default: '取消'
    },
    placeholder: {
      default: '搜索'
    },
    query: Function,
    delay: {
      type: Number,
      default: 500
    },
    listNone: Boolean,
    result: Array
  },

  methods: {
    filterResult(result, val) {
      return result.filter((value) => {
        if (typeof value === 'string') {
          return new RegExp(val, 'i').test(value);
        } else {
          return true;
        }
      });
    },

    setLoading(val) {
      this.isLoading = val === true;
    }
  },

  mounted() {
    this.autofocus && this.$refs.input.focus();
    this.queryResult = this.result || [];
  }
};
</script>

<style lang="css">
  @import "../../../src/style/var.css";

  @keyframes loadingAnim {
    0% { 
      -webkit-transform: rotate(0deg);
      opacity: .4;
    }

    25% { 
      -webkit-transform: rotate(90deg);
      opacity: .55;
    }

    50% { 
      -webkit-transform: rotate(180deg);
      opacity: .85;
    }

    75% { 
      -webkit-transform: rotate(270deg);
      opacity: .55;
    }

    100% { 
      -webkit-transform: rotate(360deg);
      opacity: .4;
    }
  }

  @component-namespace mint {
    @component search {
      height: 100%;
      height: 100vh;
      overflow: hidden;
    }

    @component searchbar {
      position: relative;
      align-items: center;
      background-color: $color-grey;
      box-sizing: border-box;
      display: flex;
      padding: 8px 10px;
      z-index: 1;

      @descendent inner {
        align-items: center;
        background-color: $color-white;
        border-radius: 2px;
        display: flex;
        flex: 1;
        padding: 4px 6px;

        .mintui-search {
          font-size: 16px;
          color: $color-grey;
        }

        .loading {
          animation: loadingAnim 0.7s infinite linear;
          color: #555;
        }
        
      }

      @descendent core {
        appearance: none;
        border: 0;
        box-sizing: border-box;
        text-indent: 5px;
        width: 100%;
        height: 100%;
        outline: 0;
      }

      @descendent cancel {
        color: $color-blue;
        margin-left: 10px;
        text-decoration: none;
      }
    }

    @component search-list {
      overflow: auto;
      padding-top: 44px;
      position: absolute 0 0 0 0;
    }
  }
</style>
