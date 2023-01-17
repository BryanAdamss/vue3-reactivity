/**
 * @author GuangHui
 * @description 处理对象
 */

let product = { price: 10, quantity: 1 }
let total = 0

const effect = () => (total = product.price * product.quantity)

/* 对象每个属性都有自己的依赖,需要 map 存储,key 为对象属性,value 为属性的依赖 Set,Set 保存依赖副作用 effect */
const depsMap = new Map()

function track(key) {
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set())) // 不存在则创建一个 Set

  dep.add(effect)
}

function trigger(key) {
  let dep = depsMap.get(key)

  if (dep) {
    dep.forEach(effect => effect())
  }
}

/* 追踪 quantity */
track('quantity')

/* 首次计算 total */
effect()
console.log(`total is ${total}`)

product.quantity = 2
console.log(`quantity change to ${product.quantity}`)

/* quantity 改变后,重新计算total */
trigger('quantity')

console.log(`total is ${total}`)
