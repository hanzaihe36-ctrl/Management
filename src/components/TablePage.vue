<template>
  <div class="table-page-container">
    <el-table
      v-loading="loading"
      :data="data"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
      />

      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="60" align="center" />

      <!-- 动态数据列 -->
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :sortable="col.sortable"
        align="center"
        show-overflow-tooltip
      >
        <!-- 针对特殊状态或角色的插槽处理，或者允许外部自定义 -->
        <template #default="scope">
          <slot :name="col.prop" :row="scope.row">
            {{ scope.row[col.prop] }}
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列插槽 -->
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="scope">
          <slot name="actions" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器集成 -->
    <div class="pagination-wrapper">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  pagination: {
    type: Object,
    default: () => ({ currentPage: 1, pageSize: 10, total: 0 }),
  },
  loading: { type: Boolean, default: false },
  showSelection: { type: Boolean, default: false },
});

const emit = defineEmits(["selection-change", "page-change", "size-change"]);

const handleSelectionChange = (val) => {
  emit("selection-change", val);
};

const handlePageChange = (val) => {
  emit("page-change", val);
};

const handleSizeChange = (val) => {
  emit("size-change", val);
};
</script>

<style scoped>
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
