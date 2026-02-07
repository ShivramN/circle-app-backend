const getSearchDeatils = () => {
  return `  
  select
 ud.created_by as 'userId', ud.username as 'username', ud.full_name as  'fullName', ud.photo_url as 'photoUrl', s.plan_name as planName,
 ud.category_id as 'categoryId', IF(ufm.user_follow_mapping_id is not null, true, false) as 'isFollow', ud.is_celebrity as 'isCelebrity'
FROM user_details ud
join subscription s on s.plan_id = ud.plan_id
LEFT JOIN user_follow_mapping ufm ON ufm.followed_id = ud.created_by AND ufm.created_by = ?
WHERE ud.full_name LIKE ? or ud.username like ?
limit 2;
   select n.news_id as 'newsId',n.news_banner as 'newsBanner',n.news_title as 'newsTitle', 
   n.news_view as newsView,
   n.news_description as  'newsDescription',n.category_id as categoryId, c.category_name as categoryName, ud.full_name as fullName
   from news n
   join user_details ud on n.created_by  = ud.created_by and ud.is_active = true 
   join category c on c.category_id = n.category_id and c.is_active = true
  WHERE n.news_title LIKE ? or n.news_description LIKE ?
 limit 2;
 select v.voice_id as 'voiceId',v.voice_url as 'voiceUrl',v.voice_title as 'voiceTitle',v.voice_view as voiceView,v.category_id as categoryId,c.category_name as categoryName, ud.full_name as fullName,
 IF(tv.tag_user_id IS NOT NULL, JSON_ARRAYAGG(JSON_OBJECT('username', ud2.username, 'userId', ud2.created_by, 'fullName', ud2.full_name)), JSON_ARRAY()) AS tagUser
   from voices v 
   join user_details ud on v.created_by  = ud.created_by and ud.is_active = true 
   join category c on c.category_id = v.category_id and c.is_active = true
   left join tag_voice tv on v.voice_id = tv.voice_id
   left join user_details ud2 on tv.tag_user_id = ud2.created_by
  WHERE v.voice_title LIKE ?
  GROUP BY v.voice_id
  limit 2;
 SELECT e.event_id as eventId, e.event_thumbnail as eventThumbnail,e.event_view as eventView, e.event_title as eventTitle, e.category_id as categoryId,c.category_name as categoryName,
 e.event_address as eventAddress, ud2.full_name 
 FROM event e
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
  LEFT JOIN user_follow_mapping ufm ON (
      e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
      OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
      )
  LEFT JOIN user_details ud ON e.invite_people = ? AND ud.created_by = ? AND ud.is_active = true
  JOIN user_details ud2 ON e.created_by = ud2.created_by AND ud2.is_active = 1
  join category c on c.category_id = e.category_id and c.is_active = true
  WHERE (e.event_title  LIKE ? or e.event_description  LIKE ?) and 
  ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR 
  (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR 
  (e.invite_people = ? AND ud.created_by IS NOT NULL)) 
  limit 2;
  `
}

const getGlobalUserSearch = () => {
  return ` 
      select
    ud.created_by as 'userId', ud.username as 'username', ud.full_name as  'fullName', ud.photo_url as 'photoUrl', s.plan_name as planName,
    ud.category_id as 'categoryId', IF(ufm.user_follow_mapping_id is not null, true, false) as 'isFollow', ud.is_celebrity as 'isCelebrity'
    FROM user_details ud
    join subscription s on s.plan_id = ud.plan_id
    LEFT JOIN user_follow_mapping ufm ON ufm.followed_id = ud.created_by AND ufm.created_by = ?
    WHERE full_name LIKE ?
    limit 2;`
}

module.exports = {
  getSearchDeatils,
  getGlobalUserSearch
}
