/*****************************************************************************
 Filename:          form-control-components-module.vue
 Description:       Form control components module.

 Creation Date:     14/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div></div>
</template>

<script>
export const FormControlComponentsModule = {
  name: "FormControlComponentsModule"
};

export { default as InputText } from "./input-text.vue";
export { default as CheckBox } from "./check-box.vue";
export { default as RadioButton } from "./radio-button.vue";

export default FormControlComponentsModule;
</script>
