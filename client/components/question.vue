<template>
  <div>
    <a-card size="small">
      <div slot="title">
        Simplify :150 ÷ (6 + 3 x 8) - 5 ?
        <a-tag color="green">Math</a-tag>
      </div>
      <div slot="extra">
        <a-button size="small" type="primary" ghost @click="handleReport"
          >Report</a-button
        >
        <a-button size="small" type="danger" @click="handleDeletion"
          >Delete</a-button
        >
      </div>
      <div>A. 0</div>
      <div>B. 10</div>
      <div>C. 5</div>
      <div>D. 2</div>
    </a-card>

    <a-modal
      v-model="modalVisible"
      centered
      title="Report question"
      @ok="handleOk"
    >
      <a-textarea placeholder="Enter the reason to report this question ..." />
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalVisible: false,
    };
  },
  methods: {
    handleDeletion() {
      this.$confirm({
        title: "Are you sure to remove the question from the system?",
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {},
        onCancel() {},
      });
    },
    handleReport() {
      this.modalVisible = true;
    },
    handleOk() {
      this.modalVisible = false;
    },
  },
};
</script>