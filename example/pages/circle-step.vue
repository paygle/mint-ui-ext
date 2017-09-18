<template>
  <div class="page-circle-step">
    <div class="page-title">Circle Step</div>
    <mo-circle-step 
      v-model="actived" 
      :steps="steps"
      :links="links"
      @step-click="cirecleClick">
    </mo-circle-step>
  </div>
</template>

<script>
/**
 * value [Number]             // 当前激活进度值
   steps [Number]   5         // 进度数
   height [Number]  28        // 高度
  boxSize [Number] 0.8        // 圆高比值
  setting [Array]             // 背景和颜色
   [{ background: '#ccc', color: '#000', activedbg: '#00f', activedColor: '#fff' } ]

  lineWidth [Number] 1        // 线条宽度
  lineColor [String] '#ccc'   // 线条颜色
  links [Array] Array         // 各Step链接地址
  isLink [Boolean]            // 是否链接点击有效
 */

export default {
  name: 'page-circle-step',

  data() {
    return {
      steps: 5,
      actived: 1,
      links: [
        '/',
        '/bb'
      ]
    };
  },

  methods: {
    cirecleClick(index) {
      console.log('cirecleClick', index);
    }
  }
};
</script>

<style lang="css">
  .page-circle-step {
    margin-top: 40px;
  }
  .page-title{
    line-height: 38px;
    text-align: center;
    font-size: 18px;
  }
</style>

