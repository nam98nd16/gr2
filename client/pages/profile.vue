<template>
  <a-spin :spinning="pageLoading">
    <page-title title="Profile" />
    <div v-if="currentUser" class="container">
      <a-form>
        <input
          style="display: none"
          ref="input"
          type="file"
          name="image"
          accept="image/*"
          @change="setImage"
        />
        <a-form-item :colon="false" v-bind="formItemLayout">
          <span slot="label" style="display: none">
            Final image
          </span>
          <a-popover v-model="popoverVisible" v-if="avatar" placement="bottom">
            <div class="p-2" slot="content">
              <a-button type="primary" @click.prevent="showFileChooser">
                Upload avatar
              </a-button>
              <a-button @click="openPopConfirm" type="danger">Delete</a-button>
            </div>
            <div class="profile-img-container">
              <img
                :style="popoverVisible ? 'opacity: 0.8' : ''"
                :src="avatar"
                :class="'ghx-avatar-img'"
              />
              <a
                :style="popoverVisible ? 'opacity: 1; top: 0;z-index: 500' : ''"
              >
                <span
                  :class="[
                    'fas fa-camera fa-2x',
                    popoverVisible ? 'popover-visible-camera-icon' : ''
                  ]"
                ></span>
              </a>
            </div>
          </a-popover>
          <div
            v-else
            @click.prevent="showFileChooser"
            class="profile-img-container"
          >
            <span :class="'ghx-avatar-img null-avatar'" @click="visible = true">
              {{ currentUser.username.charAt(0) }}
            </span>
            <a>
              <span class="fas fa-camera fa-2x"></span>
            </a>
          </div>
          <a-modal
            v-model="visible"
            :okButtonProps="{
              props: { loading: uploading, disabled: !imgSrc }
            }"
            :cancelButtonProps="{ props: { loading: uploading } }"
            :okText="'OK'"
            :cancelText="'Cancel'"
            :centered="true"
            :maskClosable="false"
            @ok="handleOk"
            @cancel="handleCancel"
          >
            <vue-cropper
              class="mt-2 img-cropper"
              v-if="imgSrc"
              ref="cropper"
              :aspect-ratio="1"
              :src="imgSrc"
              preview=".preview"
              :viewMode="1"
            ></vue-cropper>
          </a-modal>
        </a-form-item>
      </a-form>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item :label="'Username'" v-bind="formItemLayout">
          {{ currentUser.username }}
          <privilege-tag
            :role="currentUser.role"
            :subjectId="currentUser.subjectId"
          />
        </a-form-item>
        <a-form-item :label="'Full name'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'fullName',
              {
                initialValue: currentUser.fullName
              }
            ]"
            placeholder="Full name"
          >
            <a-icon
              slot="prefix"
              type="font-colors"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item :label="'Email'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'email',
              {
                rules: [
                  {
                    pattern: /\S+@\S+\.\S+/,
                    message: 'Please input a valid email!'
                  }
                ],
                initialValue: currentUser.email
              }
            ]"
            placeholder="Email"
          >
            <a-icon
              slot="prefix"
              type="mail"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item :label="'Phone number'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'phoneNumber',
              {
                rules: [
                  {
                    pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                    message: 'Please input a valid phone number!'
                  }
                ],
                initialValue: currentUser.phoneNumber
              }
            ]"
            placeholder="Phone number"
          >
            <a-icon
              slot="prefix"
              type="mobile"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item :label="'Birthday'" v-bind="formItemLayout">
          <a-date-picker
            style="float: left"
            format="YYYY/MM/DD"
            v-decorator="[
              'birthday',
              {
                initialValue: currentUser.birthday
                  ? $moment(currentUser.birthday)
                  : null
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="'Address'" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'address',
              {
                initialValue: currentUser.address
              }
            ]"
            placeholder="Address"
          >
            <a-icon
              slot="prefix"
              type="home"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item :label="'Gender'" v-bind="formItemLayout">
          <a-radio-group
            name="gender"
            style="float: left; margin-top: 8px"
            v-decorator="['gender', { initialValue: currentUser.gender }]"
          >
            <a-radio :value="1">Male</a-radio>
            <a-radio :value="2">Female</a-radio>
            <a-radio :value="3">Other</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="'About me'" v-bind="formItemLayout">
          <a-textarea
            v-decorator="['about', { initialValue: currentUser.autobiography }]"
            placeholder="Describe something about me ..."
            :autoSize="{ minRows: 2, maxRows: 10 }"
          ></a-textarea>
        </a-form-item>
        <a-form-item :label="'  '" v-bind="formItemLayout" :colon="false">
          <a-button
            :loading="loading"
            type="primary"
            html-type="submit"
            class="login-form-button"
            >Update</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import jwt_decode from "jwt-decode";
