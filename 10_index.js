/**
 * @author GuangHui
 * @description 实现 ref
 */

/* targetMap key 直接保存响应对象,value 为depsMap */
const targetMap = new WeakMap()

function track(target, key) {
  // activeEffect 存在时才 track
  if (activeEffect) {
    console.count('track count')
    let depsMap = targetMap.get(target)
    if (!depsMap) targetMap.set(target, (depsMap = new Map())) // 不存在则创建一个 depsMap并保存

    let dep = depsMap.get(key)
    if (!dep) depsMap.set(key, (dep = new Set())) // 不存在则创建一个 Set

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

function ref(initalValue) {
  // * 方法一,use reactive
  // return reactive({ value: initalValue })
  // * 方法二, use object get/set method
  const r = {
    get value() {
      track(r, 'value')
      return initalValue
    },

    set value(newVal) {
      if (newVal === initalValue) return // 若无此判断,则会由于 trigger->effect->设置 scalePrice.value 触发 set->trigger->effect... 进入死循环

      initalValue = newVal

      trigger(r, 'value')
    },
  }

  return r
}

const product = reactive({ price: 10, quantity: 1 })
let scalePrice = ref(0) // ! 响应式
let total = 0

let activeEffect = null

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

effect(() => {
  total = scalePrice.value * product.quantity // ! 调整total计算方式,折扣价*数量
})

effect(() => {
  scalePrice.value = product.price * 0.9 // ! 改变时,total 会自动变化
})

console.log(`total is ${total}`)

product.quantity = 2
console.log(`total is ${total}`)

console.log('--------------')

product.price = 100

console.log(
  `total is ${total} and price is ${product.price} and scalePrice is ${scalePrice}`
)
