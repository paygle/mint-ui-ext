<template>
  <div class="page-field">
    <div class="page-title">Field</div>
    <div class="page-part">
      <mt-field 
        label="用户名" 
        placeholder="请输入用户名" 
        v-model="value" 
        :translate="translate"
        :attr="{ maxlength: 10 }">
      </mt-field>
      <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="email" :validate="validate" @update-validate="updateValidate"></mt-field>
      
      <mt-field label="密码" placeholder="请输入密码" type="password"></mt-field>
      <mt-field label="手机号" placeholder="请输入手机号" type="tel"></mt-field>
      <mt-field label="网站" placeholder="请输入网址" type="url"></mt-field>
      <mt-field label="数字" placeholder="请输入数字" type="number"></mt-field>
      <mt-field label="生日" placeholder="请输入生日" type="date"></mt-field>
      <mt-field label="自我介绍" placeholder="自我介绍" type="textarea" rows="4"></mt-field>
     
    </div>

    <div class="page-part">
      <mt-field placeholder="登录邮箱" type="email"></mt-field>
      <mt-field placeholder="密码" type="password"></mt-field>
    </div>

    <div class="page-part">
      <mt-field label="邮箱" placeholder="成功状态" state="success"></mt-field>
      <mt-field label="邮箱" placeholder="失败状态" state="error"></mt-field>
      <mt-field label="邮箱" placeholder="警告状态" state="warning"></mt-field>
    </div>

    <div class="page-part">
      <mt-field label="验证码" placeholder="输入验证码">
        <img src="../assets/100x100.png" height="48px" width="100px">
      </mt-field>
    </div>
   
  </div>
</template>

<script>
export default {
  name: 'page-field',
  data() {
    let validate = {
        required: true,
        type: 'number',
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
      value: 'a',
      email: '',
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
