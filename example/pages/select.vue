<template>
  <div class="page-select">
    <h1 class="page-title">select</h1>
    <div class="page-select-wrapper">
      <mo-select v-model="select" multiple>
        <mo-option val="1" label="选项1"></mo-option>
        <mo-option val="2" label="选项2"></mo-option>
        <mo-option val="3" label="选项3"></mo-option>
      </mo-select>
    </div>
  </div>
</template>

<style>
  @component-namespace page {
    @component select {
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
        select: ''
      };
    },
    methods: {
      xxx() {
        return false;
      }
    }
  };
</script>
