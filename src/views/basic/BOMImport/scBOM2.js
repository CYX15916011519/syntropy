var list = [
    { level: 0, name: "A" },
    { level: 1, name: "A" },
    { level: 1, name: "A" },
    { level: 2, name: "A" },
    { level: 2, name: "A" },
    { level: 2, name: "A" },
    { level: 3, name: "A" },
    { level: 1, name: "A" },
    { level: 2, name: "A" },
    { level: 1, name: "A" },
    { level: 2, name: "A" },
    { level: 3, name: "A" },
    { level: 1, name: "A" },
    { level: 1, name: "A" },
    { level: 1, name: "A" },
    { level: 1, name: "A" },
    { level: 1, name: "A" },
    { level: 0, name: "A" },
    { level: 1, name: "A" },
    { level: 1, name: "A" },
    { level: 2, name: "A" },
    { level: 2, name: "A" },
    { level: 2, name: "A" },
    { level: 3, name: "A" },
    { level: 1, name: "A" },
]


function test() {

    const result = []

    for (let i = 0; i < list.length; i++) {

        const row = list[i];
        //第一级
        const resultItem = {
            level: row.level,
            name: row.name,
            children: []
        }

        for (let j = i + 1; j < list.length; j++) {
            const nextRow = list[j];
            //如果当前行LEVEL与下一行的LEVEL相同，即是同级别，则结束子循环
            if (nextRow.level === row.level) {
                break;
            }

            //如果当前行LEVEL+1与下一行的LEVEL相等，即下一行属于本行明细,插入到children中
            if (nextRow.level === row.level + 1) {
                resultItem.children.push(
                    {
                        level: nextRow.level,
                        name: nextRow.name
                    }
                )
            }

        }

        if (resultItem.children.length > 0)
            result.push(resultItem)

    }

    console.log(result);

}