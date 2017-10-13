<template>
  <div class="page-cell">
    <div class="page-title">Cell Swipe</div>
    <mt-cell-swipe
      v-for="n in 10"
      :key="n"
      :right="rightButtons"
      param="param is 10."
      title="swipe me">
    </mt-cell-swipe>
  </div>
</template>

<script>
  export default {
    created() {
      this.rightButtons = [
        {
          content: 'Mark as Unread',
          style: { background: 'lightgray', color: '#fff' }
        },
        {
          content: 'Delete',
          style: { background: 'red', color: '#fff' },
          handler: (e, p) => { 
            this.$messagebox('delete');
            console.log('PARAM:', e, p);
          }
        }
      ];
    },

    methods: {
      leftButtonHandler(evt) {
        console.log(123);
      }
    }
  };
</script>
