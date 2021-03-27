<template>
  <div>
    <page-title title="User management" />
    Total: {{ usersCount }}
    <span style="float: right">
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

      <span slot="usernameTitle"
        >Username
        <a-input
          v-model="filteredUsername"
          @click="e => e.stopPropagation()"
          @change="search"
        ></a-input
      ></span>

      <span slot="userIdTitle"
        >Unique ID
        <a-input
          v-model="filteredUserId"
          @click="e => e.stopPropagation()"
          @change="search"
        ></a-input
      ></span>

      <div style="text-align: center" slot="actions" slot-scope="text, record">
        <span
          ><a-button type="primary" @click="handleSave(record)"
            >Save</a-button
          ></span
        >
      </div>
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
      editableDataSource: [],
      sortKey: "userId",
      sortOrder: "asc",
      filteredUsername: "",
      filteredUserId: "",
      search: _.debounce(() => {
        this.fetchFilteredData();
      }, 300)
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
    this.initSubjectOptions();
    this.fetchUsers();
    this.fetchUserCount();
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      users: state => state.users,
      usersCount: state => state.usersCount
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
          title: "No.",
          scopedSlots: { customRender: "no" }
        },
        {
          slots: { title: "userIdTitle" },
          dataIndex: "userId",
          key: "userId",
          scopedSlots: { customRender: "uniqueId" },
          sorter: true
        },
        {
          slots: { title: "usernameTitle" },
          dataIndex: "username",
          key: "username",
          scopedSlots: { customRender: "username" },
          sorter: true
        },
        {
          title: "Privilege",
          dataIndex: "role",
          key: "role",
          scopedSlots: { customRender: "privilege" },
          sorter: true
        },
        {
          title: "Subject",
          dataIndex: "subjectId",
          key: "subjectId",
          scopedSlots: { customRender: "subject" },
          sorter: true
        },
        {
          title: "Actions",
          scopedSlots: { customRender: "actions" }
        }
      ].filter(c => (!this.isEditing ? c.title != "Actions" : true));
    },
    operationColWidth() {
      return this.isEditing ? 280 : 100;
    }
  },
  methods: {
    ...mapActions({
      getAllUsers: "getAllUsers",
      getAllSubjects: "subjects/getAllSubjects",
      updateUsersRole: "updateUsersRole",
      updateUserRole: "updateUserRole",
      getUsers: "getUsers",
      getUsersCount: "getUsersCount"
    }),
    ...mapMutations({
      setAllUsers: "setAllUsers"
    }),
    async initSubjectOptions() {
      this.allSubjects.length ? {} : await this.getAllSubjects();
      this.subjectOptions = this.allSubjects.map(subject => ({
        value: subject.subjectId,
        label: subject.subjectName
      }));
    },
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
    async fetchUsers() {
      await this.getUsers({
        username: this.filteredUsername,
        userId: this.filteredUserId,
        sortKey: this.sortKey ?? "userId",
        sortOrder: this.sortOrder ?? "asc",
        perPage: this.pagination.pageSize,
        currentPage: this.pagination.current
      });
      this.editableDataSource = _.cloneDeep(this.users);
    },
    async fetchUserCount() {
      this.pagination.total = await this.getUsersCount({
        username: this.filteredUsername,
        userId: this.filteredUserId
      });
    },
    async fetchFilteredData() {
      this.pagination.current = 1;
      this.fetchUsers();
      this.fetchUserCount();
    },
    handleTableChange(pagination, filters, sorter) {
      if (sorter.order) {
        this.sortOrder = sorter.order == "descend" ? "desc" : "asc";
        this.sortKey = sorter.columnKey;
      } else {
        this.sortOrder = "asc";
        this.sortKey = "userId";
      }
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetchUsers();
    },
    handleRoleChange(user, selectedRole) {
      if ([0, 1, 2].includes(selectedRole)) user.subjectId = 1;
      else user.subjectId = null;
    },
    handleResetData() {
      this.editableDataSource = _.cloneDeep(this.users);
    },
    async handleSave(user) {
      let res = await this.updateUserRole({ user: user });
      this.$notification.info({ message: res });
      if (res == "Updated successfully!") this.fetchUsers();
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