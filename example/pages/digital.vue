<template>
  <div class="page-digital">
    <div class="page-title">Digital</div>
    <div class="page-part">
      <mo-digital
        label="数字格式化"
        placeholder="请输入数字"
        type="number"
        v-model="num"
        :precision="5"
        :validate="validate"
        @update-validate="updateValidate" formated>
      </mo-digital>
      <mo-digital
        label="百分比"
        placeholder="请输入数字"
        type="percent"
        v-model="num"
        :precision="1"
        :validate="validate"
        @update-validate="updateValidate">
      </mo-digital>
      <mo-digital
        label="千分比"
        placeholder="请输入数字"
        type="permillage"
        v-model="num"
        :precision="1"
        :validate="validate"
        @update-validate="updateValidate">
      </mo-digital>
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
      num: 478211.12,
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
