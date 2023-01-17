/**
 * @author GuangHui
 * @description 入口
 */

let price = 10
let quantity = 1
let total = price * quantity

console.log(`total is ${total}`)

quantity = 2
console.log(`quantity change to ${quantity}`)

// total 未自动重新计算
console.log(`total is ${total}`)
