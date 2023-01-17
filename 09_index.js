/**
 * @author GuangHui
 * @description 修复多次 track
 */

/* targetMap key 直接保存响应对象,value 为depsMap */
const targetMap = new WeakMap()

/* 对象每个属性都有自己的依赖,需要 map 存储,key 为对象属性,value 为属性的依赖 Set,Set 保存依赖副作用 effect */
const depsMap = new Map()

function track(target, key) {
  // ! activeEffect 存在时才 track
  if (activeEffect) {
    console.count('track count')
    let depsMap = targetMap.get(target)
    if (!depsMap) targetMap.set(target, (depsMap = new Map())) // 不存在则创建一个 depsMap并保存

    let dep = depsMap.get(key)
    if (!dep) depsMap.set(key, (dep = new Set())) // 不存在则创建一个 Set
    // ! 保存activeEffect
    dep.add(activeEffect)
  }
}

function trigger(target, key) {
  console.count(`trigger count`)
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  let dep = depsMap.get(key)

  if (dep) {
    dep.forEach(effect => effect())
  }
}

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      console.log(`Get was called with key = ${key}`)
      // 读取属性时,追踪依赖
      track(target, key)
      return Reflect.get(target, key, receiver)
    },

    set(target, key, value, receiver) {
      console.log(`Set was called with key =${key} and value = ${value}`)
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      // 值变化时,触发 trigger
      if (oldValue !== value) {
        trigger(target, key)
      }
      return result
    },
  }

  return new Proxy(target, handler)
}

const product = reactive({ price: 10, quantity: 1 })
let total = 0
let scalePrice = 0

// const effect = () => (total = product.price * product.quantity)
// effect()

// ! track 只应该在首次执行 effec 时调用,trigger触发时,不应该再 track
// ! 通过 activeEffect 和 effect改造,保证 activeEffect 只在 effect()调用时有效
// ! 在track 时判断 activeEffect 是否存在,决定是否 track
let activeEffect = null

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

effect(() => {
  total = product.price * product.quantity
})

effect(() => {
  scalePrice = product.price * 0.9
})

console.log(`total is ${total}`)

product.quantity = 2 // !  只触发一次
console.log(`total is ${total}`)

console.log('--------------')

product.price = 100

console.log(
  `total is ${total} and price is ${product.price} and scalePrice is ${scalePrice}`
)
