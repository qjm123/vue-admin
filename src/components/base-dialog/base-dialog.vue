<template>
  <el-dialog :title="title" :visible.sync="showFlag" @click.stop>
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" v-html="cancelBtnText"></el-button>
      <el-button @click="confirm" v-html="confirmBtnText" type="primary"></el-button>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    cancel() {
      this.hide()
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>
