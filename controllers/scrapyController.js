
var ScrapyModel = require('../schema/scrapySchema')
var StandarsModel = require('../schema/standarSchema')
var xlsx =  require('node-xlsx');
// var superagent = require('superagent');
// var cheerio = require('cheerio');
// const defaultUrl = 'http://bid.9to.com/list.php/catid-234';
// exports.index = async (req, respond) => {
//     var targetUrl = defaultUrl;
//     for (var i=0; i<10; i++){
//         if(i !== 0) {
//             targetUrl = `${defaultUrl}-page-${i+1}/`
//         }
//         superagent.get(targetUrl)
//         .end(function (err, res) {
//           var $ = cheerio.load(res.text);
//           var urlList = []
//           //获取每条详细内容的url
//        $('.catlist ul').find('li').each(function (idx, element) {
//               // console.log( element.children[1]);
//               if(!element.children[1] || !element.children[1].attribs) {
//                 // console.log(idx)
//               }else {
//                 urlList.push(element.children[1].attribs.href)
//                 // console.log(element.children[1].attribs.href)
//               }
    
//           });
//           for(let i of urlList) {
//             superagent.get(i).retry(urlList.length)
//             .end( async function (error, resp) {
//               var $_this = cheerio.load(resp.text);
//             const title = $_this('#title')[0].children[0].data
//               const content =$_this('#article').html()
//               const date  =$_this('.info').text()
//                   //存进数据库
//                   const result = await ScrapyModel.create({
//                       title: title,
//                       url: i,
//                       date:date,
//                       content:content
//                   })
//           })
//           }
//         })
//     }

//     respond.status(200).send({
//         message:'创建成功'
//     })
// }

exports.index = async (req, respond) => {
  const workSheetsFromFile = xlsx.parse(`${__dirname}/data.xls`);
 return       respond.status(200).send({
     message:'成功',
     data:{
         workSheetsFromFile
     }
 })
  const arr1 = []
  const arr2 = []
  const arr3 = []
  for(let [index,i] of workSheetsFromFile[0].data.entries()) {
    if(i[0]) arr1.push({name:i[0],value:index,type:'00'})
    if(i[1]) arr2.push({name:i[1],value:index,type:'01'})
    if(i[2]) arr3.push({name:i[2],value:index,type:'02'})
  }
  for(let i of [...arr1,...arr2,...arr3]) {
    const result = await StandarsModel.create({
                            name: i.name,
                            type: i.type,
                            value:i.value
                        })
  }
      respond.status(200).send({
        message:'成功',
        data:{
          arr:[...arr1,...arr2,...arr3]
        }
    })

}