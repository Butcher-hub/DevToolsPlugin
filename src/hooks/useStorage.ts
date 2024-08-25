
const useStorage = (key: string, value?: any) => {
  return new Promise((resolve) => {
    if (value) {
      let obj: { [key: string]: any } = {}
      obj[key] = value
      chrome.storage.local.set(obj, () => {
        resolve(value)
      })
    } else {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key])
      })
    }
  })
}

export default useStorage