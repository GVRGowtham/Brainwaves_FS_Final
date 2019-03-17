// async function reConcile(context){
//   const { params, service } = context;
//   let data = context.data;
//   let matchedData = await service.Model("socgen_data").where({ "82A": data["87A"], "87A": data["82A"], "77H": data["77H"], "30T": data["30T"], "30V": data["30V"], "36": data["36"], "32B": data["33B"], "33B": data["32B"], "56": data["56"], "57A": data["57A"], "57D": data["57D"], "58A": data["58A"] });
//   if(matchedData.length>0){
//     context.data.match_status=1;
//     context.data.match_20 = matchedData[0]["20"]
//     for(let i=0;i<matchedData.length;i++){  
//     let update = await service.Model("socgen_data").where('id', '=', matchedData[i].id).update({
//       match_status: 1,
//       match_20: data["20"]
//     });
//     }
//   }else{
//     let misMatchedData = await service.Model("socgen_data").where({ "82A": data["87A"], "87A": data["82A"], "77H": data["77H"], "30T": data["30T"], "30V": data["30V"], "36": data["36"], "32B": data["33B"], "33B": data["32B"] });
//     if(misMatchedData.length>0){
//       context.data.match_status=2;
//       context.data.match_20 = misMatchedData[0]["20"]
//       for(let i=0;i<matchedData.length;i++){  
//       let update = await service.Model("socgen_data").where('id', '=', misMatchedData[i].id).update({
//         match_status: 2,
//         match_20: data["20"]
//       });
//       }
//     }else{
//       context.data.match_status=3
//     }
//   }
//   console.log(context.data);
//   return context;
// }
const {
  pluck,
  alterItems,
} = require('feathers-hooks-common');

let fieldFilter = pluck(
  '20',
  '22A',
  '22C',
  '24D',
  '30T',
  '30V',
  '32B',
  '33B',
  '36',
  '52A',
  '53A',
  '56A',
  '56D',
  '57A',
  '57D',
  '58A',
  '58D',
  '77H',
  '82A',
  '87A',
  'match_status',
  'match_20',
);

async function reConcile(context){
  const { params, service } = context;
  let data = context.data;
  if(params.query.$reconcile){
    let result = await service.Model("other_data");
    for(let i in result){
      let data = result[i];  
      let matchedData = await service.Model("socgen_data").where({ "82A": data["87A"], "87A": data["82A"], "77H": data["77H"], "30T": data["30T"], "30V": data["30V"], "36": data["36"], "32B": data["33B"], "33B": data["32B"], "56": data["56"], "57A": data["57A"], "57D": data["57D"], "58A": data["58A"] });
      if(matchedData.length>0){
        let self_update = await service.Model("other_data").where('id', '=', data.id).update({
          match_status: 1,
          match_20: matchedData[0]["20"]
        });
        for(let i=0;i<matchedData.length;i++){  
        let other_update = await service.Model("socgen_data").where('id', '=', matchedData[i].id).update({
          match_status: 1,
          match_20: data["20"]
        });
        }
      }else{
        let misMatchedData = await service.Model("socgen_data").where({ "82A": data["87A"], "87A": data["82A"], "77H": data["77H"], "30T": data["30T"], "30V": data["30V"], "36": data["36"], "32B": data["33B"], "33B": data["32B"] });
        if(misMatchedData.length>0){
          let self_update = await service.Model("other_data").where('id', '=', data.id).update({
            match_status: 2,
            match_20: misMatchedData[0]["20"]
          });
          for(let i=0;i<misMatchedData.length;i++){  
          let other_update = await service.Model("socgen_data").where('id', '=', misMatchedData[i].id).update({
            match_status: 2,
            match_20: data["20"]
          });
          }
        }else{
          let self_update = await service.Model("other_data").where('id', '=', data.id).update({
            match_status: 3
          });
        }
      }
    }
  }
}

module.exports = {
  before: {
    all: [],
    find: [reConcile],
    get: [],
    create: [fieldFilter],
    update: [fieldFilter],
    patch: [fieldFilter],
    remove: [fieldFilter]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
