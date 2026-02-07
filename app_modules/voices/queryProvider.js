const checkUserVoiceById = () => {
  return `
  SELECT voice_id as voiceId, voice_title as voiceTitle, voice_url as voiceUrl, category_id as categoryId
  FROM voices
  where voice_id =? and created_by = ? and is_active = 1; `
}

const checkVoiceByAll = () => {
  return `SELECT voice_id as voiceId, voice_title as voiceTitle, voice_url as voiceUrl, category_id as categoryId
  FROM voices
  where voice_title = ? and JSON_CONTAINS(voice_url,?) and JSON_CONTAINS(voice_platform, ?) and created_by = ? and category_id = ? and created_on > now() - interval 1 hour and is_active = 1; `
}

const updateVoice = () => {
  return `update voices 
  set voice_title =?, voice_url = ?,voice_platform =?, category_id = ?, updated_on = now(), updated_by = ?
  where voice_id = ? and created_by = ? and is_active = true;`
}

const insertVoice = () => {
  return `insert into voices (voice_id, voice_title,voice_url,voice_platform, category_id, created_on, created_by, is_active) values
  (?,?,?,?,?,now(),?, true);
  update category 
  set post_count = post_count + 1
  where category_id = ? and is_active = true;
  `
}

const checkUsersVoiceById = () => {
  return `
  SELECT v.voice_id as voiceId, v.voice_title as voiceTitle,v.voice_view as voiceView, v.voice_url as voiceUrl,v.voice_platform AS voicePlatform,v.category_id as categoryId, c.category_name as categoryName, v.created_on as createdOn,
  IF(sv.voice_id IS NOT NULL, true, false) AS isSaved,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'followerCount', ud.follower_user_count, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id IS NOT NULL , true, false), 'isCelebrity', ud.is_celebrity) as user,
  IF(tv.tag_user_id IS NOT NULL, JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser,
  (pv.score / (DATEDIFF(CURDATE(), v.created_on) + 1)) AS pvScore
  FROM voices v
  join category c on c.category_id = v.category_id 
  join user_details ud on v.created_by = ud.created_by and ud.is_active = 1
  join subscription s on ud.plan_id = s.plan_id 
  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
  left join saved_voices sv on v.voice_id = sv.voice_id and sv.created_by = ?
  LEFT JOIN popularity_voice pv ON pv.voice_id = v.voice_id 
  left join tag_voice tv on v.voice_id = tv.voice_id
  left join user_details ud2 on tv.tag_user_id = ud2.created_by
  where v.is_active = 1 and (v.category_id in (?) or ufm.user_follow_mapping_id IS NOT NULL)
  GROUP BY v.voice_id
  ORDER BY pvScore DESC LIMIT ? OFFSET ?;
  SELECT v.voice_id as voiceId, v.voice_title as voiceTitle,v.voice_view as voiceView, v.voice_url as voiceUrl,v.voice_platform AS voicePlatform,v.category_id as categoryId, c.category_name as categoryName, v.created_on as createdOn,
  IF(sv.voice_id IS NOT NULL, true, false) AS isSaved,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id IS NOT NULL , true, false), 'isCelebrity', ud.is_celebrity) as user,
  IF(tv.tag_user_id IS NOT NULL, JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser
  FROM voices v
  join category c on c.category_id = v.category_id 
  join user_details ud on v.created_by = ud.created_by and ud.is_active = 1
  join subscription s on ud.plan_id = s.plan_id 
  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
  left join saved_voices sv on v.voice_id = sv.voice_id and sv.created_by = ?
  left join tag_voice tv on v.voice_id = tv.voice_id
  left join user_details ud2 on tv.tag_user_id = ud2.created_by
  where v.is_active = 1 and (v.category_id in (?) or ufm.user_follow_mapping_id IS NOT NULL)
  GROUP BY v.voice_id
  ORDER BY v.created_on DESC LIMIT ? OFFSET ?; `
}

const checkVoiceById = () => {
  return `
  SELECT v.voice_id as voiceId, v.voice_title as voiceTitle,v.voice_view as voiceView, v.voice_url as voiceUrl,v.category_id as categoryId, c.category_name as categoryName, v.created_on as createdOn, v.voice_platform as voicePlatform,
  IF(sv.voice_id IS NOT NULL, true, false) AS isSaved,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id IS NOT NULL , true, false), 'isCelebrity', ud.is_celebrity, 'followerCount', ud.follower_user_count) as user,
  IF(tv.tag_user_id IS NOT NULL, JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser
  FROM voices v
  join category c on c.category_id = v.category_id 
  join user_details ud on v.created_by = ud.created_by and ud.is_active = 1
  join subscription s on ud.plan_id = s.plan_id 
  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
  left join saved_voices sv on v.voice_id = sv.voice_id and sv.created_by = ?
  left join tag_voice tv on v.voice_id = tv.voice_id
  left join user_details ud2 on tv.tag_user_id = ud2.created_by
  where v.voice_id =? and v.is_active = 1;  `
}

