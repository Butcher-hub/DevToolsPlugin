
const useStorage = (key: string, value?: any) => {
  return new Promise((resolve) => {
    if (value) {
      setValue(key, value, resolve)
    } else {
      getValue(key, resolve)
    }
  })
}

const setValue = (key: string, value: any, resolve: any) => {
  let obj: { [key: string]: any } = {}
  obj[key] = value
  try {
    chrome.storage.local.set(obj, () => {
      resolve(value)
    })
  } catch (err) {
    localStorage.setItem(key, JSON.stringify(value))
    resolve(value)
  }
}

const getValue = (key: string, resolve: any) => {
  try {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key])
    })
  } catch (err) {
    resolve(JSON.parse(localStorage.getItem(key) || '""'))
  }
}

export default useStorage