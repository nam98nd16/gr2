<template>
  <div>
    <page-title title="Subject management" />
    Total: {{ subjects.length }}
    <span style="float: right">
      <span v-show="isEditing"
        ><a-button type="primary" ghost size="small" @click="handleResetData"
          ><i class="fas fa-recycle mr-1"></i>Reset</a-button
        >
        <a-button type="primary" size="small" @click="handleSave"
          ><i class="fas fa-check mr-1"></i>Save</a-button
        ></span
      >
      <a-switch
        class="mb-1"
        checked-children="Editing"
        un-checked-children="Not Editing"
        default-unchecked
        v-model="isEditing"
      />
    </span>

    <a-table
      :columns="columns"
      :data-source="editableDataSource"
      :pagination="pagination"
      bordered
      :rowKey="(r, i) => i"
      size="middle"
      @change="handleTableChange"
    >
      <template slot="no" slot-scope="text, record, index">
        <div>
          {{ index + (pagination.current - 1) * pagination.pageSize + 1 }}
        </div>
      </template>
      <template slot="subjectExperts" slot-scope="text, record">{{
        record.experts.map(e => e.username).join(", ")
      }}</template>
    </a-table>
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  middleware: "user-management-guard",
  components: { pageTitle },
  data() {
    return {
      isEditing: false,
      editableDataSource: [],
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1
      }
    };
  },
  async mounted() {
    await this.getSubjects({ subjectId: null });
    this.editableDataSource = _.cloneDeep(this.subjects);
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      subjects: state => state.subjects.subjects
    }),
    columns() {
      return [
        {
          title: "No.",
          scopedSlots: { customRender: "no" }
        },
        {
          title: "Unique ID",
          dataIndex: "subjectId",
          scopedSlots: { customRender: "uniqueId" },
          sorter: (a, b) => a.subjectId - b.subjectId
        },
        {
          title: "Name",
          dataIndex: "subjectName",
          scopedSlots: { customRender: "subjectName" },
          sorter: (a, b) => a.subjectName.localeCompare(b.subjectName)
        },
        {
          title: "Subject Leader",
          dataIndex: "leader.username",
          scopedSlots: { customRender: "subjectLeader" },
          sorter: (a, b) =>
            a.leader?.username?.localeCompare(b.leader?.username)
        },
        {
          title: "Subject Experts",
          dataIndex: "leader.experts",
          scopedSlots: { customRender: "subjectExperts" }
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      getAllSubjects: "subjects/getAllSubjects",
      getSubjects: "subjects/getSubjects"
    }),
    handleResetData() {},
    handleSave() {},
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
    }
  }
};
</script>