const checkSuggestVoice = () => {
  return `
  SELECT v.voice_id as voiceId,v.voice_view as voiceView, v.voice_title as voiceTitle, v.voice_url as voiceUrl, c.category_name as categoryName,v.category_id as categoryId, v.created_on as createdOn,v.voice_platform as voicePlatform,
  IF(sv.voice_id IS NOT NULL, true, false) AS isSaved,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id IS NOT NULL , true, false), 'isCelebrity', ud.is_celebrity) as user,
  IF(tv.tag_user_id IS NOT NULL, JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser,
  (pv.score / (DATEDIFF(CURDATE(), v.created_on) + 1)) AS pvScore
  FROM voices v
  join category c on c.category_id = v.category_id 
  join user_details ud on v.created_by = ud.created_by and ud.is_active = 1
  join subscription s on ud.plan_id = s.plan_id 
  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
  left join saved_voices sv on v.voice_id = sv.voice_id and sv.created_by = ?
  LEFT JOIN popularity_voice pv ON pv.voice_id = v.voice_id
  left join tag_voice tv on v.voice_id = tv.voice_id
  left join user_details ud2 on tv.tag_user_id = ud2.created_by
  where v.category_id in (?) and v.is_active = 1 
  GROUP BY v.voice_id
  ORDER BY pvScore DESC LIMIT ? OFFSET ?; `
}

const deleteVoiceByID = () => {
  return `
  update voices 
  set is_active = ?
  where voice_id = ? and created_by = ? and is_active = true;
  update category 
  set post_count = post_count - 1
  where category_id = ? and is_active = true;`
}

const checkFollowedVoice = () => {
  return `
  SELECT v.voice_id as voiceId,v.voice_view as voiceView, v.voice_title as voiceTitle, v.voice_url as voiceUrl,v.category_id as categoryId, c.category_name as categoryName, v.created_on as createdOn,v.voice_platform as voicePlatform,
  IF(sv.voice_id IS NOT NULL, true, false) AS isSaved,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url,'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id IS NOT NULL , true, false), 'isCelebrity', ud.is_celebrity) as user,
  IF(tv.tag_user_id IS NOT NULL, JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser
  FROM voices v
  join category c on c.category_id = v.category_id 
  join user_details ud on v.created_by = ud.created_by and ud.is_active = 1
  join subscription s on ud.plan_id = s.plan_id 
  left join user_follow_mapping ufm on ufm.created_by  = ? and ufm.followed_id = ?
  left join saved_voices sv on v.voice_id = sv.voice_id and sv.created_by = ?
  left join tag_voice tv on v.voice_id = tv.voice_id
  left join user_details ud2 on tv.tag_user_id = ud2.created_by
  where v.created_by = ? and v.is_active = 1
  GROUP BY v.voice_id
  ORDER BY v.created_on DESC LIMIT ? OFFSET ?;
  SELECT count(voice_id) as totalVoices
  FROM voices v
  where v.created_by = ? and v.is_active = 1;`
}

const checkVoiceSaved = () => {
  return `
  select saved_voice_id 
  from saved_voices
  where voice_id = ? and created_by = ?`
}

const storeVoice = () => {
  return `
  insert into saved_voices (saved_voice_id, voice_id, created_on, created_by) values
  (?,?,now(),?);
  `
}

const checkVoiceShared = () => {
  return `
  select shared_voice_id 
  from shared_voice
  where voice_id = ? and created_by = ? and shared_user_id = ?`
}

const insertSharedVoice = () => {
  return `
  insert IGNORE into shared_voice (shared_voice_id,shared_user_id, voice_id, created_on, created_by) values
  ?;`
}

const sharedVoice = () => {
  return `
  insert IGNORE into shared_voice_unique ( voice_id, created_by) values
  (?,?);`
}

const tagUser = () => {
  return `
  insert into tag_voice (tag_voice_id,tag_user_id, voice_id, created_on, created_by) values
  ?`
}

const removeTagUser = () => {
  return `DELETE FROM tag_voice 
  WHERE voice_id = ? and created_by = ?`
}

const createdVoiceList = () => {
  return `SELECT v.voice_id as voiceId, v.voice_title as voiceTitle,v.voice_view as voiceView,v.voice_platform AS voicePlatform, v.voice_url as voiceUrl,c.category_name as categoryName,v.category_id as categoryId, v.created_on as createdOn,IF(tv.tag_user_id IS NOT NULL,JSON_ARRAYAGG(JSON_OBJECT('username', ud.username, 'userId', ud.created_by, 'fullName', ud.full_name)), JSON_ARRAY()) AS tagUser
  FROM voices v
  join category c on c.category_id = v.category_id 
  left join tag_voice tv on v.voice_id = tv.voice_id 
  left join user_details ud on tv.tag_user_id = ud.created_by
  where v.created_by = ? and v.is_active = 1
  GROUP BY v.voice_id
  order by v.created_on desc limit ? offset ?;
  SELECT count(v.voice_id) as totalCreatedVoice
  FROM voices v
  where v.created_by = ? and v.is_active = 1;`
}

