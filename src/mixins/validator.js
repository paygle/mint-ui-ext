// 验证系统

export default {

  props: {
    field: String,             // 字段名称
    validate: [Array, Object]  // 验证对象 
  },

  data() {
    return {
      validators: null,   // 验证规则组
      currentField: '',
      goValid: true,      // 是否去验证
      isInvalid: false,   // 验证无效显示状态
      errMsg: '',
      isRequired: false   // 是否必填
    };
  },

  methods: {
    
    initValidators() { // 获取验证对象
      if (Array.isArray(this.validate) && this.field) {
        let validObj = null, field = this.field;
        this.validate.forEach((item)=>{
          if (field === item.field) { validObj = item; }
        }); 
        // 是否必填
        if (validObj && validObj.required) { this.isRequired = true; }
        this.validators = validObj;
      } else if (!Array.isArray(this.validate) && typeof this.validate === 'object') {
        // 是否必填
        if (this.validate.required) { this.isRequired = true; }
        this.validators = this.validate;
      }
    },
    // 验证是否通过
    verifySubmit(data) {
      if (typeof data === 'object') {
        for (let prop in data) {
          if (
              data.hasOwnProperty(prop) && 
              typeof data[prop] === 'boolean' && 
              data[prop]
            ) {
            return false;
          }
        }
        return true;
      }
      return true;
    },

    // 自定义验证回调
    customValidate(msg) {
      if (!this.goValid) return;
      this.validateEmit(function() { return typeof msg === 'string'; }, msg);
    },

    // 字段验证
    validateFields() {
      /* 验证规则数据格式
      [
        {
          required: false,     // 仅当前结点有效
          type: 'number',      // 仅当前结点有效,可选：number, date, email, phone, ident
          field: 'name',       // 当前使用 validators 时，仅此字段有效
          rule:/\d/ig, 
          msg:'这个是错的', 
          validator: function(value,callback){ callback(msg);}
          validators: [
            {
              required: false, 
              field: 'name', 
              rule:/\d/ig, 
              msg:'这个是错的', 
              validator: function(value,callback){ callback(msg);}
            }
          ]
        }
      ]
      */

      function runValidator(vd, field, value) {
        // 默认验证方法
        if (vd && typeof vd.validator === 'undefined' && Object.prototype.toString.call(vd.rule) === '[object RegExp]') {
          this.currentField = this.field || field || vd.field;
          if (!this.goValid) return;
          this.validateEmit(function() {
            let result = !vd.rule.test(value);
            vd.rule.lastIndex = 0;
            return result;
          }, vd.msg);

        // 自定义验证方法
        } else if (vd && typeof vd.validator === 'function' && this.goValid) {
          vd.validator.call(null, value, this.customValidate);
        }
      }

      // 多规则处理
      this.$nextTick(()=>{
        let valids = this.validators, that = this;
        let value = this.value;

        // 是否必填
        if (valids && valids.required) {
          if (!this.goValid) return;
          this.currentField = this.field || valids.field;
          this.validateEmit(function() {
            return /^\s+$/.test(value) || typeof value === 'undefined' || value === '';
          }, '本项必填');
        }

        // 数字验证
        if (valids && valids.type === 'number') {
          if (!this.goValid) return;
          this.currentField = this.field || valids.field;
          this.validateEmit(function() {
            return value !== null && value !== '' && !isNaN(Number(value));
          }, '本项只能填数字');

        // 日期验证  
        } else if (valids && valids.type === 'date') {
          if (!this.goValid) return;
          this.currentField = this.field || valids.field;
          this.validateEmit(function() {
            let isInvalid = true;
            if (/^\d{4}\-(([1][0-2])|([0]?[1-9]))\-(([1-2]\d)|([3][0-1])|([0]?[1-9]))(\s?(\s(([1]\d)|([2][0-3])|[0]?\d))(\:(([1-5]\d)|([0]?\d))){1,2})?/g.test(value)) {
              value = value.replace(/\-/ig, '/');
              if (/[0-9\-\/]/g.test(value) && !isNaN((new Date(value)).getTime())) {
                isInvalid = false;
              }
            }
            return isInvalid;
          }, '本项只能填日期，如 2018-01-01 09:09');

        // 邮箱验证  
        } else if (valids && valids.type === 'email') {
          if (!this.goValid) return;
          this.currentField = this.field || valids.field;
          this.validateEmit(function() {
            let isInvalid = true;
            if (/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,6}(\.[a-z]{2})?)$/g.test(value)) {
              isInvalid = false;
            }
            return isInvalid;
          }, '本项只能填邮箱, 如 xxx@xx.com');

        // 手机验证  
        } else if (valids && valids.type === 'phone') {
          if (!this.goValid) return;
          this.currentField = this.field || valids.field;
          this.validateEmit(function() {
            let isInvalid = true;
            if (/^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/g.test(value)) {
              isInvalid = false;
            }
            return isInvalid;
          }, '本项只能填手机号，如 13812345678');

        // 身份证验证  
        } else if (valids && valids.type === 'ident') {
          if (!this.goValid) return;
          this.currentField = this.field || valids.field;
          this.validateEmit(function() {
            let isInvalid = true;
            if (/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/g.test(value)) {
              // 18位验证
              isInvalid = false;
            } else if (/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/g.test(value)) {
              // 15位验证
              isInvalid = false;
            }
            return isInvalid;
          }, '本项只能填身份证号');
        }

        // 其他验证
        if (valids && Array.isArray(valids.validators)) {
          valids.validators.forEach((item)=>{
            if (this.goValid) runValidator.call(that, item, valids.field, value);
          });
        } else if (valids) {
          runValidator.call(that, valids, valids.field, value);
        }
      });
    },
    // 验证提示
    validateEmit(getIsInvalid, msg) {
      if (getIsInvalid()) {
        this.isInvalid = true;  // 验证未通过，显示错误
        this.errMsg = msg;
        this.goValid = false;
        this.$emit('update-validate', this.currentField, true, msg);
        // console.log('update valid-error', this.currentField, this.isInvalid);
      } else {
        this.isInvalid = false;  // 验证有效
        this.errMsg = '';
        this.$emit('update-validate', this.currentField, false);
        // console.log('update valid-ok', this.currentField, this.isInvalid);
      }
    }
  }
};
