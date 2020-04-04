<template>
  <div v-if="show" class="eos-modal-container">
    <div class="eos-modal eos-modal-confirmation">
      <div class="eos-modal-header">
        <label>{{ title }}</label>
        <img
          class="eos-modal-close"
          :src="require('@/assets/close-green.svg')"
          @click="$emit('closeDialog', false)"
        />
      </div>
      <div class="eos-modal-body">
        <div class="title title-container">
          <img class="severity-img mr-2" :src="severityIcons[severity]" />
          <span v-if="isMessageInHTML" class="finish-text" v-html="message"></span>
          <span v-else class="finish-text">{{ message }}</span>
        </div>
        <br />
        <div>
          <span class="submessage-text">{{ submessage }}</span>
        </div>
        <div class="mt-8 nav-btn">
          <button
            type="button"
            class="eos-btn-primary"
            v-if="confirmButtonText"
            :disabled="confirmButtonDisabled"
            :class="
              severity === 'danger' ? 'eos-btn-danger' : 'eos-btn-primary'
            "
            @click="$emit('closeDialog', true)"
          >
            {{ confirmButtonText }}
          </button>
          <button
            type="button"
            v-if="cancelButtonText"
            :disabled="cancelButtonDisabled"
            class="eos-btn-tertiary"
            @click="$emit('closeDialog', false)"
          >
            {{ cancelButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-confirmation-dialog"
})
export default class EosConfirmationDialog extends Vue {
  @Prop({ required: true, default: false })
  public show!: boolean;

  @Prop({ required: false, default: "Confirmation" })
  public title!: string;

  @Prop({ required: false })
  public message!: string;

  @Prop({ required: false, default: false })
  public isMessageInHTML!: boolean;

  @Prop({ required: false })
  public submessage!: string;

  // Severity has three levels: 'info', 'warning', 'danger'
  @Prop({ required: false, default: "info" })
  public severity!: string;

  @Prop({ required: false, default: "Yes" })
  public confirmButtonText!: string;

  @Prop({ required: false, default: false })
  public confirmButtonDisabled!: boolean;

  @Prop({ required: false, default: "Cancel" })
  public cancelButtonText!: string;

  @Prop({ required: false, default: false })
  public cancelButtonDisabled!: boolean;

  public data() {
    return {
      severityIcons: {
        info: require("@/assets/actions/info-green.svg"),
        warning: require("@/assets/actions/warning-orange.svg"),
        danger: require("@/assets/actions/danger-red.svg")
      }
    };
  }
}
</script>
<style lang="scss" scoped>
.eos-info-icon {
  cursor: pointer;
  height: 20px;
  padding-bottom: 2px;
}
.eos-modal-confirmation {
  width: 600px;
  min-height: 214px;
}
.nav-btn {
  text-align: right;
}
.finish-text {
  vertical-align: center;
}
.title-container {
  display: flex;
  overflow: auto;
}
.submessage-text {
  font-weight: 400;
  font-size: small;
  color: red;
  float: right;
}
.severity-img {
  align-self: flex-start;
}
</style>
