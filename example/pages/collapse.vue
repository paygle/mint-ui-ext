<template>
  <div class="page-collapse">
    <h1 class="page-title">collapse</h1>
    <div class="page-collapse-wrapper">
      <mo-collapse v-model="collapse">
        <mo-collapse-item>
          <div slot="title">Vue 从根本上采用最小成本</div>
          <div slot="content">官方指南会预先假定你已具有 HTML、CSS 和 JavaScript 的中级知识水平。如果你刚开始学习前端开发，跳过基础知识，将框架作为你的起步可能不是最好的主意 - 掌握好基础知识再来！之前有其他框架的使用经验，对于学习 Vue.js 会有所帮助，但这不是必需的。</div>
        </mo-collapse-item>
        <mo-collapse-item>
          <div slot="title">Vue 模板语法</div>
          <div slot="content">Vue.js 使用基于 HTML 的模板语法，允许声明式地将要渲染的 DOM 和 Vue 实例中的 data 数据绑定。所有 Vue.js 的模板都是有效的 HTML，能够被遵循规范的浏览器和 HTML 解析器解析。
在底层的实现上，Vue 将模板编译为虚拟 DOM 渲染函数。结合响应式系统，在应用程序状态改变时，Vue 能够智能地找出重新渲染的最小量的组件，并应用最少量的 DOM 操作</div>
        </mo-collapse-item>
        <mo-collapse-item>
          <div slot="title">Vue 事件修饰符</div>
          <div slot="content">在事件处理程序中调用 event.preventDefault() 或 event.stopPropagation() 是非常常见的需求。尽管我们可以在 methods 中轻松实现这点，但更好的方式是：methods 只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。</div>
        </mo-collapse-item>
        <mo-collapse-item>
          <div slot="title">Vue 自定义指令</div>
          <div slot="content">除了 Vue 核心携带着的一些默认指令（v-model 和 v-show）之外，Vue 还允许你注册自己的自定义指令。请注意，在 Vue 2.0 中，代码重用和抽象(reuse and abstraction)的主要是以组件的形式 - 但是，可能某些情况下，还是需要对普通元素进行一些底层 DOM 访问，这也是自定义指令仍然有其使用场景之处。接着来看一个在输入元素获取焦点的示例</div>
        </mo-collapse-item>
      </mo-collapse>
    </div>
  </div>
</template>

<style>
  @component-namespace page {
    @component collapse {
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
      return {
        collapse: [0]
      };
    }
  };
</script>
