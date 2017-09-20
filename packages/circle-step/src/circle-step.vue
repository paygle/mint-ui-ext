<template>
  <div class="mo-circle-step">
    <canvas ref="canv" :width="cwidth" :height="cheight"></canvas>
    <a class="link"
      v-for="step in steps"
      :key="step"
      :href="getLink(step)"
      @click="linkClick"
      :style="{width: width}">
      <step-cell :val="step" :actived="value === step"></step-cell>
    </a>
  </div>
</template>
<script>
import StepCell from './step-cell';
/**
 * mo-circle-step
 * 
  value [Number]             // 当前激活进度值
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
function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    element.style[styleName] = value;
  }
};

export default {
  name: 'MoCircleStep',

  components: {
    StepCell
  },

  props: {
    value: {
      type: Number,
      default: 1
    },
    steps: {               // 进度数
      type: Number,
      default: 5
    },
    height: {
      type: Number,
      default: 28
    },
    boxSize: {
      type: Number,
      default: 0.8
    },
    setting: {            // 背景和颜色
      type: Array,
      default() {
        return [
          {
            background: '#ccc',
            color: '#000',
            activedbg: '#00f',
            activedColor: '#fff'
          }
        ];
      }
    },
    lineWidth: {
      type: Number,
      default: 1
    },
    lineColor: {
      type: String,
      default: '#ccc'
    },
    links: Array,         // 各Step链接地址
    isLink: Boolean
  },

  data() {
    return {
      cwidth: 0,
      cheight: 0,
      width: '30px',
      spanWH: {}
    };
  },

  methods: {
    drawLine() {
      if (this.$refs.canv && this.$refs.canv.getContext('2d')) {
        let canv = this.$refs.canv.getContext('2d');
        let hw = this.$refs.canv.getBoundingClientRect();
        let w = (hw.width / this.steps) / 2;
        let h = hw.height / 2;

        if (canv && hw) {
          canv.beginPath();
          canv.moveTo(w, h);
          canv.lineTo(hw.width - w, h);
          canv.strokeStyle = this.lineColor;
          canv.lineWidth = this.lineWidth;
          canv.stroke();
        }
      }
    },

    updateSpanWH() {
      let elW = this.$el.getBoundingClientRect().width;
      let spans = this.$el.querySelectorAll('span');
      let w = elW / this.steps;
      let size = w * this.boxSize;
      let spanWH = {};
      this.width = w + 'px';
      this.cwidth = elW;
      this.cheight = this.height;

      if (size > this.height) {
        spanWH = {
          width: this.height + 'px',
          height: this.height + 'px',
          lineHeight: this.height + 'px',
          borderRadius: (this.height / 2) + 'px'
        };
      } else {
        spanWH = {
          width: size + 'px',
          height: size + 'px',
          lineHeight: size + 'px',
          borderRadius: (size / 2) + 'px'
        };
      }

      for (let i = 0; i < spans.length; i++) {
        setStyle(spans[i], spanWH);
      }

      setTimeout(() => this.drawLine(), 300);
    },

    getLink(index) {
      if (Array.isArray(this.links)) {
        let links = this.links;
        if (typeof links[index] === 'string' && links[index] !== '') {
          return links[index];
        }
        return location.href;
      }
      return location.href;
    },

    linkClick(e) {
      if (!this.isLink) {
        e.preventDefault();
      }
    }
  },

  mounted() {
    this.$nextTick(()=>{
      this.updateSpanWH();
    });
  }
};
</script>

<style lang="css">
  @import "../../../src/style/var.css";

  @component-namespace mo {
    @component circle-step {
      position: relative;
      overflow: hidden;

      canvas {
         position: absolute;
         z-index: 0;
         left: 0;
         top: 0;
      }

      a {
        position: relative;
        z-index: 10;
        display: block;
        text-decoration: none;
        float: left;

        span {
          display: block;
          margin: 0 auto;
          font-size: 12px;
          text-align: center;
        }
      }

    }
  }
</style>
