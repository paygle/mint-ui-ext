<template>
  <div class="page-upload">
    <h1 class="page-title">Upload</h1>
    <div class="page-upload-wrapper">
      <h3>点击上传</h3>
      <mt-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList">
        <mt-button type="primary">点击上传</mt-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </mt-upload>
      <h3>照片墙</h3>
      <mt-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
        <i class="mintui-bigplus avatar-uploader-icon"></i>
      </mt-upload>

      <h3>图片列表缩略图</h3>
      <mt-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList2"
        list-type="picture">
        <mt-button type="primary">点击上传</mt-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </mt-upload>
    </div>
  </div>
</template>

<script type="text/babel">
  import { Toast } from 'src/index';
// 属性
// action	必选参数, 上传的地址	string	—	—
// headers	可选参数, 设置上传的请求头部	object	—	—
// multiple	可选参数, 是否支持多选文件	boolean	—	—
// data	可选参数, 上传时附带的额外参数	object	—	—
// name	可选参数, 上传的文件字段名	string	—	file
// with-credentials	支持发送 cookie 凭证信息	boolean	—	false
// show-file-list	是否显示已上传文件列表	boolean	—	true
// drag	是否启用拖拽上传	boolean	—	false
// accept	可选参数, 接受上传的文件类型（thumbnail-mode 模式下此参数无效）	string	—	—
// on-preview	可选参数, 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据	function(file)	—	—
// on-remove	可选参数, 文件列表移除文件时的钩子	function(file, fileList)	—	—
// on-success	可选参数, 文件上传成功时的钩子	function(response, file, fileList)	—	—
// on-error	可选参数, 文件上传失败时的钩子	function(err, file, fileList)	—	—
// on-progress	可选参数, 文件上传时的钩子	function(event, file, fileList)	—	—
// on-change	可选参数, 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用	function(file, fileList)	—	—
// before-upload	可选参数, 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。	function(file)	—	—
// list-type	文件列表的类型	string	text/picture/picture-card	text
// auto-upload	是否在选取文件后立即进行上传	boolean	—	true
// file-list	上传的文件列表, 例如: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]	array	—	[]
// http-request	覆盖默认的上传行为，可以自定义上传的实现	function	—	—
// disabled	是否禁用	boolean	—	false

// 方法
// clearFiles	清空已上传的文件列表（该方法不支持在 before-upload 中调用）	—
// abort	取消上传请求	（ file: fileList 中的 file 对象 ）

  export default {
    data() {
      return {
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        imageUrl: ''
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          Toast('上传头像图片只能是 PNG 格式!');
        }
        if (!isLt2M) {
          Toast('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  };
</script>

<style>
  @component-namespace page {
    @component upload {
      @descendent wrapper {
        padding: 0 20px;
        margin-top: 80px;
        position: absolute 50% * * *;
        width: 100%;
        transform: translateY(-50%);
        button:not(:last-child) {
          margin-bottom: 20px;
        }
        &>h3 {
          background-color: #666;
          color:#fff;
          margin-bottom: 10px;
        }
      }
    }
  }
  .upload-demo {
    width: 320px;
  }

  .avatar-uploader .mt-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .mt-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
