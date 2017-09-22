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
    drawArrows() {
      if (this.$refs.canv) {
        let canv = this.$refs.canv, steps = this.steps;
        let hw = this.$refs.canv.getBoundingClientRect();
        let lW = this.lineWidth, lC = this.lineColor, lAlen = 5, angle = 35;
        let stepW = hw.width / steps, stepWhalf = stepW / 2;
        let circleW = hw.height * this.boxSize, circleWhalf = circleW / 2;
        let Y = hw.height / 2, arrows = [], pre, item, gap = 3;
 
        for (let i = 0; i < steps - 1; i++) {
          if (i === 0) {
            item = {x1: stepW / 2, x2: stepW + stepWhalf - circleWhalf - gap};
            arrows.push(item);
          } else {
            pre = arrows[i - 1];
            item = {x1: pre.x2 + circleWhalf, x2: pre.x2 + stepW};
            arrows.push(item);
          }
          this.drawArrow(canv, item.x1, Y, item.x2, Y, angle, lAlen, lW, lC);
        }
      }
    },

    // 绘制箭头
    drawArrow(ctxdom, fromX, fromY, toX, toY, theta, headlen, width, color) {

      theta = typeof theta !== 'undefined' ? theta : 30; 
      headlen = typeof headlen !== 'undefined' ? headlen : 8; 
      width = typeof width !== 'undefined' ? width : 2; 
      color = typeof color !== 'undefined' ? color : this.lineColor; 

      let ctx = ctxdom ? ctxdom.getContext('2d') : null, arrowX, arrowY,
        angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI, 
        angle1 = (angle + theta) * Math.PI / 180, 
        angle2 = (angle - theta) * Math.PI / 180, 
        topX = headlen * Math.cos(angle1), 
        topY = headlen * Math.sin(angle1), 
        botX = headlen * Math.cos(angle2), 
        botY = headlen * Math.sin(angle2); 

      if (!ctx) return;
      ctx.save(); 
      ctx.beginPath(); 

      // arrowX = fromX - topX;
      // arrowY = fromY - topY; 
      // ctx.moveTo(arrowX, arrowY); 
      // ctx.lineTo(fromX, fromY); 
      arrowX = fromX - botX; 
      arrowY = fromY - botY; 
      ctx.lineTo(arrowX, arrowY); 
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY); // other side 
      ctx.strokeStyle = color; 
      ctx.lineWidth = width; 
      ctx.stroke();

      ctx.beginPath();
      arrowX = toX + topX; 
      arrowY = toY + topY; 
      ctx.moveTo(arrowX, arrowY); 
      ctx.lineTo(toX, toY); 
      arrowX = toX + botX; 
      arrowY = toY + botY; 
      ctx.lineTo(arrowX, arrowY); 
      ctx.closePath();
      ctx.strokeStyle = color; 
      ctx.lineWidth = width; 
      ctx.fillStyle = color;
      ctx.fill();
      ctx.stroke(); 
      ctx.restore(); 
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

      setTimeout(() =>{
       this.drawArrows();
      }, 300);
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
