const FErpClsIDList = [
  { FNumber: 'GHL', FName: '规划类' },
  { FNumber: 'PZL', FName: '配置类' },
  { FNumber: 'TZL', FName: '特征类' },
  { FNumber: 'WG', FName: '外购' },
  { FNumber: 'WWJG', FName: '委外加工' },
  { FNumber: 'XNJ', FName: '虚拟件' },
  { FNumber: 'ZH', FName: '组装件' },
  { FNumber: 'ZZ', FName: '自制' },
  { FNumber: 'ZZTXPZ', FName: '自制（特性配置）' }
]
const FTypeIDList = [
  { FNumber: '01', FName: '主推商品' },
  { FNumber: '02', FName: '辅推商品' }
]
const FUseState = [
  { FNumber: 'ELI', FName: '逐步淘汰' },
  { FNumber: 'FUT', FName: '将使用' },
  { FNumber: 'HIS', FName: '历史资料' },
  { FNumber: 'USE', FName: '使用' }
]
const FCheckCycUnitList = [
  { FNumber: 'D', FName: '天' },
  { FNumber: 'M', FName: '月' },
  { FNumber: 'W', FName: '周' }
]
const FTrackList = [
  { FNumber: 'F001', FName: '加权平均法' },
  { FNumber: 'F002', FName: '移动平均法' },
  { FNumber: 'F003', FName: '先进先出法' },
  { FNumber: 'F004', FName: '后进先出法' },
  { FNumber: 'F005', FName: '分批认定法（批内移动平均法）' },
  { FNumber: 'F006', FName: '计划成本法' },
  { FNumber: 'F007', FName: '分批认定法（批内先进先出法）' },
  { FNumber: 'F008', FName: '分批认定法（批内加权平均法）' }
]
const FPlanTrategyList = [
  { FNumber: 'FAS', FName: '总装配（FAS）' },
  { FNumber: 'MPS', FName: '主生产计划（MPS）' },
  { FNumber: 'MRP', FName: '物料需求计划（MRP）' },
  { FNumber: 'None', FName: '无' }
]
const FPlanModeList = [
  { FNumber: 'IHT', FName: '继承BOM中父件' },
  { FNumber: 'MTO', FName: 'MTO计划模式' },
  { FNumber: 'MTS', FName: 'MTS计划模式' }
]
const FOrderTrategyList = [
  { FNumber: 'FOQ', FName: '固定批量（FOQ）' },
  { FNumber: 'LFL', FName: '批对批（LFL）' },
  { FNumber: 'MMP', FName: '最小最大计划（MMP）' },
  { FNumber: 'POQ', FName: '期间订货（POQ）' },
  { FNumber: 'ROP', FName: '再订货点（ROP）' }
]
const FCtrlTypeList = [
  { FNumber: '001', FName: '看板' },
  { FNumber: '002', FName: 'ERP' }
]
const TestMethod = [
  { FNumber: 'CJ', FName: '抽检' },
  { FNumber: 'MJ', FName: '免检' },
  { FNumber: 'QJ', FName: '全检' }
]
const FSampStdList = [
  { FNumber: 'SS1', FName: '国际12-040' },
  { FNumber: 'SS2', FName: '国际12-025' },
  { FNumber: 'SS3', FName: '自定01' }
]
const FUnitParame = {
  Data: {
    FUnitGroupName: ''
  }
}
const FCtrlStraregyList = [
  { FNumber: '001', FName: '一次性' },
  { FNumber: '002', FName: '循环' }
]
const formRemarks = {
  FHelpCode: { name: '	助记码	 ', type: '	varchar	 ', required: false, OnGroup: 'basic', index: 3 },
  FModel: { name: '	规格型号	 ', type: '	varchar	 ', required: false, OnGroup: 'basic', index: 4 },
  FAuxClassID: { name: '	辅助属性类别	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 5, api: 'BaseAuxPropClassGetAll' },
  FErpClsID: { name: '	物料属性	 ', type: '	int	 ', required: true, OnGroup: 'basic', index: 6, List: FErpClsIDList },
  FTypeID: { name: '	物料分类	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 7, List: FTypeIDList },
  FUnitGroupID: { name: '	计量单位组	 ', type: '	int	 ', required: true, OnGroup: 'basic', index: 8, api: 'MeasureUnitGroupGetAll' },
  FUnitID: { name: '	基本计量单位	 ', type: '	int	 ', required: true, OnGroup: 'basic', index: 9, api: 'MeasureUnitGetAll', Parame: FUnitParame },
  FOrderUnitID: { name: '	采购计量单位	 ', type: '	int	 ', required: true, OnGroup: 'basic', index: 10, api: 'MeasureUnitGetAll', Parame: FUnitParame },
  FSaleUnitID: { name: '	销售计量单位	 ', type: '	int	 ', required: true, OnGroup: 'basic', index: 11, api: 'MeasureUnitGetAll', Parame: FUnitParame },
  FProductUnitID: { name: '	生产计量单位	 ', type: '	int	 ', required: true, OnGroup: 'basic', index: 12, api: 'MeasureUnitGetAll', Parame: FUnitParame },
  FStoreUnitID: { name: '	库存计量单位	 ', type: '	int	 ', required: true, OnGroup: 'basic', index: 13, api: 'MeasureUnitGetAll', Parame: FUnitParame },
  FSecUnitID: { name: '	辅助计量单位	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 14, api: 'MeasureUnitGetAll', Parame: FUnitParame },
  FSecCoefficient: { name: '	辅助计量单位换算率	 ', type: '	float	 ', required: false, OnGroup: 'basic', index: 15 },
  FDefaultLoc: { name: '	默认仓库	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 16, api: 'StockGetAll' },
  FSPID: { name: '	默认仓位	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 17, Hide: true },
  FSource: { name: '	来源	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 18, api: 'SupplierGetAll' },
  FQtyDecimal: { name: '	数量精度	 ', type: '	none	 ', required: false, OnGroup: 'basic', index: 19 },
  FLowLimit: { name: '	最低存量	 ', type: '	float	 ', required: false, OnGroup: 'basic', index: 20 },
  FHighLimit: { name: '	最高存量	 ', type: '	float	 ', required: false, OnGroup: 'basic', index: 21 },
  FSecInv: { name: '	安全库存数量	 ', type: '	float	 ', required: false, OnGroup: 'basic', index: 22 },
  FUseState: { name: '	使用状态	 ', type: '	int	 ', required: true, OnGroup: 'basic', index: 23, List: FUseState },
  FIsEquipment: { name: '	是否为设备	 ', type: '	bit	 ', required: false, OnGroup: 'basic', index: 24 },
  FEquipmentNum: { name: '	设备编码	 ', type: '	varchar	 ', required: false, OnGroup: 'basic', index: 25 },
  FIsSparePart: { name: '	是否为备件	 ', type: '	bit	 ', required: false, OnGroup: 'basic', index: 26 },
  FFullName: { name: '	物料全名	 ', type: '	varchar	 ', required: false, OnGroup: 'basic', index: 27 },
  FApproveNo: { name: '	批准文号	 ', type: '	varchar	 ', required: false, OnGroup: 'basic', index: 28 },
  FAlias: { name: '	别名	 ', type: '	varchar	 ', required: false, OnGroup: 'basic', index: 29 },
  FOrderRector: { name: '	采购负责人	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 0, api: 'EmployeeGetAll' },
  FPOHighPrice: { name: '	采购最高价	 ', type: '	float	 ', required: false, OnGroup: '', index: 1 },
  FPOHghPrcMnyType: { name: '	采购最高价币别	 ', type: '	int	 ', required: false, OnGroup: '', index: 1, api: 'CurrencyGetAll' },
  FWWHghPrc: { name: '	委外加工最高价	 ', type: '	float	 ', required: false, OnGroup: '', index: 1 },
  FWWHghPrcMnyType: { name: '	委外加工最高价币别	 ', type: '	int	 ', required: false, OnGroup: '', index: 1, api: 'CurrencyGetAll' },
  FSOLowPrc: { name: '	销售最低价	 ', type: '	float	 ', required: false, OnGroup: '', index: 1 },
  FSOLowPrcMnyType: { name: '	销售最低价币别	 ', type: '	int	 ', required: false, OnGroup: '', index: 1, api: 'CurrencyGetAll' },
  FIsSale: { name: '	是否销售	 ', type: '	bit	 ', required: false, OnGroup: '', index: 1 },
  FProfitRate: { name: '	毛利率(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 2 },
  FOrderPrice: { name: '	采购单价	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 3 },
  FSalePrice: { name: '	销售单价	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 4 },
  FIsSpecialTax: { name: '	是否农林计税	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 5 },
  FISKFPeriod: { name: '	是否进行保质期管理	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 6 },
  FKFPeriod: { name: '	保质期(天)	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 7 },
  FStockTime: { name: '	是否需要库龄管理	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 8 },
  FBatchManager: { name: '	是否采用业务批次管理	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 9 },
  FBookPlan: { name: '	是否需要进行订补货计划的运算	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 10 },
  FBeforeExpire: { name: '	失效提前期(天)	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 11 },
  FCheckCycUnit: { name: '	盘点周期单位	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 12, List: FCheckCycUnitList },
  FCheckCycle: { name: '	盘点周期	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 13 },
  FDaysPer: { name: '	每周/月第()天	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 14 },
  FLastCheckDate: { name: '	上次盘点日期	 ', type: '	datetime	 ', required: false, OnGroup: 'materiel', index: 15 },
  FOIHighLimit: { name: '	外购超收比例(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 16 },
  FOILowLimit: { name: '	外购欠收比例(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 17 },
  FSOHighLimit: { name: '	销售超交比例(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 18 },
  FSOLowLimit: { name: '	销售欠交比例(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 19 },
  FInHighLimit: { name: '	完工超收比例(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 20 },
  FInLowLimit: { name: '	完工欠收比例(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 21 },
  FPickHighLimit: { name: '	领料超收比例(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 22 },
  FPickLowLimit: { name: '	领料欠收比例(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 23 },
  FTrack: { name: '	计价方法	 ', type: '	int	 ', required: true, OnGroup: 'materiel', index: 24, List: FTrackList },
  FPlanPrice: { name: '	计划单价	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 25 },
  FPriceDecimal: { name: '	单价精度	 ', type: '	none	 ', required: false, OnGroup: 'materiel', index: 26 },
  FAcctID: { name: '	存货科目代码	 ', type: '	int	 ', required: true, OnGroup: 'materiel', index: 27, api: 'AccountGetAll' },
  FSaleAcctID: { name: '	销售收入科目代码	 ', type: '	int	 ', required: true, OnGroup: 'materiel', index: 28, api: 'AccountGetAll' },
  FCostAcctID: { name: '	销售成本科目代码	 ', type: '	int	 ', required: true, OnGroup: 'materiel', index: 29, api: 'AccountGetAll' },
  FAPAcctID: { name: '	成本差异科目代码	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 30, api: 'AccountGetAll' },
  FAdminAcctID: { name: '	代管物资科目	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 31, api: 'AccountGetAll' },
  FGoodSpec: { name: '	税目代码	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 32, Hide: true },
  FTaxRate: { name: '	税率(%)	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 33 },
  FCostProject: { name: '	成本项目	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 34, api: 'ItemClass2003GetAll' },
  FIsSNManage: { name: '	是否进行序列号管理	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 35 },
  F_101: { name: '	发料员	 ', type: '	int	 ', required: false, OnGroup: 'custom', index: 1, api: 'EmployeeGetAll', Hide: true },
  F_103: { name: '	产品组分类	 ', type: '	varchar	 ', required: false, OnGroup: 'custom', index: 1 },
  FCBRestore: { name: '	参与结转式成本还原	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 100 },
  FNote: { name: '	备注	 ', type: '	varchar	 ', required: false, OnGroup: 'materiel', index: 1 },
  FPlanTrategy: { name: '	计划策略	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 0, List: FPlanTrategyList },
  FPlanMode: { name: '	计划模式	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 1, List: FPlanModeList },
  FOrderTrategy: { name: '	订货策略	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 2, List: FOrderTrategyList },
  FFixLeadTime: { name: '	固定提前期	 ', type: '	none	 ', required: false, OnGroup: 'plan', index: 3 },
  FLeadTime: { name: '	变动提前期	 ', type: '	none	 ', required: false, OnGroup: 'plan', index: 4 },
  FTotalTQQ: { name: '	累计提前期	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 5 },
  FOrderInterVal: { name: '	订货间隔期(天)	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 6 },
  FQtyMin: { name: '	最小订货量	 ', type: '	float	 ', required: false, OnGroup: 'plan', index: 7 },
  FQtyMax: { name: '	最大订货量	 ', type: '	float	 ', required: false, OnGroup: 'plan', index: 8 },
  FBatchAppendQty: { name: '	批量增量	 ', type: '	float	 ', required: false, OnGroup: 'plan', index: 9 },
  FOrderPoint: { name: '	再订货点	 ', type: '	float	 ', required: false, OnGroup: 'plan', index: 10 },
  FBatFixEconomy: { name: '	固定/经济批量	 ', type: '	float	 ', required: false, OnGroup: 'plan', index: 11 },
  FBatChangeEconomy: { name: '	变动提前期批量	 ', type: '	float	 ', required: false, OnGroup: 'plan', index: 12 },
  FRequirePoint: { name: '	需求时界(天)	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 13 },
  FPlanPoint: { name: '	计划时界(天)	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 14 },
  FDefaultRoutingID: { name: '	默认工艺路线	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 15, Hide: true },
  FDefaultWorkTypeID: { name: '	默认生产类型	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 16, Hide: true },
  FProductPrincipal: { name: '	生产负责人	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 17, api: 'EmployeeGetAll' },
  FPlanner: { name: '	计划员	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 18, api: 'EmployeeGetAll' },
  FIsBackFlush: { name: '	是否倒冲	 ', type: '	bit	 ', required: false, OnGroup: 'plan', index: 19 },
  FBackFlushStockID: { name: '	倒冲仓库	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 20, Hide: true },
  FBackFlushSPID: { name: '	倒冲仓位	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 21, Hide: true },
  FPutInteger: { name: '	投料自动取整	 ', type: '	bit	 ', required: false, OnGroup: 'plan', index: 22 },
  FDailyConsume: { name: '	日消耗量	 ', type: '	float	 ', required: false, OnGroup: 'plan', index: 23 },
  FMRPCon: { name: '	MRP计算是否合并需求	 ', type: '	bit	 ', required: false, OnGroup: 'plan', index: 24 },
  FMRPOrder: { name: '	MRP计算是否产生采购申请	 ', type: '	bit	 ', required: false, OnGroup: 'plan', index: 25 },
  FChartNumber: { name: '	图号	 ', type: '	varchar	 ', required: false, OnGroup: 'Design', index: 0 },
  FIsKeyItem: { name: '	是否关键件	 ', type: '	bit	 ', required: false, OnGroup: 'Design', index: 0 },
  FGrossWeight: { name: '	毛重	 ', type: '	float	 ', required: false, OnGroup: 'Design', index: 2 },
  FNetWeight: { name: '	净重	 ', type: '	float	 ', required: false, OnGroup: 'Design', index: 3 },
  FMaund: { name: '	重量单位	 ', type: '	int	 ', required: false, OnGroup: 'Design', index: 4, api: 'MeasureUnitGetAll' },
  FLength: { name: '	长度	 ', type: '	float	 ', required: false, OnGroup: 'Design', index: 5 },
  FWidth: { name: '	宽度	 ', type: '	float	 ', required: false, OnGroup: 'Design', index: 6 },
  FHeight: { name: '	高度	 ', type: '	float	 ', required: false, OnGroup: 'Design', index: 7 },
  FSize: { name: '	体积	 ', type: '	float	 ', required: false, OnGroup: 'Design', index: 8 },
  FCubicMeasure: { name: '	长度单位	 ', type: '	int	 ', required: false, OnGroup: 'Design', index: 1, api: 'MeasureUnitGetAll' },
  FStandardCost: { name: '	单位标准成本	 ', type: '	float	 ', required: false, OnGroup: 'standard', index: 1 },
  FCBAppendRate: { name: '	附加费率(%)	 ', type: '	float	 ', required: false, OnGroup: 'standard', index: 2 },
  FCBAppendProject: { name: '	附加费所属成本项目	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 3, api: 'ItemClass2003GetAll' },
  FCostBomID: { name: '	成本BOM	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 4, Hide: true },
  FCBRouting: { name: '	成本工艺路线	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 5, Hide: true },
  FStdBatchQty: { name: '	标准加工批量	 ', type: '	float	 ', required: false, OnGroup: 'standard', index: 6 },
  FStandardManHour: { name: '	单位标准工时(小时)	 ', type: '	float	 ', required: false, OnGroup: 'standard', index: 7 },
  FStdPayRate: { name: '	标准工资率	 ', type: '	float	 ', required: false, OnGroup: 'standard', index: 8 },
  FChgFeeRate: { name: '	变动制造费用分配率	 ', type: '	float	 ', required: false, OnGroup: 'standard', index: 9 },
  FStdFixFeeRate: { name: '	单位标准固定制造费用金额	 ', type: '	float	 ', required: false, OnGroup: 'standard', index: 10 },
  FOutMachFee: { name: '	单位委外加工费	 ', type: '	float	 ', required: false, OnGroup: 'standard', index: 11 },
  FOutMachFeeProject: { name: '	委外加工费所属成本项目	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 12, api: 'ItemClass2003GetAll' },
  FPieceRate: { name: '	单位计件工资	 ', type: '	float	 ', required: false, OnGroup: '', index: 13 },
  FPOVAcctID: { name: '	采购订单差异科目代码	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 14, api: 'AccountGetAll' },
  FPIVAcctID: { name: '	采购发票差异科目代码	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 15, api: 'AccountGetAll' },
  FMCVAcctID: { name: '	材料成本差异科目代码	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 16, api: 'AccountGetAll' },
  FPCVAcctID: { name: '	加工费差异科目代码	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 17, api: 'AccountGetAll' },
  FSLAcctID: { name: '	废品损失科目代码	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 18, api: 'AccountGetAll' },
  FCAVAcctID: { name: '	标准成本调整差异科目代码	 ', type: '	int	 ', required: false, OnGroup: 'standard', index: 19, api: 'AccountGetAll' },
  FInspectionLevel: { name: '	采购检验方式	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 0, List: TestMethod },
  FProChkMde: { name: '	产品检验方式	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 1, List: TestMethod },
  FWWChkMde: { name: '	委外加工检验方式	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 2, List: TestMethod },
  FSOChkMde: { name: '	发货检验方式	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 3, List: TestMethod },
  FWthDrwChkMde: { name: '	退货检验方式	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 4, List: TestMethod },
  FStkChkMde: { name: '	库存检验方式	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 5, List: TestMethod },
  FOtherChkMde: { name: '	其他检验方式	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 6, List: TestMethod },
  FSampStdCritical: { name: '	抽样标准(致命)	 ', type: '	int	 ', required: false, OnGroup: 'quality', index: 7, List: FSampStdList },
  FSampStdStrict: { name: '	抽样标准(严重)	 ', type: '	int	 ', required: false, OnGroup: 'quality', index: 8, List: FSampStdList },
  FSampStdSlight: { name: '	抽样标准(轻微)	 ', type: '	int	 ', required: false, OnGroup: 'quality', index: 9, List: FSampStdList },
  FStkChkPrd: { name: '	库存检验周期(天)	 ', type: '	int	 ', required: false, OnGroup: 'quality', index: 10 },
  FStkChkAlrm: { name: '	库存周期检验预警提前期(天)	 ', type: '	int	 ', required: false, OnGroup: 'quality', index: 11 },
  FInspectionProject: { name: '	检验方案	 ', type: '	int	 ', required: false, OnGroup: 'quality', index: 12, Hide: true },
  FIdentifier: { name: '	检验员	 ', type: '	int	 ', required: false, OnGroup: 'quality', index: 13, api: 'EmployeeGetAll', Hide: true },
  FVersion: { name: '	版本号	 ', type: '	varchar	 ', required: false, OnGroup: 'Design', index: 1 },
  FNameEn: { name: '	英文名称	 ', type: '	varchar	 ', required: false, OnGroup: 'InOut', index: 1 },
  FModelEn: { name: '	英文规格	 ', type: '	varchar	 ', required: false, OnGroup: 'InOut', index: 1 },
  FHSNumber: { name: '	HS编码	 ', type: '	int	 ', required: false, OnGroup: 'InOut', index: 1, Hide: true },
  FExportRate: { name: '	外销税率%	 ', type: '	float	 ', required: false, OnGroup: 'InOut', index: 1 },
  FFirstUnit: { name: '	HS第一法定单位	 ', type: '	varchar	 ', required: false, OnGroup: 'InOut', index: 1 },
  FSecondUnit: { name: '	HS第二法定单位	 ', type: '	varchar	 ', required: false, OnGroup: 'InOut', index: 1 },
  FImpostTaxRate: { name: '	进口关税率%	 ', type: '	float	 ', required: false, OnGroup: 'InOut', index: 1 },
  FConsumeTaxRate: { name: '	进口消费税率%	 ', type: '	float	 ', required: false, OnGroup: 'InOut', index: 1 },
  FFirstUnitRate: { name: '	HS第一法定单位换算率	 ', type: '	float	 ', required: false, OnGroup: 'InOut', index: 1 },
  FSecondUnitRate: { name: '	HS第二法定单位换算率	 ', type: '	float	 ', required: false, OnGroup: 'InOut', index: 1 },
  FIsManage: { name: '	是否保税监管	 ', type: '	bit	 ', required: true, OnGroup: 'quality', index: 1 },
  FManageType: { name: '	物料监管类型	 ', type: '	int	 ', required: false, OnGroup: 'InOut', index: 1, Hide: true },
  FLenDecimal: { name: '	长度精度	 ', type: '	int	 ', required: false, OnGroup: 'InOut', index: 1 },
  FCubageDecimal: { name: '	体积精度	 ', type: '	int	 ', required: false, OnGroup: 'InOut', index: 1 },
  FWeightDecimal: { name: '	重量精度	 ', type: '	int	 ', required: false, OnGroup: 'InOut', index: 1 },
  FCharSourceItemID: { name: '	特性配置来源	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 30, Hide: true },
  FIsCharSourceItem: { name: '	物料对应特性	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 31, Hide: true },
  FCtrlType: { name: '	控制类型	 ', type: '	int	 ', required: true, OnGroup: 'quality', index: 29, List: FCtrlTypeList },
  FCtrlStraregy: { name: '	控制策略	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 30, List: FCtrlStraregyList },
  FContainerName: { name: '	容器名称	 ', type: '	varchar	 ', required: false, OnGroup: 'plan', index: 31 },
  FKanBanCapability: { name: '	看板容量	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 32 },
  FBatchSplitDays: { name: '	批量拆分间隔天数	 ', type: '	int	 ', required: false, OnGroup: 'plan', index: 33 },
  FBatchSplit: { name: '	拆分批量	 ', type: '	float	 ', required: false, OnGroup: 'plan', index: 34 },
  FDefaultReadyLoc: {
    name: '默认待检仓库',
    type: 'int',
    required: false,
    OnGroup: 'basic',
    index: 32,
    api: 'StockGetAll',
    Parame: {
      Data: {
        Top: '10000',
        PageSize: '100000',
        PageIndex: '1',
        Filter: "FName like '%待检%'",
        OrderBy: 'FNumber asc',
        Fields: 'FNumber,FName'
      }
    }
  },
  FSPIDReady: { name: '	默认待检仓位	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 33, Hide: true },
  FStartService: { name: '	启用服务	 ', type: '	bit	 ', required: false, OnGroup: 'SerInfo', index: 0 },
  FMakeFile: { name: '	生成产品档案	 ', type: '	bit	 ', required: false, OnGroup: 'SerInfo', index: 1 },
  FIsFix: { name: '	维修件	 ', type: '	bit	 ', required: false, OnGroup: 'SerInfo', index: 2 },
  FTtermOfService: { name: '	保修期限（月）	 ', type: '	int	 ', required: false, OnGroup: 'SerInfo', index: 3 },
  FTtermOfUsefulTime: { name: '	使用寿命（月）	 ', type: '	int	 ', required: false, OnGroup: 'SerInfo', index: 4 },
  FIsFixedReOrder: { name: '	设置为固定再订货点	 ', type: '	bit	 ', required: false, OnGroup: 'plan', index: 10 },
  FOnlineShopPNo: { name: '	商家编码	 ', type: '	varchar	 ', required: false, OnGroup: 'materiel', index: 95 },
  FOnlineShopPName: { name: '	网店货品名	 ', type: '	varchar	 ', required: false, OnGroup: 'materiel', index: 96 },
  FForbbitBarcodeEdit: { name: '	严格进行二维码数量校验	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 97 },
  FDSManagerID: { name: '	默认仓管员	 ', type: '	int	 ', required: false, OnGroup: 'basic', index: 18, api: 'EmployeeGetAll' },
  FOrderDept: { name: '	采购部门	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 1, api: 'DepartmentGetAll' },
  FProductDesigner: { name: '	产品设计员	 ', type: '	int	 ', required: false, OnGroup: 'materiel', index: 100, api: 'EmployeeGetAll', Hide: true },
  FUnitPackageNumber: { name: '	单位包装数量	 ', type: '	float	 ', required: false, OnGroup: 'materiel', index: 1 },
  FAuxInMrpCal: { name: '	辅助属性参与计划运算	 ', type: '	bit	 ', required: false, OnGroup: 'plan', index: 1 },
  FPinYin: { name: '	名称拼音	 ', type: '	varchar	 ', required: false, OnGroup: 'basic', index: 0 },
  FPY: { name: '	拼音缩写	 ', type: '	varchar	 ', required: false, OnGroup: 'basic', index: 1 },
  FIsSNBanDing: { name: '	必须进行SN绑定	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 99 },
  FIsSNRpt: { name: '	SN物料汇报时必须有序列号	 ', type: '	bit	 ', required: false, OnGroup: 'materiel', index: 100 },
  FName: { name: '	名称	 ', type: '	varchar	 ', required: true, OnGroup: 'basic', index: -1 },
  FNumner: { name: '	代码	 ', type: '	varchar	 ', required: true, OnGroup: 'basic', index: -2 }
}
const formRemarksGroup = {
  basic: { key: 'basic', name: '基本资料', List: [] }, //  基本
  materiel: { key: 'materiel', name: '物流资料', List: [] }, //  物流
  plan: { key: 'plan', name: '计划资料', List: [], Hide: true }, //  计划
  Design: { key: 'Design', name: '设计资料', List: [], Hide: true }, //  设计
  standard: { key: 'standard', name: '标准数据', List: [], Hide: true }, //  标准数据
  quality: { key: 'quality', name: '计划/质量资料', List: [] }, //  质量资料
  InOut: { key: 'InOut', name: '进出口资料', List: [], Hide: true }, //  进出口
  SerInfo: { key: 'SerInfo', name: '服务资料', List: [], Hide: true }, //  服务资料
  custom: { key: 'custom', name: '自定义', List: [], Hide: true }, //  自定义
  pic: { key: 'pic', name: '图片', List: [], Hide: true }, //  图片
  BarCode: { key: 'BarCode', name: '条码', List: [], Hide: true }, //  条码
  Enclosure: { key: 'Enclosure', name: '附件', List: [], Hide: true }, //  附件
  Other: { key: 'Other', name: '其他', List: [], Hide: true } //  附件
}
const Remarks = {
  formRemarks: formRemarks,
  formRemarksGroup: formRemarksGroup
}
export default Remarks
