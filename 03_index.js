/**
 * @author GuangHui
 * @description 抽象存储effect和执行过程
 */

let price = 10
let quantity = 1
let total = 0

let totalPlus10 = 0 // 奸商加价10元

// 保存 total/price/quantity 关系
const effect = () => (total = price * quantity)
const effect2 = () => (totalPlus10 = price * quantity + 10)

// 希望 quantity改变时,total 和 totalPlus10都变化,所以需要一个地方存储 effect和 effect2
const dep = new Set()

const track = effect => dep.add(effect)

track(effect)
track(effect2)

const trigger = () => dep.forEach(effect => effect())

// 首次计算 total和 totalPlus10
trigger()
console.log(`total is ${total}`)

quantity = 2
console.log(`quantity change to ${quantity}`)

// quantity 改变后,重新计算total和totalPlus10
trigger()

console.log(`total is ${total}`)
console.log(`totalPlus10 is ${totalPlus10}`)
