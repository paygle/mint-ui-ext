<template>
  <div class="page-poplist">
    <h1 class="page-title">Poplist</h1>
    <div class="page-poplist-wrapper">
      <mt-field label="选择输入1" v-model="content1">
        <img @click="changePop1" src="../assets/more.png" height="30px" width="30px">
      </mt-field>
      <mt-field label="选择输入2" v-model="content2">
        <img @click="changePop2" src="../assets/more.png" height="30px" width="30px">
      </mt-field>
    </div>
    <mo-poplist 
      v-model="isOpen1"
      :query="content1" 
      :data="defaultResult" 
      filter-field="name"
      @changed="selectChanged1">
      <template scope="scope">
         <div class="list-item" v-for="(item, index) in scope.data" :key="index" v-text="item.name" @click="scope.getContent(item)"></div>
      </template>
    </mo-poplist>
    <mo-poplist 
      v-model="isOpen2"
      :query="content2" 
      :data="defaultResult" 
      filter-field="name"
      @changed="selectChanged2">
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
        isOpen1: false,
        isOpen2: false,
        content1: '',
        content2: '',
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
      selectChanged1(item) {
        this.content1 = item.name || item;
      },
      selectChanged2(item) {
        this.content2 = item.name || item;
      },
      log(s) {
        console.log('Scope:', s);
      },
      changePop1() {
        this.isOpen1 = true;
      },
      changePop2() {
        this.isOpen2 = true;
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