<template>
  <mt-popup 
    class="mo-poplist"
    v-model="value" 
    :position="position"
    :modal="modal"
    :modal-fade="modalFade"
    :lockScroll="lockScroll"
    :close-on-click-modal="closeOnClickModal"
    :popup-transition="popupTransition">
    <mt-search 
      v-if="value"
      v-model="currentQuery"
      :result="result"
      @item-click="getContent"
      @cancel-search="cancelSearch" show>
      <slot :data="result" :get-content="getContent">
        <x-cell 
          v-for="(item, index) in result" 
          :key="index" :title="item" 
          @click.native="getContent(item)">
        </x-cell>
      </slot>
    </mt-search>
  </mt-popup>
</template>

<script type="text/babel">
import XCell from 'mint-ui/packages/cell/index.js';
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/packages/cell/style.css');
}

export default {
  name: 'mo-poplist',

  components: { XCell },

  props: {
    value: Boolean,
    query: String,
    data: Array,
    position: {
      type: String,
      default: 'left'
    },
    modal: {
      type: Boolean,
      default: true
    },
      modalFade: {
      default: false
    },

    lockScroll: {
      default: false
    },

    closeOnClickModal: {
      default: true
    },

    popupTransition: {
      type: String,
      default: 'popup-slide'
    },

    filterField: String   // 过滤字段
  },

  data() {
    return {
      currentQuery: this.query,
      result: []
    };
  },

  watch: {
    query(n, o) {
      this.currentQuery = typeof n === 'string' ? n : '';
    },

    currentQuery(n, o) {
      this.result = this.filterResult();
    },

    value(n, o) {
      if (n) this.result = this.filterResult();
    }
  },

  methods: {

    filterResult() {
      let attr = this.filterField;
      let queryVal = this.currentQuery;
      let isField = typeof this.filterField === 'string' && this.filterField !== '';
      let result = this.data.filter((value) => {
        if (typeof value === 'object' && isField) {
          return new RegExp(queryVal, 'i').test(value[attr]);
        } else if (typeof value === 'string') {
          return new RegExp(queryVal, 'i').test(value);
        } else {
          return true;
        }
      });
      debugger;
      return result;
    },

    cancelSearch(val) {
      if (typeof val === 'undefined' || val === '') this.$emit('input', false);
    },
    
    getContent(item) {
      this.$emit('changed', item);
      this.$emit('input', false);
    }
  }
};
</script>

<style>
  @component-namespace mo {
    @component poplist {
      width: 100%;

      .list-item {
        padding: 5px 10px;
      }
 
    }
  }
</style>
