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
      :data="adrdata"
      :validate="validate" 
      @update-validate="updateValidate">
    </mo-address>
  </div>
</template>

<script>
  import addrData from './address-data.json';

  export default {

    data() {
      let validate = {
        required: true,
        field: 'email',
        validators: [
          {
            rule: /\d/g, 
            msg: '这个是错的'
          },
          {
            validator: (value, callback)=>{
              callback('外面验证错误');
              console.log('valid msg', value);
            }
          }
        ]
      };

      return {
        addr: '21-2101-210101',
        adrdata: addrData,
        validate: validate
      };
    },

    watch: {
      addr(val) {
        console.log('地址值：', val);
      }
    },
    methods: {
      updateValidate(field, isInvalid) {
        console.log('address validate', field, isInvalid);
      }
    }
  };
</script>
