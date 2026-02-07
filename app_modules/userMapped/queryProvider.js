const insertUpdateCategory = () => {
  return `
  update user_details 
  set category_id =JSON_ARRAY(?), updated_on = now(), updated_by = ? 
  where created_by = ? and is_active = true;
  `
}

const insertFollowMapped = () => {
  return `insert ignore into user_follow_mapping (user_follow_mapping_id, followed_id, created_on, created_by) values
  (?,?,now(),?)
  `
}
const addCount = () => {
  return `
    UPDATE user_details ud 
    SET following_user_count = following_user_count + 1
    where created_by = ? and is_active = 1;
    UPDATE user_details ud 
    SET follower_user_count = follower_user_count + 1
    where created_by = ? and is_active = 1;`
}

const deleteFollowMapped = () => {
  return `DELETE FROM user_follow_mapping 
  WHERE created_by = ? and followed_id = ?;`
}

const removeCount = () => {
  return `
    UPDATE user_details ud 
    SET following_user_count = following_user_count - 1
    where created_by = ? and is_active = 1;
    UPDATE user_details ud 
    SET follower_user_count = follower_user_count - 1
    where created_by = ? and is_active = 1;`
}

const checkFollowMapped = () => {
  return `select ud.user_detail_id as userDetailsId, if(ufm.user_follow_mapping_id is not null, true, false) as isFollow from user_details ud
  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
  where ud.created_by = ? and ud.is_active = true`
}

const checkSetting = () => {
  return `select u.fcm_token as fcmToken, us.share_news as shareNews, us.share_voice as shareVoice, us.share_event as shareEvent, us.event_alert as eventAlert, us.tag_voice as tagVoice, us.event_invited as eventInvited, us.user_follow as userFollow, ud.username as username from users u
  join user_setting us on us.created_by = u.user_id 
  join user_details as ud on ud.created_by = ? 
  where u.user_id=?`
}
const insertNotification = () => {
  return `Insert into notification (notification_id,title, notification_type, media_type, media_id, sent_user_id, is_read, created_by, created_on, message)
  values (?,?,?,?,?,?,?,?,now(),?)`
}
module.exports = {
  insertUpdateCategory,
  insertFollowMapped,
  addCount,
  deleteFollowMapped,
  removeCount,
  checkFollowMapped,
  checkSetting,
  insertNotification

}
