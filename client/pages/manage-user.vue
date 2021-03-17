<template>
  <div>
    <page-title title="User management" />
    Total: {{ allUsers.length }}
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
      <template slot="privilege" slot-scope="text, record">
        <div v-if="!isEditing">
          {{ getUserRoleText(text) }}
        </div>
        <div v-else>
          <a-select
            style="min-width: 150px"
            v-model="record.role"
            @change="val => handleRoleChange(record, val)"
            :options="roleOptions"
          />
        </div>
      </template>
      <template slot="subject" slot-scope="text, record">
        <div v-if="!isEditing">
          {{ getUserSubject(text) }}
        </div>
        <div v-else-if="![3, 4].includes(record.role)">
          <a-select
            style="min-width: 150px"
            v-model="record.subjectId"
            :options="subjectOptions"
          />
        </div>
      </template>
      <template slot="no" slot-scope="text, record, index">
        <div>
          {{ index + (pagination.current - 1) * pagination.pageSize + 1 }}
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import { mapActions, mapState, mapMutations } from "vuex";
const roleOptions = [
  { value: 0, label: "Admin" },
  { value: 1, label: "Subject Leader" },
  { value: 2, label: "Subject Expert" },
  { value: 4, label: "Preliminary Reviewer" },
  { value: 3, label: "None" }
];
export default {
  middleware: "user-management-guard",
  components: { pageTitle },
  data() {
    return {
      editingKey: "",
      isEditing: false,
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1
      },
      roleOptions,
      subjectOptions: [],
      editableDataSource: []
    };
  },
  watch: {
    isEditing(newVal) {
      if (!newVal) {
        this.handleResetData();
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.allUsers.length ? {} : this.getAllUsers(),
      this.allSubjects.length ? {} : this.getAllSubjects()
    ]);
    this.editableDataSource = _.cloneDeep(this.allUsers);
    this.subjectOptions = this.allSubjects.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName
    }));
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects
    }),
    allUsers: {
      get() {
        return this.$store.state.allUsers;
      },
      set(value) {
        this.setAllUsers(value);
      }
    },
    columns() {
      return [
        {
          title: "No",
          scopedSlots: { customRender: "no" }
        },
        {
          title: "Unique ID",
          dataIndex: "userId",
          scopedSlots: { customRender: "uniqueId" },
          sorter: (a, b) => a.userId - b.userId
        },
        {
          title: "Username",
          dataIndex: "username",
          scopedSlots: { customRender: "username" },
          sorter: (a, b) => a.username.localeCompare(b.username)
        },
        {
          title: "Privilege",
          dataIndex: "role",
          scopedSlots: { customRender: "privilege" },
          sorter: (a, b) => {
            if (a.role == 3) return 1;
            if (b.role == 3) return -1;
            return a.role - b.role;
          }
        },
        {
          title: "Subject",
          dataIndex: "subjectId",
          scopedSlots: { customRender: "subject" },
          sorter: (a, b, order) => {
            if (!a.subjectId) return 1;
            if (!b.subjectId) return -1;
            return a.subjectId - b.subjectId;
          }
        }
      ];
    },
    operationColWidth() {
      return this.isEditing ? 280 : 100;
    }
  },
  methods: {
    ...mapActions({
      getAllUsers: "getAllUsers",
      getAllSubjects: "subjects/getAllSubjects",
      updateUsersRole: "updateUsersRole"
    }),
    ...mapMutations({
      setAllUsers: "setAllUsers"
    }),
    getUserRoleText(r) {
      let role = "";
      switch (r) {
        case 0:
          role = "Admin";
          break;
        case 1:
          role = "Subject Leader";
          break;
        case 2:
          role = "Subject Expert";
          break;
        case 4:
          role = "Preliminary Reviewer";
          break;
        default:
          break;
      }
      return role;
    },
    getUserSubject(subjectId) {
      return this.allSubjects.find(subj => subj.subjectId == subjectId)
        ?.subjectName;
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
    },
    handleRoleChange(user, selectedRole) {
      if ([0, 1, 2].includes(selectedRole)) user.subjectId = 1;
      else user.subjectId = null;
    },
    handleResetData() {
      this.editableDataSource = _.cloneDeep(this.allUsers);
    },
    async handleSave() {
      let updatedUsers = this.editableDataSource.filter(
        x =>
          this.allUsers.findIndex(
            user =>
              user.userId == x.userId &&
              (user.role != x.role || user.subjectId != x.subjectId)
          ) >= 0
      );
      if (updatedUsers.length) {
        await this.updateUsersRole({ users: updatedUsers });
        this.allUsers = this.editableDataSource;
        this.$notification.success({
          message: "Updated successfully!"
        });
      } else
        this.$notification.info({
          message: "Nothing to update!"
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