import PageTitle from "../components/page-title.vue";
import PrivilegeTag from "../components/privilege-tag.vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  components: { PageTitle, PrivilegeTag, VueCropper },
  data() {
    return {
      formItemLayout: {
        labelCol: {
          md: 10,
          sm: 24
        },
        wrapperCol: {
          md: 6,
          sm: 24
        }
      },
      user: null,
      currentUser: null,
      loading: false,
      pageLoading: false,
      popoverVisible: false,
      visible: false,
      uploading: false,
      imgSrc: null,
      uploadedFile: null
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "profile" });
  },
  async mounted() {
    this.currentUser = jwt_decode(localStorage.getItem("token"));
    this.allSubjects.length ? {} : this.getAllSubjects();
    await this.getAvatar(this.currentUser.userId);
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      avatar: state => state.avatar
    })
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      updateProfile: "updateProfile",
      getAllSubjects: "subjects/getAllSubjects",
      updateAvatar: "updateAvatar",
      getAvatar: "getAvatar"
    }),
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true;
          let payload = {
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            autobiography: values.about,
            birthday: values.birthday
              ? this.$moment(values.birthday)
                  .add(7, "hours")
                  .format("YYYY/MM/DD")
              : null,
            gender: values.gender,
            address: values.address,
            email: values.email
          };
          try {
            let res = await this.updateProfile(payload);
            if (res.status == 200) {
              localStorage.setItem("token", res.data);
              this.$notification.success({
                message: "Updated successfully!"
              });
            }
          } catch (error) {
            this.errMessage = error.response.data;
          } finally {
            this.loading = false;
          }
        }
      });
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    setImage(e) {
      this.uploadedFile = e.target.files[0];
      if (this.uploadedFile) {
        if (this.uploadedFile.type.indexOf("image/") === -1) {
          alert("Please select an image file");
          return;
        }
        if (typeof FileReader === "function") {
          const reader = new FileReader();
          reader.onload = async event => {
            this.imgSrc = event.target.result;
            await this.$nextTick();
            // rebuild cropperjs with the updated source
            this.$refs.cropper.replace(event.target.result);
          };
          reader.readAsDataURL(this.uploadedFile);
        } else {
          alert("Sorry, FileReader API not supported");
        }
        this.visible = true;
        e.target.value = "";
      }
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper
        .getCroppedCanvas({
          width: 256,
          height: 256,
          minWidth: 128,
          minHeight: 128,
          maxWidth: 4096,
          maxHeight: 4096,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high"
        })
        .toDataURL();
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },
    async handleOk() {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      this.uploading = true;
      this.cropImage();
      var file = this.dataURLtoFile(this.cropImg, this.uploadedFile.name);
      let formData = new FormData();
      formData.append("image", file);
      await this.updateAvatar(formData);
      await delay(500);
      this.getAvatar(this.currentUser.userId);

      this.$notification["success"]({
        message: "Uploaded avatar successfully!"
      });
      this.uploading = false;
      this.visible = false;
    },
    handleCancel() {},
    openPopConfirm() {
      this.$confirm({
        title: "Are you sure you want to delete your avatar?",
        onOk: async () => {
          await this.updateAvatar(new FormData());
          this.getAvatar(this.currentUser.userId);
          this.$notification["success"]({
            message: "Removed avatar successfully!"
          });
        },
        onCancel() {}
      });
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  display: initial;
}

.cropper {
  height: 600px;
  background: #ddd;
}

.ghx-avatar-img {
  -webkit-border-radius: 50%;
  border-radius: 50%;
  font-size: 24px;
  height: 168px;
  line-height: 168px;
  width: 168px !important;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
}

.null-avatar {
  background-color: lightblue;
  font: Arial;
  font-size: 48px;
  font-weight: 500;
  color: white;
}

.profile-img-container {
  position: relative;
  display: inline-block; /* added */
  overflow: hidden; /* added */
}

.profile-img-container img {
  width: 100%;
} /* remove if using in grid system */

.profile-img-container:hover img {
  opacity: 0.8;
}
.profile-img-container:hover a {
  opacity: 1; /* added */
  top: 0; /* added */
  z-index: 500;
}
/* added */
.profile-img-container:hover a span {
  top: 50%;
  position: absolute;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
/* added */
.profile-img-container a {
  display: block;
  position: absolute;
  top: -100%;
  opacity: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
  color: inherit;
}

.popover-visible-camera-icon {
  top: 50%;
  position: absolute;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
</style>

<style>
.img-cropper .cropper-view-box {
  border-radius: 50% !important;
  display: block;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
  overflow: hidden;
  width: 100%;
}
</style>