<template>
  <div class="mo-address">
    <x-cell
      class="mo-field"
      :title="label"
      :err-msg="errMsg"
      :is-invalid="isInvalid"
      :is-required="isRequired"
      :class="[{'is-nolabel': !label}]">
      <input
        ref="input"
        type="text"
        class="mo-field-core"
        @click="showPicker"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="updateLabel"
        readonly>
      <div
        @click="handleClear"
        class="mo-field-clear"
        v-if="!disableClear"
        v-show="updateLabel">
        <i class="mintui mintui-field-error"></i>
      </div>
      <span class="mo-field-state" v-if="state" :class="['is-' + state]">
        <i class="mintui" :class="['mintui-field-' + state]"></i>
      </span>
      <div class="mo-field-other">
        <slot></slot>
      </div>
    </x-cell>
    <mt-popup v-model="visible" position="bottom" class="mo-address-popup">
      <mt-picker
        :slots="addressSlots"
        @change="onAddressChange"
        v-on:touchmove.stop
        :visible-item-count="visibleItemCount"
        class="mo-address-picker"
        ref="picker"
        show-toolbar>
        <span class="mo-address-action mo-address-cancel" @click="visible = false;$emit('cancel')">{{ cancelText }}</span>
        <span class="mo-address-action mo-address-confirm" @click="confirm">{{ confirmText }}</span>
      </mt-picker>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
import XCell from 'mint-ui/packages/cell/index.js';
import MtPopup from 'mint-ui/packages/popup/index.js';
import MtPicker from 'mint-ui/packages/picker/index.js';
import validator from 'mint-ui/src/mixins/validator';
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/packages/address/style.css');
}

