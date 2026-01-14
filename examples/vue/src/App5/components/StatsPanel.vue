<template>
  <div class="stats-panel card">
    <div class="panel-header">
      <h3>项目统计</h3>
      <el-tag effect="plain" size="small">
        共 {{ stats.total }} 项
      </el-tag>
    </div>

    <div class="overall-progress">
      <div class="progress-label">
        <span>整体进度</span>
        <span class="progress-value">{{ stats.overallProgress }}%</span>
      </div>
      <el-progress
        :percentage="stats.overallProgress"
        :color="progressColor"
        :stroke-width="10"
        :show-text="false"
      />
    </div>

    <div class="stats-grid">
      <div class="stat-item completed">
        <div class="stat-icon">
          <el-icon><CircleCheckFilled /></el-icon>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.completed }}</span>
          <span class="stat-label">已完成</span>
        </div>
      </div>

      <div class="stat-item in-progress">
        <div class="stat-icon">
          <el-icon><Loading /></el-icon>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.inProgress }}</span>
          <span class="stat-label">进行中</span>
        </div>
      </div>

      <div class="stat-item pending">
        <div class="stat-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.pending }}</span>
          <span class="stat-label">未开始</span>
        </div>
      </div>

      <div class="stat-item overdue">
        <div class="stat-icon">
          <el-icon><WarningFilled /></el-icon>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.overdue }}</span>
          <span class="stat-label">已超期</span>
        </div>
      </div>
    </div>

    <div class="stats-chart">
      <div class="chart-title">任务分布</div>
      <div class="chart-bar">
        <div
          class="bar-segment completed"
          :style="{ width: getPercent(stats.completed) + '%' }"
          v-if="stats.completed > 0"
        />
        <div
          class="bar-segment in-progress"
          :style="{ width: getPercent(stats.inProgress) + '%' }"
          v-if="stats.inProgress > 0"
        />
        <div
          class="bar-segment pending"
          :style="{ width: getPercent(stats.pending) + '%' }"
          v-if="stats.pending > 0"
        />
      </div>
      <div class="chart-legend">
        <span class="legend-item completed">
          <i></i>已完成
        </span>
        <span class="legend-item in-progress">
          <i></i>进行中
        </span>
        <span class="legend-item pending">
          <i></i>未开始
        </span>
      </div>
    </div>

    <div class="milestone-info" v-if="stats.milestones > 0">
      <el-icon><Flag /></el-icon>
      <span>{{ stats.milestones }} 个里程碑</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CircleCheckFilled,
  Loading,
  Clock,
  WarningFilled,
  Flag
} from '@element-plus/icons-vue'
import type { StatsData } from '../types'

interface Props {
  stats: StatsData
}

const props = defineProps<Props>()

const progressColor = computed(() => {
  const p = props.stats.overallProgress
  if (p >= 100) return '#67c23a'
  if (p >= 70) return '#409eff'
  if (p >= 40) return '#e6a23c'
  return '#f56c6c'
})

function getPercent(value: number): number {
  const total = props.stats.completed + props.stats.inProgress + props.stats.pending
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
</script>

<style scoped lang="scss">
.stats-panel {
  padding: 20px;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

.overall-progress {
  margin-bottom: 24px;

  .progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-secondary);

    .progress-value {
      font-weight: 600;
      color: var(--primary-color);
    }
  }

  :deep(.el-progress-bar__outer) {
    border-radius: 5px;
    background-color: var(--bg-secondary);
  }

  :deep(.el-progress-bar__inner) {
    border-radius: 5px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &.completed {
      background: linear-gradient(135deg, rgba(103, 194, 58, 0.1), rgba(103, 194, 58, 0.05));

      .stat-icon {
        background: rgba(103, 194, 58, 0.15);
        color: #67c23a;
      }
    }

    &.in-progress {
      background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.05));

      .stat-icon {
        background: rgba(64, 158, 255, 0.15);
        color: #409eff;
      }
    }

    &.pending {
      background: linear-gradient(135deg, rgba(230, 162, 60, 0.1), rgba(230, 162, 60, 0.05));

      .stat-icon {
        background: rgba(230, 162, 60, 0.15);
        color: #e6a23c;
      }
    }

    &.overdue {
      background: linear-gradient(135deg, rgba(245, 108, 108, 0.1), rgba(245, 108, 108, 0.05));

      .stat-icon {
        background: rgba(245, 108, 108, 0.15);
        color: #f56c6c;
      }
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;

      .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.2;
      }

      .stat-label {
        font-size: 12px;
        color: var(--text-tertiary);
      }
    }
  }
}

.stats-chart {
  margin-bottom: 16px;

  .chart-title {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 10px;
  }

  .chart-bar {
    height: 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
    display: flex;
    overflow: hidden;
    margin-bottom: 10px;

    .bar-segment {
      height: 100%;
      transition: width 0.3s ease;

      &.completed {
        background: #67c23a;
      }

      &.in-progress {
        background: #409eff;
      }

      &.pending {
        background: #e6a23c;
      }
    }
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 16px;
    font-size: 12px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-tertiary);

      i {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }

      &.completed i {
        background: #67c23a;
      }

      &.in-progress i {
        background: #409eff;
      }

      &.pending i {
        background: #e6a23c;
      }
    }
  }
}

.milestone-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: linear-gradient(135deg, rgba(179, 130, 231, 0.1), rgba(179, 130, 231, 0.05));
  border-radius: 8px;
  font-size: 13px;
  color: var(--primary-color);
}
</style>
