/**
 * @author GuangHui
 * @description proxy
 */

let product = { price: 10, quantity: 1 }

const proxiedProduct = new Proxy(product, {
  get(target, key, receiver) {
    console.log(`Get was called with key = ${key}`)

    return Reflect.get(target, key, receiver)
  },

  set(target, key, value, receiver) {
    console.log(`Set was called with key =${key} and value = ${value}`)
    return Reflect.set(target, key, value, receiver)
  },
})

console.log(`product.price is ${proxiedProduct.price}`)

proxiedProduct.price = 100

console.log(`product.price is ${proxiedProduct.price}`)
