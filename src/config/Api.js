// 正式
var Api = {
    BOMGroupUrl: 'SQLReport139',
    BOMImportCheckUrl: 'SQLReport1139',
    BOMSubclassUrl: 'SQLReport85'
}
var url = window.location.href
// console.log(url)
if (url.indexOf('localhost') >= 0) {
    Api = {
        BOMGroupUrl: 'SQLReport75',
        BOMImportCheckUrl: 'SQLReport86',
        BOMSubclassUrl: 'SQLReport85'
    }
}
export default Api
