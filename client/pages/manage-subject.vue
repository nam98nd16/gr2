<template>
  <div>
    <page-title title="Subject management" />
    <a-button class="mb-2" type="primary" @click="modalVisible = true">
      <i class="fas fa-plus mr-2"></i> Add subject</a-button
    ><br />Total: {{ subjectCount }}
    <span style="float: right">
      <a-switch
        class="mb-1"
        checked-children="Editing"
        un-checked-children="Viewing"
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
      <div style="text-align: center" slot="actions" slot-scope="text, record">
        <span
          ><a-button type="danger" @click="handleDeletion(record)"
            >Delete</a-button
          ></span
        >
        <span
          ><a-button type="primary" @click="handleEdit(record)"
            >Edit</a-button
          ></span
        >
      </div>
    </a-table>

    <a-modal
      v-model="modalVisible"
      centered
      :title="'Add new subject'"
      :okButtonProps="{ props: { disabled: isAddingSubject } }"
      @ok="handleSave"
      @cancel="handleCancel"
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
            placeholder="Select subject leader"
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
            placeholder="Select subject experts"
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
      availableAssignees2: [],
      isAddingSubject: false,
      currentlyEditingSubjectExperts: [],
      isEditingSubject: false,
      currentlyEditingSubject: null
    };
  },
  watch: {
    selectedLeader() {
      this.availableAssignees2 = this.availableAssignees2.filter(
        a => a.userId != this.selectedLeader
      );
    },
    selectedExperts() {
      this.availableAssignees = this.availableAssignees.filter(
        a => !this.selectedExperts.includes(a.userId)
      );
    }
  },
  async mounted() {
    this.fetchSubjects();
    this.fetchSubjectCount();
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      subjects: state => state.subjects.subjects,
      subjectCount: state => state.subjects.subjectCount,
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
        },
        {
          title: "Actions",
          scopedSlots: { customRender: "actions" },
          width: "180px"
        }
      ].filter(c => (!this.isEditing ? c.title != "Actions" : true));
    }
  },
  methods: {
    ...mapActions({
      getAllSubjects: "subjects/getAllSubjects",
      getSubjects: "subjects/getSubjects",
      getSubjectCount: "subjects/getSubjectCount",
      getNonExpertUsers: "subjects/getNonExpertUsers",
      addSubject: "subjects/addSubject",
      updateSubject: "subjects/updateSubject",
      removeSubject: "subjects/removeSubject"
    }),
    async fetchSubjects() {
      await this.getSubjects({
        subjectName: null,
        perPage: this.pagination.pageSize,
        currentPage: this.pagination.current
      });
      this.editableDataSource = _.cloneDeep(this.subjects);
    },
    async fetchSubjectCount() {
      this.pagination.total = await this.getSubjectCount({ subjectName: null });
    },
    handleResetData() {},
    async handleSave() {
      if (!this.isEditingSubject) await this.handleAddNewSubject();
      else {
        await this.handleUpdateSubject();
        this.fetchSubjects();
        this.handleCancel();
      }
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetchSubjects();
    },
    async handleUpdateSubject() {
      let payload = {
        subjectId: this.currentlyEditingSubject.subjectId,
        subjectTitle: this.subjectTitle,
        subjectLeaderId: this.selectedLeader,
        subjectExpertIds: this.selectedExperts
      };
      await this.updateSubject(payload);
      this.$notification.success({ message: "Updated successfully!" });
    },
    async handleAddNewSubject() {
      this.isAddingSubject = true;
      if (
        this.editableDataSource.findIndex(
          s => s.subjectName == this.subjectTitle
        ) >= 0
      )
        this.$notification.error({
          message: "A subject having that name already existed!"
        });
      else {
        let payload = {
          subjectTitle: this.subjectTitle,
          subjectLeaderId: this.selectedLeader,
          subjectExpertIds: this.selectedExperts
        };
        await this.addSubject(payload);
        this.$notification.success({ message: "Added successfully!" });
        this.fetchSubjects();
        this.fetchSubjectCount();
        this.handleCancel();
      }
      this.isAddingSubject = false;
    },
    async handleSearch(value) {
      this.availableAssignees = await this.getNonExpertUsers(value);
      this.availableAssignees = this.availableAssignees.concat(
        this.currentlyEditingSubjectExperts
      );
      this.availableAssignees = this.availableAssignees.filter(
        a => !this.selectedExperts.includes(a.userId)
      );
    },
    async handleSearchForExperts(value) {
      this.availableAssignees2 = await this.getNonExpertUsers(value);
      this.availableAssignees2 = this.availableAssignees2.concat(
        this.currentlyEditingSubjectExperts
      );
      this.availableAssignees2 = this.availableAssignees2.filter(
        a => a.userId != this.selectedLeader
      );
    },
    async handleDeletion(subject) {
      this.$confirm({
        title: "Are you sure to remove the subject from the system?",
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          let res = await this.removeSubject(subject.subjectId);
          this.$notification.info({ message: res });
          if (res == "Deleted successfully!") await this.fetchSubjects();
          if (this.editableDataSource.length % 10 === 0) {
            this.pagination.current = this.pagination.current - 1;
            this.fetchSubjects();
          }
          this.fetchSubjectCount();
        },
        onCancel() {}
      });
    },
    handleEdit(subject) {
      this.isEditingSubject = true;
      this.currentlyEditingSubject = subject;
      let leader = subject.leader
        ? {
            userId: subject.leader?.userId,
            username: subject.leader?.username
          }
        : undefined;
      this.subjectTitle = subject.subjectName;
      this.selectedLeader = subject.leader?.userId;
      this.selectedExperts = subject.experts?.map(e => e.userId) ?? [];
      if (subject.leader) this.availableAssignees.push(leader);
      this.availableAssignees2 = this.availableAssignees2.concat(
        subject.experts.map(e => ({ userId: e.userId, username: e.username }))
      );
      this.currentlyEditingSubjectExperts = this.currentlyEditingSubjectExperts.concat(
        [
          ...subject.experts.map(e => ({
            userId: e.userId,
            username: e.username
          }))
        ]
      );
      if (leader) this.currentlyEditingSubjectExperts.push(leader);
      this.modalVisible = true;
    },
    handleCancel() {
      this.modalVisible = false;
      this.subjectTitle = "";
      this.selectedLeader = undefined;
      this.selectedExperts = [];
      this.currentlyEditingSubjectExperts = [];
      this.availableAssignees = [];
      this.availableAssignees2 = [];
      this.isEditingSubject = false;
      this.currentlyEditingSubject = null;
    }
  }
};
</script>

<style scoped>
.ant-form-item {
  margin-bottom: unset;
}
</style>