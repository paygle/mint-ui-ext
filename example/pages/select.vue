<template>
  <div class="page-select">
    <h1 class="page-title">select</h1>
    <div class="page-select-wrapper">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
      <mo-select label="选项" v-model="select" placeholder="请输入" :options-data="options">
        <mo-option val="1" label="选项1"></mo-option>
        <mo-option val="2" label="选项2"></mo-option>
        <mo-option val="3" label="选项3"></mo-option>
      </mo-select>
      <mo-select
        label="参数" 
        placeholder="请输入类型"  
        v-model="selectp" 
        :fill-options="fillParamOptions"
        :validate="validate" 
        @update-validate="updateValidate">
      </mo-select>
      <mo-select
        label="类型" 
        placeholder="请输入类型"  
        v-model="selectM"
        @change="getItems"
        :fill-options="fillOptions" 
        :fill-params="combParam"
        ref="vsel"
        :validate="validate" 
        @update-validate="updateValidate">
      </mo-select>
      <mt-button type="primary" @click="submit">提交</mt-button>
    </div>
  </div>
</template>

<style>
  @component-namespace page {
    @component select {
      @descendent wrapper {
        padding: 0 20px;
        position: absolute 50% * * *;
        width: 100%;
        transform: translateY(-50%);
        button:not(:last-child) {
          margin-bottom: 20px;
        }
      }
    }
  }
</style>

<script type="text/babel">
  export default {
    data() {
      let validate = {
        required: true,
        field: 'selectM',
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
        username: '',
        select: '1',
        selectp: '1',
        selectM: '1',
        validate: validate,
        validStatus: {},
        options: [
          {value: '1', label: '11111'},
          {value: '2', label: '22222'},
          {value: '3', label: '33333'},
          {value: '4', label: '44444'},
          {value: '5', label: '55555'}
        ]
      };
    },
    computed: {
      combParam() {
        return {key: this.select, key2: this.selectp};
      }
    },
    methods: {
      getItems(items) {
        console.log('items:', items);
      },
      fillParamOptions(getOptions, param) {
        console.log('PARAM1:', param);
        getOptions([
          {value: '1', label: 'B11111'},
          {value: '2', label: 'B22222'},
          {value: '3', label: 'B33333'},
          {value: '4', label: 'B44444'},
          {value: '5', label: 'B55555'}
        ]);
      },
      fillOptions(getOptions, param) {
        console.log('PARAM2:', param);

        if (param.key === '1' && param.key2 === '1') {
          getOptions([
            {value: '1', label: 'B11111'},
            {value: '2', label: 'B22222'},
            {value: '3', label: 'B33333'},
            {value: '4', label: 'B44444'},
            {value: '5', label: 'B55555'}
          ]);
        } else {
          getOptions([]);
        }
      },
      updateValidate(field, isInvalid) {
        this.validStatus[field] = isInvalid;
        console.log('select validate', field, isInvalid);
      },
      submit() {
        if (this.$refs.vsel.verifySubmit(this.validStatus)) {
          alert('验证通过');
        }
      }
    }
  };
</script>
