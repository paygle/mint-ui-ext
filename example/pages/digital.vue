<template>
  <div class="page-digital">
    <div class="page-title">Digital</div>
    <div class="page-part">
      <mo-digital 
        label="数字" 
        placeholder="请输入数字" 
        type="number" 
        v-model="num" 
        :validate="validate" 
        @update-validate="updateValidate" formated>
      </mo-digital>
      
      <!-- <mt-field label="密码" placeholder="请输入密码" type="password"></mt-field>
      <mt-field label="手机号" placeholder="请输入手机号" type="tel"></mt-field>
      <mt-field label="网站" placeholder="请输入网址" type="url"></mt-field>
      <mt-field label="数字" placeholder="请输入数字" type="number"></mt-field>
      <mt-field label="生日" placeholder="请输入生日" type="date"></mt-field>
      <mt-field label="自我介绍" placeholder="自我介绍" type="textarea" rows="4"></mt-field>
      -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-digital',
  data() {
    let validate = {
        required: true,
        type: 'number',
        field: 'num',
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
      value: 'a',
      num: 23456789003,
      validStatus: {},
      validate: validate
    };
  },
  methods: {
    translate(setText, value) {
      setText('这是翻译内容');
    },
    updateValidate(field, isInvalid) {
      this.validStatus[field] = isInvalid;
      console.log('update validate', field, isInvalid);
    }
  }
};
</script>
