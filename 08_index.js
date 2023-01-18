/**
 * @author GuangHui
 * @description 初步实现
 */
/* targetMap key 直接保存响应对象,value 为depsMap */
const targetMap = new WeakMap()

function track(target, key) {
  console.count('track count')
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map())) // 不存在则创建一个 depsMap并保存

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set())) // 不存在则创建一个 Set
  dep.add(effect)
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

const effect = () => (total = product.price * product.quantity)
effect()

console.log(`total is ${total}`)

product.quantity = 2 // ! 触发 setter->trigger->执行 effect->又读取了属性->执行 track ,导致一次 set track 执行了多次
console.log(`total is ${total}`)
