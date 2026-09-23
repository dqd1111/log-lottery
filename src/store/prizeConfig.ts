import type { IPrizeConfig } from '@/types/storeType'
import { defineStore } from 'pinia'
import { defaultCurrentPrize, defaultPrizeList } from './data'

function cloneSinglePrize(prize: IPrizeConfig): IPrizeConfig {
    return {
        ...prize,
        sort: 1,
        isShow: true,
        picture: { ...prize.picture },
        separateCount: {
            enable: false,
            countList: [],
        },
    }
}

export const usePrizeConfig = defineStore('prize', {
    state() {
        return {
            prizeConfig: {
                prizeList: defaultPrizeList,
                currentPrize: defaultCurrentPrize,
                temporaryPrize: {
                    id: '',
                    name: '',
                    sort: 0,
                    isAll: false,
                    count: 1,
                    isUsedCount: 0,
                    picture: {
                        id: '-1',
                        name: '',
                        url: '',
                    },
                    separateCount: {
                        enable: true,
                        countList: [],
                    },
                    desc: '',
                    isShow: false,
                    isUsed: false,
                    frequency: 1,
                } as IPrizeConfig,
            },
        }
    },
    getters: {
    // 获取全部配置
        getPrizeConfigAll(state) {
            return state.prizeConfig
        },
        // 获取奖品列表
        getPrizeConfig(state) {
            return state.prizeConfig.prizeList
        },
        // 根据id获取配置
        getPrizeConfigById(state) {
            return (id: number | string) => {
                return state.prizeConfig.prizeList.find(item => item.id === id)
            }
        },
        // 获取当前奖项
        getCurrentPrize(state) {
            return state.prizeConfig.currentPrize
        },
        // 获取临时的奖项
        getTemporaryPrize(state) {
            return state.prizeConfig.temporaryPrize
        },

    },
    actions: {
        // The draw page is intentionally limited to one prize.
        ensureSinglePrize() {
            const currentPrizeId = this.prizeConfig.currentPrize?.id
            const sourcePrize = this.prizeConfig.prizeList.find(item => item.id === currentPrizeId)
              || this.prizeConfig.prizeList[0]
              || defaultCurrentPrize
            const singlePrize = cloneSinglePrize(sourcePrize)
            this.prizeConfig.prizeList = [singlePrize]
            this.prizeConfig.currentPrize = singlePrize
        },
        // 设置奖项
        setPrizeConfig(prizeList: IPrizeConfig[]) {
            const singlePrize = cloneSinglePrize(prizeList[0] || defaultCurrentPrize)
            this.prizeConfig.prizeList = [singlePrize]
            this.prizeConfig.currentPrize = singlePrize
        },
        // Keep the saved progress consistent when an existing winner list repairs stale prize state.
        syncCurrentPrizeProgress(usedCount: number) {
            const currentPrize = this.prizeConfig.currentPrize
            const prizeListItem = this.prizeConfig.prizeList.find(item => item.id === currentPrize?.id)
            const prizes = prizeListItem && prizeListItem !== currentPrize
                ? [prizeListItem, currentPrize]
                : [prizeListItem || currentPrize]
            const count = Math.max(Math.floor(Number(currentPrize?.count)) || 0, 1)
            const normalizedUsedCount = Math.min(Math.max(Math.floor(Number(usedCount)) || 0, 0), count)

            prizes.forEach((prize) => {
                if (!prize) {
                    return
                }
                prize.count = count
                prize.isUsedCount = normalizedUsedCount
                prize.isUsed = normalizedUsedCount >= count
            })
        },
        // 添加奖项
        addPrizeConfig(prizeConfigItem: IPrizeConfig) {
            this.setPrizeConfig([prizeConfigItem])
        },
        // 删除奖项
        deletePrizeConfig(prizeConfigItemId: number | string) {
            if (this.prizeConfig.prizeList[0]?.id === prizeConfigItemId) {
                this.resetDefault()
            }
        },
        // 更新奖项数据
        updatePrizeConfig(prizeConfigItem: IPrizeConfig) {
            const prizeListLength = this.prizeConfig.prizeList.length
            if (prizeConfigItem.isUsed && prizeListLength) {
                for (let i = 0; i < prizeListLength; i++) {
                    if (!this.prizeConfig.prizeList[i].isUsed) {
                        this.setCurrentPrize(this.prizeConfig.prizeList[i])
                        break
                    }
                }
            }
            else {
                return
            }
            this.resetTemporaryPrize()
        },
        // 删除全部奖项
        deleteAllPrizeConfig() {
            this.resetDefault()
        },
        // 设置当前奖项
        setCurrentPrize(prizeConfigItem: IPrizeConfig) {
            this.prizeConfig.currentPrize = prizeConfigItem
        },
        // 设置临时奖项
        setTemporaryPrize(prizeItem: IPrizeConfig) {
            if (prizeItem.isShow === false) {
                for (let i = 0; i < this.prizeConfig.prizeList.length; i++) {
                    if (this.prizeConfig.prizeList[i].isUsed === false) {
                        this.setCurrentPrize(this.prizeConfig.prizeList[i])

                        break
                    }
                }
                this.resetTemporaryPrize()

                return
            }

            this.prizeConfig.temporaryPrize = prizeItem
        },
        // 重置临时奖项
        resetTemporaryPrize() {
            this.prizeConfig.temporaryPrize = {
                id: '',
                name: '',
                sort: 0,
                isAll: false,
                count: 1,
                isUsedCount: 0,
                picture: {
                    id: '-1',
                    name: '',
                    url: '',
                },
                separateCount: {
                    enable: true,
                    countList: [],
                },
                desc: '',
                isShow: false,
                isUsed: false,
                frequency: 1,
            } as IPrizeConfig
        },
        // 重置所有配置
        resetDefault() {
            this.prizeConfig = {
                prizeList: defaultPrizeList,
                currentPrize: defaultCurrentPrize,
                temporaryPrize: {
                    id: '',
                    name: '',
                    sort: 0,
                    isAll: false,
                    count: 1,
                    isUsedCount: 0,
                    picture: {
                        id: '-1',
                        name: '',
                        url: '',
                    },
                    separateCount: {
                        enable: true,
                        countList: [],
                    },
                    desc: '',
                    isShow: false,
                    isUsed: false,
                    frequency: 1,
                } as IPrizeConfig,
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                // 如果要存储在localStorage中
                storage: localStorage,
                key: 'prizeConfig',
            },
        ],
    },
})
