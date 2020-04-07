const FPercentUnitID = [
  { FNumber: '01', FName: '个' },
  { FNumber: '02', FName: '张' }
]
const FMaterielType = [{ FNumber: 'COM', FName: '普通件' }]
const FMarshalType = [
  { FNumber: 'CHD', FName: '可选' },
  { FNumber: 'COM', FName: '通用' }
]
const FBackFlush = [
  { FNumber: 'Y', FName: '是' },
  { FNumber: 'N', FName: '否' }
]
const FParentID = [
  { FNumber: '1', FName: '50柴油机' },
  { FNumber: '2', FName: '配件-电脑' },
  { FNumber: '3', FName: '自行车特性BOM' },
  { FNumber: '5', FName: '运动车-BOM跳层' },
  { FNumber: '6', FName: '电焊机' },
  { FNumber: '7', FName: '电梯配件' },
  { FNumber: '8', FName: '橡胶配方' },
  { FNumber: '9', FName: '塑料配方' },
  { FNumber: 'A', FName: '维修备件' }
]
const Select = { FPercentUnitID, FMaterielType, FMarshalType, FBackFlush, FParentID, FUnitID: FPercentUnitID }
export default Select
