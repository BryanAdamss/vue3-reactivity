/**
 * @author GuangHui
 * @description 入口
 */

let price = 10
let quantity = 1
let total = 0

// 保存 total/price/quantity 关系
const effect = (total = price * quantity)

// 首次计算 total
effect()

quantity = 2

// quantity 改变后,重新计算total
effect()
