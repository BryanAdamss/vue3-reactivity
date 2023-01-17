/**
 * @author GuangHui
 * @description 多 effect
 */

let price = 10
let quantity = 1
let total = 0

let totalPlus10 = 0 // 奸商加价10元

// 保存 total/price/quantity 关系
const effect = (total = price * quantity)

const effect2 = (totalPlus10 = price * quantity + 10)

// 希望 quantity改变时,total 和 totalPlus10都变化,所以需要一个地方存储 effect和 effect2
const dep = new Set()

dep.add(effect)
dep.add(effect2)

// 首次计算 total和 totalPlus10
dep.forEach(effect => effect())

quantity = 2

// quantity 改变后,重新计算total和totalPlus10
dep.forEach(effect => effect())
