
const getRedeemPoint = () => {
  return `select coin_rewards as coinRewards, total_coin_rewards as totalCoinRewards, (total_coin_rewards-coin_rewards) as totalRedeem
  from user_details 
  where created_by = ? and is_active = true`
}

const getStatus = () => {
  return `select user_status as userStatus, status_date as statusDate
  from user_details 
  where created_by = ? and is_active = true`
}

const settingList = () => {
  return `select setting_id as settingId, share_news as sharedNews,share_voice as sharedVoice,
  share_event as sharedEvent,  event_alert as eventAlert,tag_voice as tagVoice,event_invited as eventInvited,user_follow as userFollow
  from user_setting
  where created_by = ?`
}
const updateSetting = () => {
  return `update user_setting
  set share_news=?,share_voice=?,share_event=?,event_alert=?,tag_voice=?,event_invited=?,user_follow=?,updated_by=?,updated_on= now()
  where created_by =?`
}
module.exports = {
  getRedeemPoint,
  getStatus,
  settingList,
  updateSetting
}
