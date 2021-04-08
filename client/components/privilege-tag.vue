<template>
  <a-tag v-if="userRole" :color="userRoleColor">{{ userRole }}</a-tag>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["role", "subjectId"],
  mounted() {
    this.allSubjects.length ? {} : this.getAllSubjects();
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects
    }),
    userRole() {
      let role = "";
      switch (this.role) {
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
      if (this.subjectId)
        role += ` - ${
          this.allSubjects.find(subj => subj.subjectId == this.subjectId)
            ?.subjectName
        }`;
      return role;
    },
    userRoleColor() {
      let color = "";
      switch (this.role) {
        case 0:
          color = "red";
          break;
        case 1:
          color = "#0000A0";
          break;
        case 2:
          color = "blue";
          break;
        case 4:
          color = "green";
          break;
        default:
          color = "#000000";
          break;
      }
      return color;
    }
  },
  methods: {
    ...mapActions({
      getAllSubjects: "subjects/getAllSubjects"
    })
  }
};
</script>