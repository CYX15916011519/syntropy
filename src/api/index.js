const api = {
  Login: '/api/TokenAuth/Authenticate',
  LoginK3: '/K3API/Token/Create',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  GetCurrentLoginInformations: '/api/services/app/Session/GetCurrentLoginInformations'
}
export default api
