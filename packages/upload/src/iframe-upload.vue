<template>
  <div
    class="mint-upload"
    :class="'mint-upload--' + listType"
    @click="handleClick"
    @drop.native="onDrop"
    @dragover.native="handleDragover"
    @dragleave.native="handleDragleave"
  >
    <iframe
      @load="onload"
      ref="iframe"
      :name="frameName">
    </iframe>
    <form ref="form" 
      :action="action" 
      :target="frameName"
      enctype="multipart/form-data" 
      method="POST">
        <input
          class="mint-upload-input"
          type="file"
          ref="input"
          name="file"
          @change="handleChang"
          :accept="accept">
        </input>
        <input type="hidden" name="documentDomain" value="this.$isServer ? '' : document.domain" />
      <span ref="data"></span>
    </form>
    <upload-dragger 
      v-if="drag" 
      @file="uploadFiles" 
      :disabled="disabled">
      <slot></slot>
    </upload-dragger>
    <slot v-else></slot>
  </div>
</template>

<script>
import UploadDragger from './upload-dragger.vue';

export default {
  components: {
    UploadDragger
  },
  props: {
    type: String,
    data: {},
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    withCredentials: Boolean,
    accept: String,
    onStart: Function,
    onProgress: Function,
    onSuccess: Function,
    onError: Function,
    beforeUpload: Function,
    onPreview: {
      type: Function,
      default: function() {}
    },
    onRemove: {
      type: Function,
      default: function() {}
    },
    drag: Boolean,
    listType: String,
    disabled: Boolean
  },

  data() {
    return {
      mouseover: false,
      domain: '',
      file: null,
      submitting: false
    };
  },

  methods: {
    isImage(str) {
      return str.indexOf('image') !== -1;
    },
    handleClick() {
      if (!this.disabled) {
        this.$refs.input.click();
      }
    },
    handleChange(ev) {
      const file = ev.target.value;
      if (file) {
        this.uploadFiles(file);
      }
    },
    uploadFiles(file) {
      if (this.submitting) return;
      this.submitting = true;
      this.file = file;
      this.onStart(file);

      const formNode = this.getFormNode();
      const dataSpan = this.getFormDataNode();
      let data = this.data;
      if (typeof data === 'function') {
        data = data(file);
      }
      const inputs = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          inputs.push(`<input name="${key}" value="${data[key]}"/>`);
        }
      }
      dataSpan.innerHTML = inputs.join('');
      formNode.submit();
      dataSpan.innerHTML = '';
    },
    getFormNode() {
      return this.$refs.form;
    },
    getFormDataNode() {
      return this.$refs.data;
    }
  },

  created() {
    this.frameName = 'frame-' + Date.now();
  },

  mounted() {
    const self = this;
    !this.$isServer && window.addEventListener('message', (event) => {
      if (!self.file) return;
      var targetOrigin = new URL(self.action).origin;
      if (event.origin !== targetOrigin) return;
      var response = event.data;
      if (response.result === 'success') {
        self.onSuccess(response, self.file);
      } else if (response.result === 'failed') {
        self.onError(response, self.file);
      }
      self.submitting = false;
      self.file = null;
    }, false);
  }
};
</script>
