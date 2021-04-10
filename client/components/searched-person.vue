<template>
  <div class="person-card">
    <a-card class="mt-1" hoverable>
      <a-row :gutter="4" type="flex" align="top" justify="start">
        <a-col :span="6">
          <avatar
            :userId="person.userId"
            :username="person.username"
            nullAvatarFontsize="32px"
            nullAvatarFontweight="400"
            diameter="70px"
            lineHeight="66px"
          />
        </a-col>
        <a-col :span="18">
          <div class="username">
            {{ person.username }}
          </div>

          <div v-if="person.fullName">{{ person.fullName }}</div>
          <friend-actions
            :person="person"
            @addedFriend="$emit('addedFriend')"
            @confirmedFriend="$emit('confirmedFriend')"
            @deletedFriend="$emit('deletedFriend')"
            @viewPerformance="$emit('viewPerformance')"
          />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import PrivilegeTag from "../components/privilege-tag.vue";
import { mapState, mapActions } from "vuex";
import Avatar from "./avatar.vue";
import FriendActions from "./friend-actions.vue";
export default {
  props: ["person"],
  components: { PrivilegeTag, Avatar, FriendActions },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    ...mapActions({})
  }
};
</script>

<style>
.username {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  background: transparent;
}

.person-card .ant-card-body {
  padding: 12px;
  zoom: 1;
}

.person-card .ant-card-bordered {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}
</style>