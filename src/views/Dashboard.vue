<template>
  <div class="dashboard-container">
    <h2>社团数据分析大屏</h2>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="6">
        <el-card shadow="never" class="metric-card bg-blue">
          <div class="card-title">总社员人数</div>
          <div class="card-val">{{ totalCount }} 人</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="never" class="metric-card bg-orange">
          <div class="card-title">今日招新新增</div>
          <div class="card-val">{{ todayNewCount }} 人</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="never" class="metric-card bg-green">
          <div class="card-title">活跃数 (Active)</div>
          <div class="card-val">{{ activeCount }} 人</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="never" class="metric-card bg-purple">
          <div class="card-title">核心管理员</div>
          <div class="card-val">{{ adminCount }} 人</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 20px">
      <el-col :span="16">
        <el-card
          header="社团角色及状态占比分布（数据大屏动态统计）"
          shadow="never"
        >
          <div class="chart-mock">
            <div class="chart-bar-item">
              <span class="bar-label">普通成员</span>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ width: userPercent + '%', background: '#409eff' }"
                ></div>
              </div>
              <span class="bar-num">{{ userPercent }}%</span>
            </div>
            <div class="chart-bar-item">
              <span class="bar-label">管理层</span>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ width: adminPercent + '%', background: '#7357ff' }"
                ></div>
              </div>
              <span class="bar-num">{{ adminPercent }}%</span>
            </div>
            <div class="chart-bar-item">
              <span class="bar-label">状态活跃</span>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ width: activePercent + '%', background: '#67c23a' }"
                ></div>
              </div>
              <span class="bar-num">{{ activePercent }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card header="系统快捷操作" shadow="never">
          <div class="quick-actions">
            <el-button
              type="primary"
              size="large"
              @click="$router.push('/user-manage')"
              style="width: 100%; margin-bottom: 12px"
            >
              进入成员信息管理页
            </el-button>
            <el-button type="success" plain size="large" style="width: 100%">
              导出成员通讯录 (Excel)
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const rawUsers = ref([]);

onMounted(() => {
  const localData = localStorage.getItem("CLUB_USERS");
  if (localData) {
    rawUsers.value = JSON.parse(localData);
  }
});

// 计算真实指标
const totalCount = computed(() => rawUsers.value.length);
const todayNewCount = computed(
  () => rawUsers.value.filter((u) => u.isNewToday).length,
);
const activeCount = computed(
  () => rawUsers.value.filter((u) => u.status === "active").length,
);
const adminCount = computed(
  () => rawUsers.value.filter((u) => u.role === "admin").length,
);

// 动态图表百分比换算
const adminPercent = computed(() =>
  totalCount.value
    ? Math.round((adminCount.value / totalCount.value) * 100)
    : 0,
);
const userPercent = computed(() =>
  totalCount.value ? 100 - adminPercent.value : 0,
);
const activePercent = computed(() =>
  totalCount.value
    ? Math.round((activeCount.value / totalCount.value) * 100)
    : 0,
);
</script>

<style scoped>
.metric-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}
.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}
.card-val {
  font-size: 26px;
  font-weight: bold;
}
.bg-blue {
  background-color: #ecf5ff;
  color: #409eff;
}
.bg-orange {
  background-color: #fdf6ec;
  color: #e6a23c;
}
.bg-green {
  background-color: #f0f9eb;
  color: #67c23a;
}
.bg-purple {
  background-color: #f5f0ff;
  color: #7357ff;
}
.chart-mock {
  padding: 10px 0;
}
.chart-bar-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.bar-label {
  width: 80px;
  font-size: 14px;
}
.bar-track {
  flex: 1;
  height: 16px;
  background: #eee;
  border-radius: 8px;
  margin: 0 12px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  transition: width 0.4s ease;
}
.bar-num {
  width: 40px;
  text-align: right;
  font-weight: bold;
}
</style>