export default {
  name: 'mo-address',

  componentName: 'address',

  mixins: [validator],

  components: {
    XCell,
    MtPopup,
    MtPicker
  },

  props: {
    value: {},
    data: Array,
    label: {
      type: String,
      default: '省市区'
    },
    placeholder: {
      type: String,
      default: '请选择省市区'
    },
    disabled: Boolean,
    disableClear: Boolean,
    state: {
      type: String,
      default: 'default'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    visibleItemCount: {
      type: Number,
      default: 7
    }
  },

  data() {
    return {
      innerData: [],
      active: false,
      visible: false,
      isClear: false,
      provinces: [],
      cityes: [],
      areas: [],
      cityData: [],
      areaData: [],
      provinceVal: '',
      cityVal: '',
      areaVal: '',
      provinceLabel: '',
      cityLabel: '',
      areaLabel: '',
      addressSlots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot4'
        }, {
          flex: 1,
          values: [],
          className: 'slot5',
          textAlign: 'center'
        }
      ],
      isFirst: true
    };
  },

  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val) && val.length) {
          this.innerData = val;
          this.setDataVal('p', val, this.provinceLabel);
        }
      }
    },
    value: {
      immediate: true,
      handler(n, o) {
        this.goValid = true;
        if (typeof n === 'string' && n !== o) {
          let v = n.split('-') || [];
          this.setValues(v[0], v[1], v[2]);
        }
        this.$nextTick(()=>{
          if (this.validate) this.validateFields();  // 监控验证
        });
      }
    }
  },

  created() {
    this.initValidators();  // 初始化验证
  },

  mounted() {
    if (Array.isArray(window.ADDRESS_CACHE_DATA)) {
      this.innerData = window.ADDRESS_CACHE_DATA;
      this.setDataVal('p', this.innerData, this.provinceLabel);
    } 
    this.$nextTick(()=>this.updateChange());
  },

  methods: {
    showPicker() {
      this.visible = !this.visible;
    },

    handleClear() {
      if (this.disabled) return;
      this.isClear = true;
      this.provinceLabel = '';
      this.cityLabel = '';
      this.areaLabel = '';
      this.provinceVal = '';
      this.cityVal = '';
      this.areaVal = '';
      this.cityes = [];
      this.areas = [];
      this.setDataVal('p', this.innerData, this.provinceLabel);
      this.$emit('input', '');
    },
    
    confirm() {
      this.visible = false;
      if (this.isClear) {
        let v = this.$refs.picker.getValues();
        this.provinceLabel = v[0];
        this.cityLabel = v[1];
        this.areaLabel = v[2];
        this.setDataVal('p', this.innerData, v[0]);
        this.setDataVal('c', this.cityData, v[1]);
        this.setDataVal('a', this.areaData, v[2]);
      }
      this.$emit('input', this.currentValue);
      this.$nextTick(()=>{ this.isClear = false; });
    },

    onAddressChange(picker, val) {
      this.updateChange(picker, val);
    },

    updateChange(picker, val) {
      picker = picker || this.$refs.picker;
      val = Array.isArray(val) ? val : [];
      let province = this.provinceLabel = val[0] || this.provinceLabel;
      let city = this.cityLabel = val[1] || this.cityLabel;
      let area = this.areaLabel = val[2] || this.areaLabel;

      if (Array.isArray(this.innerData)) {

        this.setDataVal('p', this.innerData, province);

        if (province) {  // 省选择
          this.provinceLabel = province;
          picker.setSlotValues(0, this.provinces);
          picker.setSlotValue(0, province);
          this.setDataVal('c', this.cityData, city);

          if (city) { // 市选择
            
            if (this.cityData.length === 0) {
              this.cityLabel = '';
              this.cityVal = '';
              picker.setSlotValues(1, []);
              picker.setSlotValue(1, '');
            } else {
              this.cityLabel = city;
              picker.setSlotValues(1, this.cityes);
              picker.setSlotValue(1, city);
            }

            this.setDataVal('a', this.areaData, area);

            if (area) {  // 区选择
              if (this.cityData.length === 0) {
                this.areaLabel = '';
                this.areaVal = '';
                picker.setSlotValues(2, []);
                picker.setSlotValue(2, '');
              } else {
                this.areaLabel = area;
                picker.setSlotValues(2, this.areas);
                picker.setSlotValue(2, area);
              }

            } else if (Array.isArray(this.areas)) {
              picker.setSlotValues(2, this.areas);
            }
          } else if (Array.isArray(this.cityes)) {
            picker.setSlotValues(1, this.cityes);
          }

        } else if (Array.isArray(this.provinces)) {
          picker.setSlotValues(0, this.provinces);
        }
      }
    },
    // 代码转中文
    setValues(province, city, area) {

      if (Array.isArray(this.innerData)) {
        let data = this.innerData;
        let item, subitem, ssub;

        for (let pp in data) { // 省
          item = data[pp];

          if (item.c_area_code === province) {
            this.provinceLabel = item.c_area_cname;
            this.provinceVal = item.c_area_code;
            
            if (Array.isArray(item.sub) && typeof city === 'string') {

              this.cityData = item.sub;
              for (let cc in item.sub) {  // 市
                subitem = item.sub[cc];

                if (subitem.c_area_code === city) {
                  this.cityLabel = subitem.c_area_cname;
                  this.cityVal = subitem.c_area_code;
                  if (Array.isArray(subitem.sub) && typeof area === 'string') {

                    this.areaData = subitem.sub;
                    for (let aa in subitem.sub) {  // 区
                      ssub = subitem.sub[aa];

                      if (ssub.c_area_code === area) {
                        this.areaLabel = ssub.c_area_cname;
                        this.areaVal = subitem.c_area_code;
                        break;
                      }
                    }
                  }
                  break;
                }
              }
            }
            break;
          }
        }
        this.setDataVal('p', this.innerData, this.provinceLabel);
      }
    },
    // 设置数据和值
    setDataVal(flag, data, text) {
      if (Array.isArray(data)) {
        let item;
        if (flag === 'p') {
          this.provinces = [];
        } else if (flag === 'c') {
          this.cityes = [];
        } else if (flag === 'a') {
          this.areas = [];
        } 
        
        for (let i in data) { // 数据
          item = data[i];

          if (flag === 'p') {
            this.provinces.push(item['c_area_cname']);
          } else if (flag === 'c') {
            this.cityes.push(item['c_area_cname']);
          } else if (flag === 'a') {
            this.areas.push(item['c_area_cname']);
          } 
          
          if (text && text !== '' && item.c_area_cname === text) {
            // 选中值子数据赋值
            if (Array.isArray(item.sub)) {
              if (flag === 'p') {
                this.cityData = item.sub;
              } else if (flag === 'c') {
                this.areaData = item.sub;
              }
            } else {
              if (flag === 'p') {
                this.cityData = [];
                this.areaData = [];
              } else if (flag === 'c') {
                this.areaData = [];
              }
            }
            // 选中值赋值
            if (flag === 'p') {
              this.provinceLabel = item.c_area_cname;
              this.provinceVal = item.c_area_code;
            } else if (flag === 'c') {
              this.cityLabel = item.c_area_cname;
              this.cityVal = item.c_area_code;
            } else if (flag === 'a') {
              this.areaLabel = item.c_area_cname;
              this.areaVal = item.c_area_code;
            }
          }
        }
        if (flag === 'p' && this.cityes.indexOf(this.cityLabel) === -1) {
          this.cityes = [];
        } else if (flag === 'c' && this.areas.indexOf(this.areaLabel) === -1) {
          this.areas = [];
        }
      }
    },

    setCityes(pv) {
      if (Array.isArray(this.cityData) && this.cityData.length) {
        this.setDataVal('c', this.cityData, this.cityLabel);
      }
    },

    setAreas(cv) {
      if (Array.isArray(this.areaData) && this.areaData.length) {
        this.setDataVal('a', this.areaData, this.areaLabel);

      }
    }
  },

  computed: {
    currentLabel() {
      if (this.provinceLabel && this.cityLabel && this.areaLabel) {
        return this.provinceLabel + '/' + this.cityLabel + '/' + this.areaLabel;
      } else if (this.provinceLabel && this.cityLabel) {
        return this.provinceLabel + '/' + this.cityLabel;
      } else if (this.provinceLabel) {
        return this.provinceLabel;
      } else {
        return '';
      }
    },
    updateLabel() {
      if (this.isClear) {
        return '';
      } else {
        return this.currentLabel;
      }
    },
    currentValue() {
      if (this.provinceVal && this.cityVal && this.areaVal) {
        return this.provinceVal + '-' + this.cityVal + '-' + this.areaVal;
      } else if (this.provinceVal && this.cityVal) {
        return this.provinceVal + '-' + this.cityVal;
      } else if (this.provinceVal) {
        return this.provinceVal;
      } else {
        return '';
      }
    }
  }
};
</script>

<style>
  @import "../../../src/style/var.css";

  @component-namespace mo {

    @component address {
    
      @descendent popup {
        width: 100%;
      }

      .picker-slot-wrapper, .picker-item {
        backface-visibility: hidden;
        font-size: 13px;
      }

      .picker-toolbar {
        border-bottom: solid 1px #eaeaea;
      }

      @descendent action {
        display: inline-block;
        width: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        color: $color-blue;
      }

      @descendent cancel {
        float: left;
      }

      @descendent confirm {
        float: right;
      }
    }
    

    @component field {
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