const savedVoiceList = () => {
  return `SELECT  v.voice_id as voiceId, v.voice_title as voiceTitle,v.voice_view as voiceView,v.voice_platform AS voicePlatform, v.voice_url as voiceUrl,v.category_id as categoryId,c.category_name as categoryName, v.created_on as createdOn,sv.created_on as savedOn, JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'isCelebrity', ud.is_celebrity,'planName', s.plan_name) as user,IF(tv.tag_user_id IS NOT NULL,JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser
  FROM saved_voices sv
  join voices v on sv.voice_id = v.voice_id and v.is_active = 1
  join category c on c.category_id = v.category_id 
  join user_details ud on v.created_by = ud.created_by and ud.is_active = 1
  join subscription s on ud.plan_id = s.plan_id 
  left join tag_voice tv on v.voice_id = tv.voice_id 
  left join user_details ud2 on tv.tag_user_id = ud2.created_by
  where sv.created_by = ? and v.is_active = 1
  GROUP BY v.voice_id
  order by sv.created_on desc limit ? offset ?;
  SELECT count(sv.saved_voice_id) as totalSavedVoices
  FROM saved_voices sv
  where sv.created_by = ?;`
}

const receivedVoiceList = () => {
  return `
  SELECT  v.voice_id as voiceId, v.voice_title as voiceTitle,v.voice_view as voiceView,v.voice_platform AS voicePlatform, v.voice_url as voiceUrl,v.category_id as categoryId,c.category_name as categoryName, v.created_on as createdOn, sv.created_on as sharedOn, JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'isCelebrity', ud.is_celebrity, 'planName', s.plan_name) as user, IF(tv.tag_user_id IS NOT NULL,JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser
    FROM shared_voice sv
    join voices v on sv.voice_id = v.voice_id and v.is_active = 1
    join category c on c.category_id = v.category_id 
    join user_details ud on sv.created_by = ud.created_by and ud.is_active = 1
    join subscription s on ud.plan_id = s.plan_id 
    left join tag_voice tv on v.voice_id = tv.voice_id 
    left join user_details ud2 on tv.tag_user_id = ud2.created_by
    where sv.shared_user_id = ? and v.is_active = 1
    GROUP BY v.voice_id
    order by sv.created_on desc limit ? offset ?;
    SELECT count(sv.shared_voice_id) as totalReceivedVoices
    FROM shared_voice sv
    where sv.shared_user_id = ?;`
}

const tagVoiceList = () => {
  return `
  SELECT  v.voice_id as voiceId, v.voice_title as voiceTitle,v.voice_view as voiceView,v.voice_platform AS voicePlatform, v.voice_url as voiceUrl,v.category_id as categoryId,c.category_name as categoryName, v.created_on as createdOn,tv.created_on as tagOn, IF(tv.tag_user_id IS NOT NULL,JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser, JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'createdOn', tv.created_on, 'isCelebrity', ud.is_celebrity,'planName', s.plan_name) as user
      FROM tag_voice tv
      join voices v on tv.voice_id = v.voice_id and v.is_active = 1
      join category c on c.category_id = v.category_id 
      join user_details ud on tv.created_by = ud.created_by and ud.is_active = 1
      join subscription s on ud.plan_id = s.plan_id 
      left join user_details ud2 on tv.tag_user_id = ud2.created_by
      where tv.tag_user_id = ? and v.is_active = 1
      GROUP BY v.voice_id
      order by tv.created_on desc limit ? offset ?;
      SELECT count(tv.tag_voice_id) as totalTagVoices
      FROM tag_voice tv
      where tv.tag_user_id = ?`
}

const getVoicePointList = (orderFilter) => {
  return `
  select v.voice_title as mediaTitle, v.created_on as createdOn, v.voice_view as mediaView, v.voice_point as mediaPoint, v.voice_id as mediaId
  from voices v
  where v.created_by = ? and v.is_active = true
  order by ${orderFilter} limit ? offset ?;
 `
}

const viewList = () => {
  return `insert into voice_views_list (voice_id, owner_id, category_id, time_in_sec, created_by,watched_count)
  values ?
  ON DUPLICATE KEY 
  UPDATE time_in_sec = VALUES(time_in_sec), watched_count=watched_count+1`
}

const getCategoryWise = () => {
  return `SELECT GROUP_CONCAT(category_id) as categoryId
  FROM voice_inserted_category_wise_map
  WHERE created_by = ?
  ORDER BY watch_count DESC`
}

module.exports = {
  checkUserVoiceById,
  checkVoiceByAll,
  updateVoice,
  insertVoice,
  checkUsersVoiceById,
  checkVoiceById,
  checkSuggestVoice,
  deleteVoiceByID,
  checkFollowedVoice,
  checkVoiceSaved,
  storeVoice,
  checkVoiceShared,
  insertSharedVoice,
  tagUser,
  removeTagUser,
  createdVoiceList,
  savedVoiceList,
  receivedVoiceList,
  tagVoiceList,
  getVoicePointList,
  viewList,
  sharedVoice,
  getCategoryWise
}
