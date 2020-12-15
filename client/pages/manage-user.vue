<template>
  <div>
    <page-title title="User management" />
    Total: {{ data.length }}
    <a-table
      :columns="columns"
      :data-source="data"
      bordered
      :rowKey="(r, i) => i"
    >
      <template slot="privilege" slot-scope="text">
        <div>
          {{
            !text
              ? "Admin"
              : text == 1
              ? "Subject Leader"
              : text == 2
              ? "Subject Expert"
              : ""
          }}
        </div>
      </template>
      <span
        v-if="record.privilege"
        slot="operation"
        slot-scope="text, record, index"
      >
        <a-button
          class="mr-2"
          type="primary"
          v-if="[2, 3].includes(record.privilege)"
          @click="handlePromote(record)"
          >Promote</a-button
        ><a-button
          class="mr-2"
          type="danger"
          ghost
          v-if="[2, 1].includes(record.privilege)"
          @click="handleDemote(record)"
          >Demote</a-button
        ><a-button type="danger" @click="handleBan(record)">Ban</a-button>
      </span>
    </a-table>
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
const columns = [
  {
    title: "No",
    dataIndex: "no",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "Unique ID",
    dataIndex: "uniqueId",
    scopedSlots: { customRender: "uniqueId" }
  },
  {
    title: "Username",
    dataIndex: "username",
    scopedSlots: { customRender: "username" }
  },
  {
    title: "Registered Date",
    dataIndex: "registeredDate",
    scopedSlots: { customRender: "registeredDate" }
  },
  {
    title: "Privilege",
    dataIndex: "privilege",
    scopedSlots: { customRender: "privilege" }
  },
  {
    title: "Subject",
    dataIndex: "subject",
    scopedSlots: { customRender: "subject" }
  },
  {
    title: "Operation",
    class: "action",
    width: 280,
    scopedSlots: { customRender: "operation" }
  }
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    no: i,
    uniqueId: 1412 + i,
    username: `Edrward ${i}`,
    registeredDate: "2020/12/15",
    privilege: i % 4,
    subject: [1, 2].includes(i % 4) ? "Math" : ""
  });
}
export default {
  components: { pageTitle },
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      editingKey: ""
    };
  },
  methods: {
    handlePromote(user) {
      this.$confirm({
        title: `Are you sure to promote ${user.username}?`,
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {},
        onCancel() {}
      });
    },
    handleDemote(user) {
      this.$confirm({
        title: `Are you sure to demote ${user.username}?`,
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {},
        onCancel() {}
      });
    },
    handleBan(user) {
      this.$confirm({
        title: `Are you sure to ban ${user.username}?`,
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {},
        onCancel() {}
      });
    }
  }
};
</script>

<style>
.ant-table-thead > tr > th.action,
.ant-table tr > td.action,
.ant-table tr > td.action div {
  width: fit-content;
  text-align: left;
}
</style>