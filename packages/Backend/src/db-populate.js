var fs = require('fs');
const axios = require('axios');

//Load SocGen data from folder
for(let i=1;i<=10;i++){
    fs.readFile('/Users/a212687477/Desktop/Full Stack Hackathon - Offline/Resources/NewSampleData-930PM/one to one/Sample/SG one to one/'+i+'_message.txt',function(err,data){
        if(err) throw err;
        // console.log(data.toString());
        str = data.toString();
        let json_data={
        '20':null,
        '22A':null,
        '22C':null,
        '24D':null,
        '30T':null,
        '30V':null,
        '32B':null,
        '33B':null,
        '36':null,
        '52A':null,
        '53A':null,
        '56A':null,
        '56D':null,
        '57A':null,
        '57D':null,
        '58A':null,
        '58D':null,
        '77H':null,
        '82A':null,
        '87A':null,
        'match_status':null,
        'match_20':null
        };
        let str_splitted_line = str.split("\n");
        str_splitted_line.pop();
        str_splitted_line.splice(0,1);
        for(let i=0;i<str_splitted_line.length;i++){
            str_splitted_line[i] = str_splitted_line[i].trim();
        }
        for(let i=0;i<str_splitted_line.length;i++){
            let splits = str_splitted_line[i].split(":");
            if(splits[0]=="SG Ref"){
                json_data["20"]=(splits[1]);
            }else if(splits[1]=="30V"){
                date_split = splits[2].split("/")
                json_data[splits[1]]=new Date();
                json_data[splits[1]].setDate(date_split[0]);
                json_data[splits[1]].setMonth(date_split[1]);
                json_data[splits[1]].setYear(date_split[2]);
            }else if(splits[1]=="30T"){
                date_split = splits[2].split("/")
                json_data[splits[1]]=new Date();
                json_data[splits[1]].setDate(date_split[0]);
                json_data[splits[1]].setMonth(date_split[1]);
                json_data[splits[1]].setYear(date_split[2]);
            }else{
                json_data[splits[1]]=(splits[2]);
            }
        }
        console.log(json_data);
        axios.post('http://localhost:3030/socgen-data', json_data)
          .then(function (response) {
            // console.log(response);
          })
          .catch(function (error) {
            // console.log(error);
          });
    });
}

//Load Client data from folder
for(let i=1;i<=10;i++){
    fs.readFile('/Users/a212687477/Desktop/Full Stack Hackathon - Offline/Resources/NewSampleData-930PM/one to one/Sample/Client one to one/'+i+'_message.txt',function(err,data){
        if(err) throw err;
        // console.log(data.toString());
        str = data.toString();
        let json_data={
        '20':null,
        '22A':null,
        '22C':null,
        '24D':null,
        '30T':null,
        '30V':null,
        '32B':null,
        '33B':null,
        '36':null,
        '52A':null,
        '53A':null,
        '56A':null,
        '56D':null,
        '57A':null,
        '57D':null,
        '58A':null,
        '58D':null,
        '77H':null,
        '82A':null,
        '87A':null,
        'match_status':null,
        'match_20':null
        };
        let str_splitted_line = str.split("\n");
        str_splitted_line.pop();
        str_splitted_line.splice(0,1);
        for(let i=0;i<str_splitted_line.length;i++){
            str_splitted_line[i] = str_splitted_line[i].trim();
        }
        for(let i=0;i<str_splitted_line.length;i++){
            let splits = str_splitted_line[i].split(":");
            if(splits[0]=="SG Ref"){
                json_data["20"]=(splits[1]);
            }else if(splits[1]=="30V"){
                date_split = splits[2].split("/")
                json_data[splits[1]]=new Date();
                json_data[splits[1]].setDate(date_split[0]);
                json_data[splits[1]].setMonth(date_split[1]);
                json_data[splits[1]].setYear(date_split[2]);
            }else if(splits[1]=="30T"){
                date_split = splits[2].split("/")
                json_data[splits[1]]=new Date();
                json_data[splits[1]].setDate(date_split[0]);
                json_data[splits[1]].setMonth(date_split[1]);
                json_data[splits[1]].setYear(date_split[2]);
            }else{
                json_data[splits[1]]=(splits[2]);
            }
        }
        console.log(json_data);
        axios.post('http://localhost:3030/other-data', json_data)
          .then(function (response) {
            // console.log(response);
          })
          .catch(function (error) {
            // console.log(error);
          });
    });
}