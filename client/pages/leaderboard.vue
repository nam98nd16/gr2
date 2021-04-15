<template>
  <div>
    <PageTitle :title="'Leaderboard'" />
    <a-radio-group
      class="mb-2"
      v-model="selectedSubjectId"
      button-style="solid"
    >
      <a-radio-button
        v-for="subject in subjectOptions"
        :value="subject.value"
        :key="subject.value"
      >
        {{ subject.label }}
      </a-radio-button>
    </a-radio-group>

    <div>
      <a-checkbox
        class="mb-2"
        :checked="onlyMyFriends"
        @change="
          onlyMyFriends = !onlyMyFriends;
          fetchRatings();
        "
        >Only my friends</a-checkbox
      >
      <a-switch
        style="float: right"
        checked-children="Friend actions shown"
        un-checked-children="Friend actions hidden"
        default-unchecked
        v-model="shouldDisplayFriendActions"
      />
    </div>

    <a-table
      :columns="columns"
      :data-source="topRatings"
      :pagination="false"
      :rowKey="(r, i) => i"
      bordered
      :showHeader="false"
      size="middle"
    >
      <template slot="no" slot-scope="text, record, index">
        <div :style="getStyle(index)">
          {{ index + 1 }}
        </div>
      </template>
      <template slot="username" slot-scope="text, record, index">
        <avatar
          class="mr-2"
          :userId="record.userId"
          :username="text"
          :isMyAvatar="false"
          nullAvatarFontsize="16px"
          nullAvatarFontweight="300"
          diameter="28px"
          lineHeight="26px"
        /><span :style="getStyle(index)">
          <i v-if="[0, 1, 2].includes(index)" class="fas fa-trophy mr-1"> </i
          >{{ text }}</span
        ><privilege-tag
          class="ml-2"
          :role="record.role"
          :subjectId="record.subjectId"
        />
        <friend-actions
          v-if="shouldDisplayFriendActions"
          :person="record"
          :shouldNotRenderDetailActions="true"
          @addedFriend="fetchRatings"
          @deletedFriend="fetchRatings"
          @confirmedFriend="fetchRatings"
        />
      </template>
      <template slot="rating" slot-scope="text, record, index">
        <span :style="getStyle(index)"
          ><i class="fas fa-medal mr-1"></i>{{ text.toFixed(2) }}</span
        >
      </template>
    </a-table>
  </div>
</template>

<script>
import PageTitle from "../components/page-title.vue";
import { mapActions, mapState } from "vuex";
import Avatar from "../components/avatar.vue";
import PrivilegeTag from "../components/privilege-tag.vue";
import FriendActions from "../components/friend-actions.vue";
export default {
  components: { PageTitle, Avatar, PrivilegeTag, FriendActions },
  data() {
    return {
      subjectOptions: [],
      selectedSubjectId: 1,
      onlyMyFriends: false,
      shouldDisplayFriendActions: false
    };
  },
  watch: {
    selectedSubjectId(newVal) {
      this.fetchRatings();
    }
  },
  async mounted() {
    this.initSubjectOptions();
    this.fetchRatings();
  },
  computed: {
    ...mapState({
      topRatings: state => state.performance.topRatings,
      allSubjects: state => state.subjects.allSubjects
    }),
    columns() {
      return [
        {
          title: "No.",
          scopedSlots: { customRender: "no" }
        },
        {
          title: "Username",
          dataIndex: "username",
          scopedSlots: { customRender: "username" }
        },
        {
          title: "Rating",
          dataIndex: "rating",
          scopedSlots: { customRender: "rating" }
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      getTopRatings: "performance/getTopRatings",
      getAllSubjects: "subjects/getAllSubjects"
    }),
    async initSubjectOptions() {
      this.allSubjects.length ? {} : await this.getAllSubjects();
      this.subjectOptions = this.allSubjects.map(subject => ({
        value: subject.subjectId,
        label: subject.subjectName
      }));
    },
    fetchRatings() {
      this.getTopRatings({
        subjectId: this.selectedSubjectId,
        onlyMyFriends: this.onlyMyFriends
      });
    },
    getStyle(index) {
      return !index
        ? "color: gold; font-weight: 500"
        : index === 1
        ? "color: silver; font-weight: 500"
        : index === 2
        ? "color: #C9AE5D; font-weight: 500"
        : "";
    }
  }
};
</script>