<template>
  <transition-group
    tag="ul"
    :class="[
      'mt-upload-list',
      'mt-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="mt-list"
  >
    <li
      v-for="(file, index) in files"
      :class="['mt-upload-list-item', 'is-' + file.status]"
      @click="closeStatus"
      :key="index"
    >
      <img
        class="mt-upload-list-item-thumbnail"
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url" alt=""
      >
      <label class="mt-upload-list-item-status-label" :style="statusHover">
        <i :class="{
          'mintui-upload-success': true,
          'mintui-cirhook': listType === 'text',
          'mintui-hook': ['picture-card', 'picture'].indexOf(listType) > -1
        }"></i>
      </label>
      <a class="mt-upload-list-item-name" @click="handleClick(file)">
        <i class="mintui-document"></i>{{file.name}}
      </a>
      <i class="mintui-close" v-if="!disabled" @click="$emit('remove', file)"></i>
      <mt-progress
        v-if="file.status === 'uploading'"
        :value="parsePercentage(file.percentage)">
      </mt-progress>
      <span class="mt-upload-list-item-actions" v-if="listType === 'picture-card'">
        <span
          class="mt-upload-list-item-preview"
          v-if="handlePreview && listType === 'picture-card'"
          @click="handlePreview(file)"
        >
          <i class="mintui-view"></i>
        </span>
        <span
          v-if="!disabled"
          class="mt-upload-list-item-delete"
          @click="$emit('remove', file)"
        >
          <i class="mintui-delete2"></i>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
  import MtProgress from 'mint-ui/packages/progress';

  export default {
    components: { MtProgress },

    props: {
      files: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String
    },
    data() {
      return {
        statusHover: {}
      };
    },
    methods: {
      closeStatus() {
        this.statusHover = {display: 'none'};
      },
      parsePercentage(val) {
        return parseInt(val, 10);
      },
      handleClick(file) {
        this.handlePreview && this.handlePreview(file);
      }
    }
  };
</script>
