<template>
  <div>
    <page-title title="Subject management" />
    <a-button class="mb-2" type="primary" @click="modalVisible = true">
      <i class="fas fa-plus mr-2"></i> Add subject</a-button
    ><br />Total: {{ subjects.length }}
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
    <a-modal
      v-model="modalVisible"
      centered
      :title="'Add new subject'"
      @ok="handleAddNewSubject"
    >
      <a-form>
        <a-form-item label="Subject title" v-bind="formItemLayout">
          <a-input
            style="width: 80%"
            v-model="subjectTitle"
            placeholder="Input subject title"
          />
        </a-form-item>

        <a-form-item label="Subject leader" v-bind="formItemLayout">
          <a-select
            show-search
            placeholder="Search for subject leader"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            style="min-width: 100px; max-width: 200px"
            @search="handleSearch"
            allowClear
            v-model="selectedLeader"
          >
            <a-select-option
              v-for="assignee in availableAssignees"
              :key="assignee.userId"
              >{{ assignee.username }}</a-select-option
            >
          </a-select>
        </a-form-item>

        <a-form-item label="Subject experts" v-bind="formItemLayout">
          <a-select
            placeholder="Search for subject experts"
            mode="multiple"
            style="min-width: 100px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSearchForExperts"
            v-model="selectedExperts"
          >
            <a-select-option
              v-for="assignee in availableAssignees2"
              :key="assignee.userId"
              >{{ assignee.username }}</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
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
      formItemLayout: {
        labelCol: {
          md: 6,
          sm: 24
        },
        wrapperCol: {
          md: 18,
          sm: 24
        }
      },
      isEditing: false,
      editableDataSource: [],
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1
      },
      modalVisible: false,
      subjectTitle: "",
      selectedLeader: undefined,
      selectedExperts: [],
      availableAssignees: [],
      availableAssignees2: []
    };
  },
  async mounted() {
    await this.getSubjects({ subjectId: null });
    this.editableDataSource = _.cloneDeep(this.subjects);
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      subjects: state => state.subjects.subjects,
      nonExpertUsers: state => state.subjects.nonExpertUsers
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
      getSubjects: "subjects/getSubjects",
      getNonExpertUsers: "subjects/getNonExpertUsers"
    }),
    handleResetData() {},
    handleSave() {},
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
    },
    handleAddNewSubject() {
      this.modalVisible = false;
    },
    async handleSearch(value) {
      this.availableAssignees = await this.getNonExpertUsers(value);
      this.availableAssignees = this.availableAssignees.filter(
        a => !this.selectedExperts.includes(a.userId)
      );
    },
    async handleSearchForExperts(value) {
      this.availableAssignees2 = await this.getNonExpertUsers(value);
      this.availableAssignees2 = this.availableAssignees2.filter(
        a => a.userId != this.selectedLeader
      );
    }
  }
};
</script>

<style scoped>
.ant-form-item {
  margin-bottom: unset;
}
</style>