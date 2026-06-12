<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    :width="width"
    destroy-on-close
    @close="handleCancel"
  >
    <!-- 表单容器 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      status-icon
      style="padding: 10px 20px 0 10px"
    >
      <!-- 将具体的表单项留给页面插槽自定义 -->
      <slot :form-data="formData"></slot>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: "表单对话框" },
  formData: { type: Object, required: true },
  rules: { type: Object, default: () => ({}) },
  width: { type: String, default: "500px" },
});

const emit = defineEmits(["update:visible", "submit", "cancel"]);
const formRef = ref(null);

const handleCancel = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  emit("update:visible", false);
  emit("cancel");
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      emit("submit", props.formData);
    }
  });
};
</script>
