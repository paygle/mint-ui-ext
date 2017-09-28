<template>
  <div class="page-cell">
    <div class="page-title">address choose</div>
    <mo-address
      label="地址选择"
      placeholder="请选择地址"
      cancel-text="放弃"
      confirm-text="选择"
      :visible-item-count="5"
      v-model="addr" 
      :data="adrdata">
    </mo-address>
  </div>
</template>

<script>
  import addrData from './address-data.json';

  export default {

    data() {
      return {
        addr: '21-2101-210101',
        adrdata: addrData
      };
    },

    watch: {
      addr(val) {
        console.log('地址值：', val);
      }
    }
  };
</script>
