// 插入数组封装方法    存储数组，值，定义一个比较函数，数组最大长度
export function editArray(arr, targetItem) {
  // const index = arr.findIndex(compare) ie12+
  for (const item of arr) {
    if (item.id === targetItem.id) {
      const index = arr.indexOf(item)
      // 替换掉当前行数据
      arr.splice(index, 1, targetItem)
      break
    }
  }
}
