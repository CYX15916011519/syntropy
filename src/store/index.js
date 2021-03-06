import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'
// ----------------系统API接口------------------------

import K3ApiUrl from './modules/connect'
import materialTemplate from './modules/materialTemplate'
// -- ABP
import LocalMaterialMapCustomMaterial from './ABP/LocalMaterialMapCustomMaterial'
import BomImport from './ABP/BomImport'
import JITCommon from './ABP/JITCommon'
// -- K3
import MaterialGroup from './K3/MaterialGroup'
import Material from './K3/Material'
import Department from './K3/Department'
import Account from './K3/Account'
import MeasureUnitGroup from './K3/MeasureUnitGroup'
import MeasureUnit from './K3/MeasureUnit'
import Stock from './K3/Stock'
import Employee from './K3/Employee'
import Customer from './K3/Customer'
import Supplier from './K3/Supplier'
import Currency from './K3/Currency'
import BaseAuxPropClass from './K3/BaseAuxPropClass'
import ItemClass2003 from './K3/ItemClass2003'
import Routing from './K3/Routing'
import Token from './K3/Token'
import BOM from './K3/BOM'
import SubMessage from './K3/SubMessage'
import SQLReport from './K3/SQLReport'
import Bill1000200 from './K3/Bill1000200'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    K3ApiUrl,
    materialTemplate,
    //  K3
    MaterialGroup,
    Material,
    Department,
    Account,
    MeasureUnit,
    MeasureUnitGroup,
    Stock,
    Employee,
    Customer,
    Supplier,
    Currency,
    BaseAuxPropClass,
    ItemClass2003,
    Routing,
    Token,
    BOM,
    SubMessage,
    SQLReport,
    Bill1000200,
    // ABP
    LocalMaterialMapCustomMaterial,
    BomImport,
    JITCommon
  },
  state: {
    // K3ApiUrl: K3ApiUrl.state
  },
  mutations: {

  },
  actions: {

  },
  getters
})
