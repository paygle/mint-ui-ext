<template>
  <div>
    <UploadList
      v-if="showFileList && listType === 'picture-card'"
      :disabled="disabled"
      :listType="listType"
      :files="uploadFiles"
      @remove="handleRemove"
      :handlePreview="onPreview">
    </UploadList>
    <upload v-if="hasFormData" v-bind="uploadData" ref="upload-inner">
      <slot name="trigger"></slot>
      <slot></slot>
    </upload>
    <iframeUpload v-else v-bind="uploadData" ref="upload-inner">
      <slot name="trigger"></slot>
      <slot></slot>
    </iframeUpload>
    <slot name="tip"></slot>
    <UploadList
      v-if="showFileList && listType !== 'picture-card'"
      :disabled="disabled"
      :listType="listType"
      :files="uploadFiles"
      @remove="handleRemove"
      :handlePreview="onPreview">
    </UploadList>
  </div>
</template>

<script type="text/babel">
import UploadList from './upload-list';
import Upload from './upload';
import IframeUpload from './iframe-upload';
import MtProgress from 'mint-ui/packages/progress';
import Migrating from 'mint-ui/src/mixins/migrating';

function noop() {}

export default {
  name: 'MtUpload',

  mixins: [Migrating],

  components: {
    MtProgress,
    UploadList,
    Upload,
    IframeUpload
  },

  provide: {
    uploader: this
  },

  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: 'file'
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: String,
    type: {
      type: String,
      default: 'select'
    },
    beforeUpload: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    onChange: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'text'   // text,picture,picture-card
    },
    httpRequest: Function,
    disabled: Boolean
  },

  data() {
    return {
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1
    };
  },

  watch: {
    fileList: {
      immediate: true,
      handler(fileList) {
        this.uploadFiles = fileList.map(item => {
          item.uid = item.uid || (Date.now() + this.tempIndex++);
          item.status = 'success';
          return item;
        });
      }
    }
  },

  computed: {
    hasFormData() {
      return typeof FormData !== 'undefined' || this.$isServer;
    },

    uploadData() {
      debugger;
      return {
        type: this.type,
        drag: this.drag,
        action: this.action,
        multiple: this.multiple,
        'before-upload': this.beforeUpload,
        'with-credentials': this.withCredentials,
        headers: this.headers,
        name: this.name,
        data: this.data,
        accept: this.accept,
        fileList: this.uploadFiles,
        autoUpload: this.autoUpload,
        listType: this.listType,
        disabled: this.disabled,
        'on-start': this.handleStart,
        'on-progress': this.handleProgress,
        'on-success': this.handleSuccess,
        'on-error': this.handleError,
        'on-preview': this.onPreview,
        'on-remove': this.handleRemove,
        'http-request': this.httpRequest
      };
    }
  },

  methods: {
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++;
      let file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      };

      try {
        file.url = URL.createObjectURL(rawFile);
      } catch (err) {
        console.error(err);
        return;
      }

      this.uploadFiles.push(file);
      this.onChange(file, this.uploadFiles);
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile);
      this.onProgress(ev, file, this.uploadFiles);
      file.status = 'uploading';
      file.percentage = ev.percent || 0;
    },
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile);

      if (file) {
        file.status = 'success';
        file.response = res;

        this.onSuccess(res, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      }
    },
    handleError(err, rawFile) {
      const file = this.getFile(rawFile);
      const fileList = this.uploadFiles;

      file.status = 'fail';

      fileList.splice(fileList.indexOf(file), 1);

      this.onError(err, file, this.uploadFiles);
      this.onChange(file, this.uploadFiles);
    },
    handleRemove(file, raw) {
      debugger;
      if (raw) {
        file = this.getFile(raw);
      }
      this.abort(file);
      let fileList = this.uploadFiles;
      fileList.splice(fileList.indexOf(file), 1);
      this.onRemove(file, fileList);
    },
    getFile(rawFile) {
      let fileList = this.uploadFiles;
      let target;
      fileList.every(item => {
        target = rawFile.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    abort(file) {
      this.$refs['upload-inner'].abort(file);
    },
    clearFiles() {
      this.uploadFiles = [];
    },
    submit() {
      this.uploadFiles
        .filter(file => file.status === 'ready')
        .forEach(file => {
          this.$refs['upload-inner'].upload(file.raw);
        });
    },
    getMigratingConfig() {
      return {
        props: {
          'default-file-list': 'default-file-list is renamed to file-list.',
          'show-upload-list': 'show-upload-list is renamed to show-file-list.',
          'thumbnail-mode': 'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
        }
      };
    }
  }
};
</script>
<style>
@import "../../../src/style/var.css";

@component-namespace mt {
  @component upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;

    @descendent input {
      display: none;
    }
    @descendent tip {
      font-size: 12px;
      color: $color-base-silver;
      margin-top: 7px;
    }
    & iframe {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      opacity: 0;
      filter: alpha(opacity=0);
    }
    /* 照片墙模式 */
    @modifier picture-card {
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      height: @width;
      cursor: pointer;
      line-height: calc(@height - 2);
      vertical-align: top;

      i {
        font-size: 28px;
        color: #8c939d;
      }

      &:hover {
        border-color: $color-primary;
        color: $color-primary;
      }
    }
  }
  @component upload-dragger {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 360px;
    height: 180px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    & .mintui-upload {
      font-size: 67px;
      color: $color-light-silver;
      margin: 40px 0 16px;
      line-height: 50px;
    }

    & + .mt-upload-tip {
      text-align: center;
    }
    & ~ .mt-upload-files {
      border-top: 1px solid rgba($color-extra-light-silver, .2);
      margin-top: 7px;
      padding-top: 5px;
    }
    .mt-upload-text {
      color: $color-light-silver;
      text-align: center;

      & em {
        color: $color-primary;
        font-style: normal;
      }
    }

    &:hover {
      border-color: $color-primary;
    }

    @when dragover {
      background-color: rgba(32, 159, 255, .06);
      border: 2px dashed $color-primary;
    }
  }

  @component upload-list {
    margin: 0;
    padding: 0;
    list-style: none;

    @descendent item {
      transition: all .5s cubic-bezier(.55,0,.1,1);
      color: $color-extra-light-black;
      line-height: 1.8;
      margin-top: 5px;
      position: relative;
      box-sizing: border-box;
      border-radius: 4px;
      width: 100%;
      position: relative;

      & .mt-progress {
        position: absolute;
        top: 20px;
        width: 100%;
      }
      & .mt-progress-text {
        position: absolute;
        right: 0;
        top: -13px;
        right: 0;
      }
      .mt-progress-bar {
        margin-right: 0;
        padding-right: 0;
      }
      &:first-child {
        margin-top: 10px;
      }
      & .mintui-upload-success {
        color: $success-color;
      }
      & .mintui-close {
        display: none;
        position: absolute;
        top: 0px;
        right: 5px;
        cursor: pointer;
        opacity: .75;
        color: $color-extra-light-black;
        transform: scale(.7);

        &:hover {
          opacity: 1;
        }
      }
      &:hover {
        background-color: $color-extra-light-gray;

        .mintui-close {
          display: inline-block;
        }
        .mt-progress-text {
          display: none;
        }
      }
      @when success {
        .mt-upload-list-item-status-label {
          display: block;
        }
        .mt-upload-list-item-name:hover {
          color: $link-hover-color;
          cursor: pointer;
        }
        &:hover {
          .mt-upload-list-item-status-label {
            display: none;
          }
        }
      }
    }
    @when disabled {
      .mt-upload-list-item:hover .mt-upload-list-item-status-label {
        display: block;
      }
    }
    @descendent item-name {
      color: $color-extra-light-black;
      display: block;
      margin-right: 40px;
      overflow: hidden;
      padding-left: 4px;
      text-overflow: ellipsis;
      transition: color .3s;
      white-space: nowrap;

      [class^="mintui-"] {
        color: $color-light-silver;
        margin-right: 7px;
        height: 100%;
        line-height: inherit;
      }
    }
    @descendent item-status-label {
      position: absolute;
      right: 5px;
      top: 0;
      line-height: inherit;
      display: none;
    }
    @descendent item-delete {
      position: absolute;
      right: 10px;
      top: 0;
      font-size: 12px;
      color: $color-extra-light-black;
      display: none;

      &:hover {
        color: $color-primary;
      }
    }
    @modifier picture-card {
      margin: 0;
      display: inline;
      vertical-align: top;

      .mt-upload-list-item {
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: 148px;
        height: @width;
        margin: 0 8px 8px 0;
        display: inline-block;

        & .mintui-hook,
        & .mintui-cirhook {
          color: $color-white;
        }

        & .mintui-close {
          display: none;
        }

        &:hover {
          .mt-upload-list-item-status-label {
            display: none;
          }
          .mt-progress-text {
            display: block;
          }
        }
      }
      .mt-upload-list-item-name {
        display: none;
      }
      .mt-upload-list-item-thumbnail {
        width: 100%;
        height: 100%;
      }
      .mt-upload-list-item-status-label {
        position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 0 1pc 1px rgba(0,0,0,0.2);

        i {
          font-size: 12px;
          margin-top: 11px;
          transform: rotate(-45deg) scale(0.8);
        }
      }
      .mt-upload-list-item-actions {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        @utils-vertical-center;

        span {
          display: none;
          cursor: pointer;
        }
        span + span {
          margin-left: 15px;
        }

        .mt-upload-list-item-delete {
          position: static;
          font-size: inherit;
          color: inherit;
        }

        &:hover {
          opacity: 1;
          span {
            display: inline-block;
          }
        }
      }
      .mt-progress {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        bottom: auto;
        width: 126px;

        .mt-progress-text {
          top: 50%;
        }
      }
    }
    @modifier picture {
      .mt-upload-list-item {
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        margin-top: 10px;
        padding: 10px 10px 10px 90px;
        height: 92px;
        
        & .mintui--hook,
        & .mintui--cirhook {
          color: $color-white;
        }
        &:hover {
          .mt-upload-list-item-status-label {
            background: transparent;
            box-shadow: none;
            top: -2px;
            right: -12px;
          }
          .mt-progress-text {
            display: block;
          }
        }
        &.is-success {
          .mt-upload-list-item-name {
            line-height: 70px;
            margin-top: 0;

            i {
              display: none;
            }
          }
        }
      }
      .mt-upload-list-item-thumbnail {
        vertical-align: middle;
        display: inline-block;
        width: 70px;
        height: 70px;
        float: left;
        position: relative;
        z-index: 1;
        margin-left: -80px;
      }
      .mt-upload-list-item-name {
        display: block;
        margin-top: 20px;

        i {
          font-size: 70px;
          line-height: 1;
          position: absolute;
          left: 9px;
          top: 10px;
        }
      }
      .mt-upload-list-item-status-label {
        position: absolute;
        right: -17px;
        top: -7px;
        width: 46px;
        height: 26px;
        background: #13ce66;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 1px 1px #ccc;

        i {
          display: inline-block;
          color: #fff;
          font-size: 12px;
          margin-top: 8px;
          transform: rotate(-45deg);
        }
      }
      .mt-progress {
        position: relative;
        top: -7px;
      }
    }
  }

  @component upload-cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10;
    cursor: default;

    & img {
      display: block;
      width: 100%;
      height: 100%;
    }

    @descendent label {
      position: absolute;
      right: -15px;
      top: -6px;
      width: 40px;
      height: 24px;
      background: #13ce66;
      text-align: center;
      transform: rotate(45deg);
      box-shadow: 0 0 1pc 1px rgba(0,0,0,0.2);

      i {
        font-size: 12px;
        margin-top: 11px;
        transform: rotate(-45deg) scale(0.8);
        color: #fff;
      }
    }

    @descendent progress {
      display: inline-block;
      vertical-align: middle;
      position: static;
      width: 243px;

      & + .mt-upload-inner {
        opacity: 0;
      }
    }

    @descendent content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    @descendent interact {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(#000, .72);
      text-align: center;

      & .btn {
        display: inline-block;
        color: $color-white;
        cursor: pointer;
        vertical-align: middle;
        transition: $md-fade-transition;
        margin-top: 60px;

        & i {
          margin-top: 0;
        }

        & span {
          opacity: 0;
          transition: opacity .15s linear;
        }

        &:not(:first-child) {
          margin-left: 35px;
        }

        &:hover {
          transform: translateY(-13px);

          & span {
            opacity: 1;
          }
        }

        & i {
          color: $color-white;
          display: block;
          font-size: 24px;
          line-height: inherit;
          margin: 0 auto 5px;
        }
      }
    } 

    @descendent title {
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: $color-white;
      height: 36px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: normal;
      text-align: left;
      padding: 0 10px;
      margin: 0;
      line-height: 36px;
      color: $color-extra-light-black;
    }

    & + .mt-upload-inner {
      opacity: 0;
      position: relative;
      z-index: 1;
    }
  }
}
</style>
