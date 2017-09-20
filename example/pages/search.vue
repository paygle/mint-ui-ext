<template>
  <div class="page-search">
    <mt-search autofocus v-model="value" :query="query" :loading.sync="loading">
      <template scope="scope">
        <div class="search-item" v-for="(item, index) in scope.result" :key="index" v-text="item"></div>
      </template>
    </mt-search>
  </div>
</template>

<script>
export default {
  name: 'page-search',

  data() {
    return {
      value: '',
      loading: false,
      defaultResult: [
        {'Apple': 1 },
        {'Banana': 2 },
        {'Orange': 3 },
        {'Durian': 4 },
        {'Lemon': 5 },
        {'Peach': 6 },
        {'Cherry': 7 },
        {'Berry': 8 },
        {'Core': 9 },
        {'Fig': 10 },
        {'Haw': 11 },
        {'Melon': 12 },
        {'Plum': 13 },
        {'Pear': 14 },
        {'Peanut': 15 },
        {'Other': 16 }
      ]
    };
  },

  methods: {
    query(val, filter, isloading) {
      setTimeout(()=>{
        this.loading = false; 
      }, 2000);
      return filter(this.defaultResult, val);
    }
  }
};
</script>

<style lang="css">
  .page-search {
    height: 100%;
  }
  .search-item{
    line-height: 28px;
    text-indent: 1em;
  }
</style>
