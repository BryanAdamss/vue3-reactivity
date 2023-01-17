/**
 * @author GuangHui
 * @description 处理多个对象
 */

let product = { price: 10, quantity: 1 }
let total = 0

let user = { firstName: 'Tom', lastName: 'Cat' }
let userName = ''

const effect = () => (total = product.price * product.quantity)
const effectForUser = () => (userName = `${user.firstName}${user.lastName}`)

/* targetMap key 直接保存响应对象,value 为depsMap */
const targetMap = new WeakMap()

/* 对象每个属性都有自己的依赖,需要 map 存储,key 为对象属性,value 为属性的依赖 Set,Set 保存依赖副作用 effect */
const depsMap = new Map()

/* 此处多个响应对象 effect 不同,所以用参数传入,实际 vue3有个 activeEffect保存当前effect */
function track(target, key, effect) {
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map())) // 不存在则创建一个 depsMap并保存

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set())) // 不存在则创建一个 Set

  dep.add(effect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  let dep = depsMap.get(key)

  if (dep) {
    dep.forEach(effect => effect())
  }
}

/* 追踪 product.quantity */
track(product, 'quantity', effect)
effect()
console.log(`total is ${total}`)

product.quantity = 2
console.log(`quantity change to ${product.quantity}`)

/*product.quantity 改变后,重新计算total */
trigger(product, 'quantity')
console.log(`total is ${total}`)

console.log('---------------------------------')

/* 追踪 user.lastName */
track(user, 'lastName', effectForUser)
effectForUser()
console.log(`userName is ${userName}`)

user.lastName = 'Clus'
console.log(`user.lastName change to ${user.lastName}`)

/* user.lastName 改变后,重新计算total */
trigger(user, 'lastName')
console.log(`userName is ${userName}`)
