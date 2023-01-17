/**
 * @author GuangHui
 * @description 重新计算
 */

let price = 10
let quantity = 1
let total = 0

// 保存 total/price/quantity 关系
const effect = () => (total = price * quantity)

// 首次计算 total
effect()
console.log(`total is ${total}`)

quantity = 2
console.log(`quantity change to ${quantity}`)

// quantity 改变后,重新计算total
effect()

console.log(`total is ${total}`)
