<template>
  <div class="page-poplist">
    <h1 class="page-title">Poplist</h1>
    <div class="page-poplist-wrapper">
      <mt-field label="选择输入" v-model="content">
        <img @click="changePop" src="../assets/more.png" height="30px" width="30px">
      </mt-field>
    </div>
    <mo-poplist 
      v-model="isOpen"
      :query="content" 
      :data="defaultResult" 
      filter-field="name"
      @changed="selectChanged">
      <template scope="scope">
         <div class="list-item" v-for="(item, index) in scope.data" :key="index" v-text="item.name" @click="scope.getContent(item)"></div>
      </template>
    </mo-poplist>
  </div>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        isOpen: false,
        content: '',
        defaultResult: [
          {name: 'Apple'},
          {name: 'Banana'},
          {name: 'Orange'},
          {name: 'Durian'},
          {name: 'Lemon'},
          {name: 'Peach'},
          {name: 'Cherry'},
          {name: 'Berry'},
          {name: 'Core'},
          {name: 'Fig'},
          {name: 'Haw'},
          {name: 'Melon'},
          {name: 'Plum'},
          {name: 'Pear'},
          {name: 'Peanu'},
          {name: 'Other'}
        ]
        // ,defaultResult: [
        //   'Apple',
        //   'Banana',
        //   'Orange',
        //   'Durian',
        //   'Lemon',
        //   'Peach',
        //   'Cherry',
        //   'Berry',
        //   'Core',
        //   'Fig',
        //   'Haw',
        //   'Melon',
        //   'Plum',
        //   'Pear',
        //   'Peanu',
        //   'Other'
        // ]
      };
    },
    methods: {
      selectChanged(item) {
        this.content = item.name || item;
      },
      log(s) {
        console.log('Scope:', s);
      },
      changePop() {
        this.isOpen = !this.isOpen;
      }
    }
  };
</script>

<style>
  @component-namespace page {
    @component poplist {
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