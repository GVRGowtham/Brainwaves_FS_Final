
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

async function oneToOneMatch(context) {
  const { params, service } = context;
  if (params.query.$oneMatch) {
    let result = await service.Model("socgen_data");
    let matched_response = {};
    let mismatched_response = {};
    for(let i in result){
      let matchedData = await service.Model("other_data").where({ "82A": result[i]["87A"], "87A": result[i]["82A"], "77H": result[i]["77H"], "30T": result[i]["30T"], "30V": result[i]["30V"], "36": result[i]["36"], "32B": result[i]["33B"], "33B": result[i]["32B"], "56A": result[i]["56D"], "56D": result[i]["56A"], "57A": result[i]["57D"], "57D": result[i]["57A"], "58A": result[i]["58D"], "58D": result[i]["58A"] });
      matched_response[result[i].id] = matchedData;
      let misMatchedData = await service.Model("other_data").where({ "82A": result[i]["87A"], "87A": result[i]["82A"], "77H": result[i]["77H"], "30T": result[i]["30T"], "30V": result[i]["30V"], "36": result[i]["36"] });
      mismatched_response[result[i].id] = misMatchedData;
    }
    for(let i=0;i<result.length;i++){
      result[i]["col_82A"] = result[i]["82A"];
      result[i]["col_87A"] = result[i]["87A"];
      result[i]["formatted_30T"] = result[i]["30T"].toDateString();
    }
    context.result = {data: result, match: matched_response, mismatch: mismatched_response};
  }
  return context
}

async function matchFn(context) {
  const { params, service } = context;
  if (params.query.$match) {
    console.log("RESULT",context);
    let result = params.query.$match.value;
    let matched_response = {};
    let mismatched_response = {};
    for(let i in result){
      let matchedData = await service.Model("other_data").where({ "82A": result[i]["87A"], "87A": result[i]["82A"], "77H": result[i]["77H"], "30T": result[i]["30T"], "30V": result[i]["30V"], "36": result[i]["36"], "32B": result[i]["33B"], "33B": result[i]["32B"], "56A": result[i]["56D"], "56D": result[i]["56A"], "57A": result[i]["57D"], "57D": result[i]["57A"], "58A": result[i]["58D"], "58D": result[i]["58A"] });
      matched_response[result[i].id] = matchedData;
      let misMatchedData = await service.Model("other_data").where({ "82A": result[i]["87A"], "87A": result[i]["82A"], "77H": result[i]["77H"], "30T": result[i]["30T"], "30V": result[i]["30V"], "36": result[i]["36"], "32B": result[i]["33B"], "33B": result[i]["32B"] });
      mismatched_response[result[i].id] = misMatchedData;
    }
    for(let i=0;i<result.length;i++){
      result[i]["col_82A"] = result[i]["82A"];
      result[i]["col_87A"] = result[i]["87A"];
      result[i]["formatted_30T"] = result[i]["30T"];
    }
    context.result = {data: result, match: matched_response, mismatch: mismatched_response};
  }
  return context
}

async function reConcile(context){
  const { params, service } = context;
  // let data = context.data;
  if(params.query.$reconcile){
    let result = await service.Model("socgen_data");
    for(let i in result){
      let data = result[i];  
      let matchedData = await service.Model("other_data").where({ "82A": data["87A"], "87A": data["82A"], "77H": data["77H"], "30T": data["30T"], "30V": data["30V"], "36": data["36"], "32B": data["33B"], "33B": data["32B"], "56A": data["56D"], "56D": data["56A"], "57A": data["57D"], "57D": data["57A"], "58A": data["58D"], "58D": data["58A"] });
      if(matchedData.length>0){
        let self_update = await service.Model("socgen_data").where('id', '=', data.id).update({
          match_status: 1,
          match_20: matchedData[0]["20"]
        });
        for(let i=0;i<matchedData.length;i++){  
        let other_update = await service.Model("other_data").where('id', '=', matchedData[i].id).update({
          match_status: 1,
          match_20: data["20"]
        });
        }
      }else{
        let misMatchedData = await service.Model("other_data").where({ "82A": data["87A"], "87A": data["82A"], "77H": data["77H"], "30T": data["30T"], "30V": data["30V"], "36": data["36"] });
        if(misMatchedData.length>0){
          let self_update = await service.Model("socgen_data").where('id', '=', data.id).update({
            match_status: 2,
            match_20: misMatchedData[0]["20"]
          });
          for(let i=0;i<misMatchedData.length;i++){  
          let other_update = await service.Model("other_data").where('id', '=', misMatchedData[i].id).update({
            match_status: 2,
            match_20: data["20"]
          });
          }
        }else{
          let self_update = await service.Model("socgen_data").where('id', '=', data.id).update({
            match_status: 3
          });
        }
      }
    }
  }

  console.log(context.data);
  return context;
}

module.exports = {
  before: {
    all: [],
    find: [oneToOneMatch,reConcile,matchFn,],
    get: [],
    create: [fieldFilter],
    update: [fieldFilter],
    patch: [fieldFilter],
    remove: []
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
