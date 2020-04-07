// BOM数据
var BomJsonList = [
    { level: 0, name: A },
    { level: 1, name: A },
    { level: 1, name: A },
    { level: 2, name: A },
    { level: 2, name: A },
    { level: 2, name: A },
    { level: 3, name: A },
    { level: 1, name: A },
    { level: 2, name: A },
    { level: 1, name: A },
    { level: 2, name: A },
    { level: 3, name: A },
    { level: 1, name: A },
    { level: 1, name: A },
    { level: 1, name: A },
    { level: 1, name: A },
    { level: 1, name: A },
    { level: 2, name: A },
    { level: 3, name: A },
]
// 初始化
function Init() {
    CreateDic()
    CreateBOM()
}
// 每个 数字有多少个
var diclist = {}
function CreateDic() {
    BomJsonList.forEach(f => {
        if (diclist.hasOwnProperty(f.level)) {
            diclist[f.level] = diclist[f.level] + 1
        } else {
            diclist[f.level] = 1
        }
    });
    console.log(diclist)
}
// 模板
var BOMTemplate = {
    level: '',
    name: '',
    child: [
        {
            level: '',
            name: '',
        }
    ]
}
// 最终结果
var BOMList = []
// 生成最终模板
function CreateBOM() {
    var keylist = Object.keys(diclist)
    keylist.forEach(f => {
        var num = f // 数字
        var value = diclist[f]  // 数字的总数
        // 循环次数
        for (let index = 0; index < value; index++) {
            var yudao = -1
            var GetTF = false
            var obj = {}
            var child = []
            BomJsonList.forEach(k => {
                if (k.level === num) { yudao++ }
                if (k.level === num && yudao === index) { 
                    GetTF = true 
                    obj = k 
                }
                if (GetTF && yudao === index) {
                    if (k.level === num + 1) {
                        child.push(k)
                    }
                }
            })
            obj.child = child
            BOMList.push(obj)
        }
    })
    console.log(BOMList)
}

