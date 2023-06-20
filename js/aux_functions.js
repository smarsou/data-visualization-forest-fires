async function getIdsFromData(datac){
    var data = datac
    const response = await fetch(path_communes_dataset);
    const communes = await response.json();
    const response2 = await fetch(path_communes_svg);
    const communes_converted = await response2.json();
    var ids = [];
    for (const i in data){
        index = communes.indexOf(data[i]["Nom de la commune"]);
        ids.push(communes_converted[index]);
    }
    return ids
}

function query (data) {
    let chars_get = _.chain(data)
      .map(item => [item?.["Code INSEE"],item?.["Nom de la commune"]])
      .value();
    let chars = [...new Set(chars_get)];
    for (let i = 0; i < chars.length; i++) {
       chars[i][1]=chars[i][1].toUpperCase().split(/[()]+/)
       if (chars[i][1].length == 1){
          chars[i][1] = chars[i][1][0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '')
       }else{
          chars[i][1] = chars[i][1][1].normalize('NFD').replace(/[\u0300-\u036f]/g, '') +" " + chars[i][1][0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '')
       }
          chars[i] = chars[i][0].toString() + " " + chars[i][1]
    }
    return chars
  }
