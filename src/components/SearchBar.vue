<template>
  <el-card class="search-card" shadow="never">
    <el-form :inline="true" :model="formModel" class="search-form">
      <el-form-item
        v-for="field in fields"
        :key="field.key"
        :label="field.label"
      >
        <!-- 输入框类型 -->
        <el-input
          v-if="field.type === 'input'"
          v-model="formModel[field.key]"
          :placeholder="`请输入${field.label}`"
          clearable
        />
        <!-- 下拉框类型 -->
        <el-select
          v-else-if="field.type === 'select'"
          v-model="formModel[field.key]"
          :placeholder="`请选择${field.label}`"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="opt in field.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>&nbsp;搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>&nbsp;重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["search", "reset"]);

// 根据 fields 初始化绑定的数据对象
const initModel = () => {
  const obj = {};
  props.fields.forEach((f) => {
    obj[f.key] = "";
  });
  return obj;
};

const formModel = ref(initModel());

const handleSearch = () => {
  emit("search", { ...formModel.value });
};

const handleReset = () => {
  formModel.value = initModel();
  emit("reset");
};
</script>

<style scoped>
.search-card {
  margin-bottom: 16px;
  border: 1px solid #e4e7ed;
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 18px;
}
</style>
