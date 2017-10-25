<template>
  <a class="mint-cell" :href="href">
    <span class="mint-cell-mask" v-if="isLink"></span>
    <div class="mint-cell-left">
      <slot name="left"></slot>
    </div>
    <div class="mint-cell-wrapper">
      <div class="mint-cell-content">
        <div class="mint-cell-title" :class="{'is-required': isRequired}">
          <slot name="icon">
            <i v-if="icon" class="mintui" :class="'mintui-' + icon"></i>
          </slot>
          <slot name="title">
            <span class="mint-cell-text" v-text="title"></span>
            <span v-if="label" class="mint-cell-label" v-text="label"></span>
          </slot>
        </div>
        <div 
          class="mint-cell-value validate-box" 
          :class="{ 'is-link' : isLink, 'is-invalid': isInvalid }">
          <slot>
            <span v-text="value"></span>
          </slot>
        </div>
      </div>
      <div class="mint-cell-validate" v-if="isInvalid && errMsg"  v-text="errMsg"></div>
    </div>
    <div class="mint-cell-right">
      <slot name="right"></slot>
    </div>
    <i v-if="isLink" class="mint-cell-allow-right"></i>
  </a>
</template>

<script>
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/packages/font/style.css');
}

/**
 * mt-cell
 * @module components/cell
 * @desc 单元格
 * @param {string|Object} [to] - 跳转链接，使用 vue-router 的情况下 to 会传递给 router.push，否则作为 a 标签的 href 属性处理
 * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .mintui-xxx）
 * @param {string} [title] - 标题
 * @param {string} [label] - 备注信息
 * @param {boolean} [is-link=false] - 可点击的链接
 * @param {string} [value] - 右侧显示文字
 * @param {slot} - 同 value, 会覆盖 value 属性
 * @param {slot} [title] - 同 title, 会覆盖 title 属性
 * @param {slot} [icon] - 同 icon, 会覆盖 icon 属性，例如可以传入图片
 *
 * @example
 * <mt-cell title="标题文字" icon="back" is-link value="描述文字"></mt-cell>
 * <mt-cell title="标题文字" icon="back">
 *   <div slot="value">描述文字啊哈</div>
 * </mt-cell>
 */
export default {
  name: 'mt-cell',

  props: {
    to: [String, Object],
    icon: String,
    title: String,
    label: String,
    isLink: Boolean,
    isInvalid: Boolean,  // 验证无效显示状态
    isRequired: Boolean,  // 是否必填
    errMsg: String,      // 验证错误提示内容
    value: {}
  },

  computed: {
    href() {
      if (this.to && !this.added && this.$router) {
        const resolved = this.$router.match(this.to);
        if (!resolved.matched.length) return this.to;

        this.$nextTick(() => {
          this.added = true;
          this.$el.addEventListener('click', this.handleClick);
        });
        return resolved.path;
      }
      return this.to;
    }
  },

  methods: {
    handleClick($event) {
      $event.preventDefault();
      this.$router.push(this.href);
    }
  }
};
</script>

<style lang="css">
  @import "../../../src/style/var.css";

  @component-namespace mint {
    @component cell {
      background-color: $color-white;
      box-sizing: border-box;
      color: inherit;
      min-height: 48px;
      display: block;
      overflow: hidden;
      position: relative;
      text-decoration: none;

      &:first-child {
        .mint-cell-wrapper {
          background-origin: border-box;
        }
      }

      &:last-child {
        /* 影响 android 和 火狐浏览器 多出背景线条
        background-image: linear-gradient(0deg, $color-grey, $color-grey 50%, transparent 50%);
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: bottom; */ 
      }

      @descendent wrapper {
        flex-flow: column;
        /* 影响 android 和 火狐浏览器 多出背景线条
        background-image:linear-gradient(180deg, $color-grey, $color-grey 50%, transparent 50%);
        background-size: 120% 1px;
        background-repeat: no-repeat;
        background-position: top left;
        background-origin: content-box; */
        align-items: center;
        box-sizing: border-box;
        display: flex;
        font-size: 14px;
        line-height: 1;
        min-height: inherit;
        overflow: auto;
        padding: 0 10px;
        width: 100%;
      }

      @descendent content {
        display: flex;
        flex: 1;
        width: 100%;
        line-height: unset;
        align-items: center;
      }

      @descendent validate{
        display: flex;
        flex: 1;
        width: 100%;
        justify-content: flex-end;
        flex: 0.4;
        font-size: 14px;
        color: red;
        padding: 3px 0;
        margin-bottom: 5px;
      }

      @descendent mask {
        &::after {
          background-color: #000;
          content: " ";
          opacity: 0;
          position: absolute 0;
        }

        &:active::after {
          opacity: .1;
        }
      }

      @descendent text {
        vertical-align: middle;
      }

      @descendent label {
        color: #888;
        display: block;
        font-size: 12px;
        margin-top: 6px;
      }

      img {
        vertical-align: middle;
      }

      @descendent title {
        flex: 1;
        line-height: 26px;

        &.is-required::after {
          content: '*';
          color: red;
        }
      }

      @descendent value {
        color: $cell-value-color;
        display: flex;
        align-items: center;

        @when link {
          margin-right: 24px;
        }

        @when invalid {
          &.validate-box, .validate-box{
            background-color: #fff;
            box-shadow: inset 0px 0px 5px #ff2020;
            border-radius: 4px;
            padding: 3px 5px;
          }
        }
      }

      @descendent left {
        position: absolute;
        height: 100%;
        left: 0;
        transform: translate3d(-100%, 0, 0);
      }

      @descendent right {
        position: absolute;
        height: 100%;
        right: 0;
        top: 0;
        transform: translate3d(100%, 0, 0);
      }

      @descendent allow-right::after {
        border: solid 2px $border-color;
        border-bottom-width: 0;
        border-left-width: 0;
        content: " ";
        position: absolute 50% 20px * *;
        size: 5px;
        transform: translateY(-50%) rotate(45deg);
      }
    }
  }
</style>
