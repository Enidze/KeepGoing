/*
* 1 上传图片
*/
export let getImageUrlAndCover = (res, file, fileDir) => {
  let imageUrl = URL.createObjectURL(file.raw)
  let filename = res['file']['filename']
  let suffix = res['file']['mimetype'].split('/')[1]
  if (suffix === 'jpeg') {
    suffix = 'jpg'
  }
  let cover = `http://localhost:3000/getResources?url=${filename}.${suffix}&fileDir=${fileDir}`

  return { imageUrl: imageUrl, cover: cover }
}

/*
* 2 将对象中的每个键对应的值设为''
*/
export let clear = (object) => {
  for (let key in object) {
    if (!object.hasOwnProperty(key)) continue
    object[key] = ''
  }
}

/*
* 3 按页码显示相应的信息
*/
export let showList = (page, allList, num) => {
  let show = []
  for (let i = 0; i < num; i++) {
    let temp = i + (page - 1) * num
    if (allList[temp] === undefined) {
      break
    }
    show.push(allList[temp])
  }
  return show
}

/*
* 4 Table表格筛选
* filters：选择的属性和值       {strong:'H2'}
* list：所有的属性和值          {strong:['H1',……],part:['全身',……]}
* filterList：可选的属性        {strong:'',part:''}
*/
export let filter = (filters, list, filterList) => {
  let key = Object.keys(filters)[0]
  filterList[key] = `'${filters[key][0]}'`
  for (let key in filterList) {
    if (!filterList.hasOwnProperty(key)) continue
    if (!filterList[key] || filterList[key] === '\'undefined\'') {
      filterList[key] = []
      for (let index in list[key]) {
        if (!list[key].hasOwnProperty(index)) continue
        filterList[key].push(`'${list[key][index].value}'`)
      }
    }
  }
  return filterList
}

export let articleHref = (sort, id) => {
  $(window).attr('location', `/#/article/${sort}-${id}`)
}

/*
* 过期返回true，没过期返回false*/
export let overdue = (deadline) => {
  let now = new Date()
  let year = now.getFullYear().toString()
  let month = (now.getMonth() + 1).toString()
  let date = now.getDate().toString()
  deadline = deadline.split('.')
  /*1-9月和1-9号补个零*/
  if (month.length < 2) {
    month = '0' + month
  }
  if (date.length < 2) {
    date = '0' + date
  }
  /*过期情况
  1 year > deadline[0]
  2 year === deadline[0] && month > deadline[1]
  3 year === deadline[0] && month === deadline[1] && date > deadline[2]
  */
  console.log(year, month, date)
  return year > deadline[0] || (year === deadline[0] && month > deadline[1] || (month === deadline[1] && date > deadline[2]))
}

/*收藏和取消收藏
* 文章/视频 Object
* 收藏/取消 Boolean
* id编号 Array*/
export let collect = (item, op, id) => {
  if (item) {
    /*先把item中的id添加到新的Array中*/
    let newIdList = []
    for (let index in item) {
      if (!item.hasOwnProperty(index)) continue;
      newIdList.push(item[index].id)
    }
    /*判断是添加还是取消 添加=>true 取消=>false*/
    if (op) {
      return `${newIdList.toString()},${id.toString()}`
    } else {
      for (let i in newIdList) {
        if (!newIdList.hasOwnProperty(i)) continue;
        for (let j in id) {
          if (!id.hasOwnProperty(j)) continue;
          if (newIdList[i] === id[j]) {
            newIdList.splice(parseInt(i),1)
          }
        }
      }
      return newIdList.toString()
    }
  } else {
    return id.toString()
  }
}