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

      if (this.subjectId)
        role = `${
          this.allSubjects.find(subj => subj.subjectId == this.subjectId)
            ?.subjectName
        } `;
      switch (this.role) {
        case 0:
          role += "Admin";
          break;
        case 1:
          role += "Leader";
          break;
        case 2:
          role += "Expert";
          break;
        case 4:
          role += "Preliminary Reviewer";
          break;
        default:
          break;
      }
      return role;
    },
    userRoleColor() {
      let color = "";
      switch (this.role) {
        case 0:
          color = "#000000";
          break;
        case 1:
          color = "#4363d8";
          break;
        case 2:
          color = "#dcbeff";
          break;
        case 4:
          color = "#f58231";
          break;
        default:
          color = "#ffffff";
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