<script setup lang='ts'>
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { LotteryStatus } from '@/views/Home/type'

interface Props {
    currentStatus: LotteryStatus
    tableData: any[]
    drawCount: number
    maxDrawCount: number
    enterLottery: () => void
    startLottery: () => void
    stopLottery: () => void
    continueLottery: () => void
    quitLottery: () => void
    setDrawCount: (count: number) => void
}
const props = defineProps<Props>()

const { currentStatus, tableData, drawCount, maxDrawCount, enterLottery, startLottery, stopLottery, continueLottery, quitLottery, setDrawCount } = toRefs(props)
const { t } = useI18n()

function handleDrawCountChange(event: Event) {
    const target = event.target as HTMLSelectElement
    setDrawCount.value(Number(target.value))
}
</script>

<template>
  <div id="menu">
    <button v-if="currentStatus === LotteryStatus.init && tableData.length > 0" class="btn-neon" @click="enterLottery">
      {{ t('button.enterLottery') }}
    </button>

    <div v-if="currentStatus === LotteryStatus.ready" class="start">
      <div class="ready-controls">
        <button class="btn-stars" @click="startLottery">
          <strong>{{ t('button.start') }}</strong>
          <div id="container-stars">
            <div id="stars" />
          </div>

          <div id="glow">
            <div class="circle" />
            <div class="circle" />
          </div>
        </button>
        <label class="draw-count-control" for="draw-count">
          <span>{{ t('table.drawCount') }}</span>
          <select id="draw-count" :value="drawCount" :disabled="maxDrawCount < 1" @change="handleDrawCountChange">
            <option v-for="count in maxDrawCount" :key="count" :value="count">
              {{ count }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <button v-if="currentStatus === LotteryStatus.running" class="btn-neon btn glass btn-lg" @click="stopLottery">
      {{ t('button.selectLucky') }}
    </button>

    <div v-if="currentStatus === LotteryStatus.end" class="flex justify-center gap-6 enStop">
      <div class="start">
        <button class="btn-stars" @click="continueLottery">
          <strong>{{ t('button.continue') }}</strong>
          <div id="container-stars">
            <div id="stars" />
          </div>

          <div id="glow">
            <div class="circle" />
            <div class="circle" />
          </div>
        </button>
      </div>

      <div class="start">
        <button class="btn-stars btn-cancel" @click="quitLottery">
          <strong>{{ t('button.cancel') }}</strong>
          <div id="container-stars">
            <div id="stars" />
          </div>

          <div id="glow">
            <div class="circle" />
            <div class="circle" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss'
</style>
