const __constants = require('../../config/constants')
const checkUserEventById = () => {
  return `
  SELECT event_id as eventId, category_id as categoryId, event_coin_point as eventCoinPoint
  FROM event
  where event_id =? and created_by = ? and is_active = 1; `
}

const checkEventByAll = () => {
  return `SELECT event_id as eventId
  FROM event
  where event_title = ? and JSON_CONTAINS(event_thumbnail,?) and event_address = ? and  language_Id = JSON_ARRAY(?) and event_min_age = ? and event_max_age = ? and  event_seat =? and event_host_name=? and event_description= ? and event_start_date =? and event_end_date =? and event_start_time =? and event_end_time =? and invite_people = ? and event_coin_point =? and  JSON_CONTAINS(event_more_url,?) and event_add_terms =? and event_special_note = ? and created_by = ? and category_id = ? and created_on > now() - interval 1 hour and is_active = 1; `
}

const updateEvent = () => {
  return `update event 
  set event_title = ?, event_thumbnail = ?, event_address = ?,  language_id = JSON_ARRAY(?), event_min_age = ?, event_max_age = ?,  event_seat =? , event_host_name=?, event_description= ?, event_start_date =?, event_end_date =?, event_start_time =str_to_date(?,'%H:%i'), event_end_time =str_to_date(?,'%H:%i'), invite_people = ?, invite_people_count =?, event_coin_point =?, event_more_url = ?, event_add_terms =?, event_special_note = ?, category_id = ?, updated_on = now(), updated_by = ?, age_criteria_enabled=?
  where event_id = ? and created_by = ? and is_active = true;`
}

const insertEvent = () => {
  return `insert into event (event_id, event_title, event_start_date,event_end_date, event_start_time, event_end_time,event_address, language_id, event_min_age, event_max_age, event_seat,event_coin_point, event_description, event_host_name, invite_people, invite_people_count, event_thumbnail, event_more_url, event_add_terms, event_special_note ,category_id, created_on, created_by, is_active, age_criteria_enabled) values
  (?,?,?,?,str_to_date(?,'%H:%i'),str_to_date(?,'%H:%i'),?,JSON_ARRAY(?),?,?,?,?,?,?,?,?,?,?,?,?,?,now(),?, true,?);
  update category 
  set post_count = post_count + 1
  where category_id = ? and is_active = true;
  `
}

const checkUsersEventById = () => {
  return ` 
  SELECT e.event_id as eventId, e.event_thumbnail as eventThumbnail, e.event_title as eventTitle,e.event_coin_point as eventCoinPoint,e.event_view as eventView, e.event_start_date as eventStartDate,e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, e.event_address as eventAddress, e.created_on as createdOn,c.category_name as categoryName, e.category_id as categoryId, e.event_seat as eventSeat, e.bought as bought,
  if((eip.is_accepted = true) or (eip2.is_accepted = true), true, false) as isBought,
  JSON_OBJECT( 'userId', ud2.created_by,'username', ud2.username, 'fullName', ud2.full_name, 'photoUrl', ud2.photo_url, 'planName' , s.plan_name, 'isFollow',if(ufm2.user_follow_mapping_id is not null , true, false), 'isCelebrity', ud2.is_celebrity) as user,
  IF(se.event_id IS NOT NULL, true, false) AS isSaved,
  (pe.score / (DATEDIFF(CURDATE(), e.created_on) + 1)) AS peScore
  FROM event e
  join category c on c.category_id = e.category_id 
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
  LEFT JOIN user_follow_mapping ufm ON (
      e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
      OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
      )
  LEFT JOIN user_details ud ON e.invite_people = ? AND ud.created_by = ? AND ud.is_active = true
  left JOIN event_invited_people eip2 ON ((
    ufm.followed_id = eip2.invited_user_id  AND ufm.created_by = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ufm.created_by = eip2.invited_user_id AND ufm.followed_id = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ud.created_by = eip2.invited_user_id AND e.created_by = eip2.created_by AND e.event_id = eip2.event_id AND eip2.is_active = true
    ))
  JOIN user_details ud2 ON e.created_by = ud2.created_by AND ud2.is_active = 1
  join subscription s on s.plan_id = ud2.plan_id
  left join user_follow_mapping ufm2 on ufm2.followed_id = ud2.created_by and ufm2.created_by = ?
  LEFT JOIN saved_event se ON e.event_id = se.event_id AND se.created_by = ?
  LEFT JOIN popularity_event pe ON pe.event_id = e.event_id
  WHERE (e.event_start_date >=  DATE_FORMAT(NOW(), '%Y-%m-%d')) and ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud.created_by IS NOT NULL))
  order BY peScore DESC limit ? offset ?;
  SELECT e.event_id as eventId, e.event_thumbnail as eventThumbnail, e.event_title as eventTitle,e.event_coin_point as eventCoinPoint,e.event_view as eventView, e.event_start_date as eventStartDate,e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, e.event_address as eventAddress, e.created_on as createdOn,c.category_name as categoryName, e.category_id as categoryId,
  if((eip.is_accepted = true) or (eip2.is_accepted = true), true, false) as isBought,
  JSON_OBJECT( 'userId', ud2.created_by,'username', ud2.username, 'fullName', ud2.full_name, 'photoUrl', ud2.photo_url, 'planName' , s.plan_name, 'isFollow',if(ufm2.user_follow_mapping_id is not null, true, false), 'isCelebrity', ud2.is_celebrity) as user,
  IF(se.event_id IS NOT NULL, true, false) AS isSaved
  FROM event e
  join category c on c.category_id = e.category_id 
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
  LEFT JOIN user_follow_mapping ufm ON (
      e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
      OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
      )
  LEFT JOIN user_details ud ON e.invite_people = ? AND ud.created_by = ? and e.created_by != ? AND ud.is_active = true
  left JOIN event_invited_people eip2 ON ((
    ufm.followed_id = eip2.invited_user_id  AND ufm.created_by = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ufm.created_by = eip2.invited_user_id AND ufm.followed_id = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ud.created_by = eip2.invited_user_id AND e.created_by = eip2.created_by AND e.event_id = eip2.event_id AND eip2.is_active = true
    ))
  JOIN user_details ud2 ON e.created_by = ud2.created_by AND ud2.is_active = 1
  join subscription s on s.plan_id = ud2.plan_id
  left join user_follow_mapping ufm2 on ufm2.followed_id = ud2.created_by and ufm2.created_by = ?
  LEFT JOIN saved_event se ON e.event_id = se.event_id AND se.created_by = ?
  WHERE (e.event_start_date >=  DATE_FORMAT(NOW(), '%Y-%m-%d')) and ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud.created_by IS NOT NULL))
  order by e.created_on desc limit ? offset ?;`
}

const checkHalfEventById = () => {
  return `SELECT e.event_id as eventId, e.event_thumbnail as eventThumbnail,e.event_coin_point as eventCoinPoint,e.event_view as eventView, e.event_title as eventTitle, e.event_start_date as eventStartDate,e.category_id as categoryId, e.event_seat as eventSeat, e.bought as bought,c.category_name as categoryName,e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, e.event_address as eventAddress, e.created_on as createdOn, 
  if((eip.is_accepted = true) or (eip2.is_accepted = true), true, false) as isBought,
  JSON_OBJECT( 'userId', ud2.created_by,'username', ud2.username, 'fullName', ud2.full_name, 'photoUrl', ud2.photo_url, 'planName' , s.plan_name, 'isFollow',if(ufm2.user_follow_mapping_id is not null , true, false), 'isCelebrity', ud2.is_celebrity) as user, if(se.saved_event_id is not null, true, false) as isSaved
  FROM event e
  join category c on c.category_id = e.category_id 
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
  LEFT JOIN user_follow_mapping ufm ON (
      e.created_by = ufm.created_by AND e.invite_people = ? AND ufm.followed_id = ?
      OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
      )
  LEFT JOIN user_details ud ON e.invite_people = ? AND ud.created_by = ? and e.created_by != ? AND ud.is_active = true
  left JOIN event_invited_people eip2 ON ((
    ufm.followed_id = eip2.invited_user_id  AND ufm.created_by = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ufm.created_by = eip2.invited_user_id AND ufm.followed_id = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ud.created_by = eip2.invited_user_id AND e.created_by = eip2.created_by AND e.event_id = eip2.event_id AND eip2.is_active = true
    ))
  JOIN user_details ud2 ON e.created_by = ud2.created_by AND ud2.is_active = 1
  join subscription s on s.plan_id = ud2.plan_id 
  left join user_follow_mapping ufm2 on ufm2.followed_id = ud2.created_by and ufm2.created_by = ?
  left join saved_event se on se.event_id = e.event_id and se.created_by = ?
  WHERE (e.event_id = ?) and (((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud.created_by IS NOT NULL)) or e.created_by = ? )`
}

const checkEventById = () => {
  return `
  SELECT e.event_id as eventId, e.event_title as eventTitle, e.event_thumbnail as eventThumbnail,e.event_view as eventView,e.category_id as categoryId,e.event_address as eventAddress, e.event_seat as eventSeat, e.bought as bought, e.language_id as languageId,e.event_min_age as eventMinAge, event_max_age as eventMaxAge, age_criteria_enabled as isAgeCriteriaEnabled, e.event_seat as eventSeat, e.event_host_name as eventHostName, e.event_description as eventDescription, e.event_start_date as eventStartDate,e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, e.invite_people as invitePeople, e.event_coin_point as eventCoinPoint, e.event_more_url as eventMoreUrl, e.event_add_terms as eventAddTerms, e.event_special_note as eventSpecialNote,c.category_name as categoryName, e.created_on as createdOn,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id is not null, true, false), 'isCelebrity', ud.is_celebrity, 'followerCount', ud.follower_user_count) as user, if(se.saved_event_id is not null, true, false) as isSaved
  FROM event e
  join category c on c.category_id = e.category_id 
  join user_details ud on e.created_by = ud.created_by and ud.is_active = 1
  join subscription s on s.plan_id = ud.plan_id
  left join event_invited_people eip on e.event_id = eip.event_id and eip.invited_user_id = ? and eip.is_active = true
  left join saved_event se on se.event_id = e.event_id and se.created_by = ?
  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
  where e.event_id =? and e.is_active = 1 and ((eip.is_accepted = 1) or (e.created_by = ?)); 
  SELECT language_name as languageName, language_id as languageId
  from language; `
}

const checkSuggestEvent = () => {
  return `
  SELECT e.event_id as eventId, e.event_thumbnail as eventThumbnail,e.event_coin_point as eventCoinPoint,e.event_view as eventView, e.event_title as eventTitle, e.event_start_date as eventStartDate,e.category_id as categoryId,c.category_name as categoryName, e.event_seat as eventSeat, e.bought as bought,e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, e.event_address as eventAddress, e.created_on as createdOn, 
  if((eip.is_accepted = true) or (eip2.is_accepted = true), true, false) as isBought,
  JSON_OBJECT( 'userId', ud2.created_by,'username', ud2.username, 'fullName', ud2.full_name, 'photoUrl', ud2.photo_url, 'planName' , s.plan_name, 'isFollow',if(ufm2.user_follow_mapping_id is not null, true, false), 'isCelebrity', ud2.is_celebrity) as user, if(se.saved_event_id is not null, true, false) as isSaved,
  (pe.score / (DATEDIFF(CURDATE(), e.created_on) + 1)) AS peScore
  FROM event e
  join category c on c.category_id = e.category_id 
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
  LEFT JOIN user_follow_mapping ufm ON (
      e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
      OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
      )
  LEFT JOIN user_details ud ON e.invite_people = ? AND ud.created_by = ? AND ud.is_active = true
  left JOIN event_invited_people eip2 ON ((
    ufm.followed_id = eip2.invited_user_id  AND ufm.created_by = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ufm.created_by = eip2.invited_user_id AND ufm.followed_id = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ud.created_by = eip2.invited_user_id AND e.created_by = eip2.created_by AND e.event_id = eip2.event_id AND eip2.is_active = true
    ))
  JOIN user_details ud2 ON e.created_by = ud2.created_by AND ud2.is_active = 1
  join subscription s on s.plan_id = ud2.plan_id 
  left join user_follow_mapping ufm2 on ufm2.followed_id = ud2.created_by and ufm2.created_by = ?
  left join saved_event se on se.event_id = e.event_id and se.created_by = ?
  LEFT JOIN popularity_event pe ON pe.event_id = e.event_id
  WHERE e.created_by = ? and (e.event_start_date >=  DATE_FORMAT(NOW(), '%Y-%m-%d')) and e.category_id in (?) and ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud.created_by IS NOT NULL))
  order by peScore desc limit ? offset ?; `
}

const deleteEventByID = () => {
  return `
  update event 
  set is_active = ?
  where event_id = ? and created_by = ? and is_active = true;
  update category 
  set post_count = post_count - 1
  where category_id = ? and is_active = true;`
}

const checkFollowedEvent = (filterEvent) => {
  const value = filterEvent === __constants.EVENT_LIST_FILTER[0] ? 'e.event_start_date >= (now () -interval 1 day)' : 'e.event_start_date < (now ()-interval 1 day)'
  return `
  SELECT e.event_id as eventId, e.event_thumbnail as eventThumbnail,e.event_coin_point as eventCoinPoint, e.event_title as eventTitle,e.event_view as eventView, e.event_start_date as eventStartDate,c.category_name as categoryName, e.category_id as categoryId, e.event_seat as eventSeat, e.bought as bought, e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, e.event_address as eventAddress, e.created_on as createdOn, 
  if((eip.is_accepted = true) or (eip2.is_accepted = true), true, false) as isBought,
  JSON_OBJECT( 'userId', ud2.created_by,'username', ud2.username, 'fullName', ud2.full_name, 'photoUrl', ud2.photo_url, 'planName' , s.plan_name, 'isFollow',if(ufm2.user_follow_mapping_id is not null, true, false), 'isCelebrity', ud2.is_celebrity) as user, if(se.saved_event_id is not null, true, false) as isSaved
  FROM event e
  join category c on c.category_id = e.category_id 
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
  LEFT JOIN user_follow_mapping ufm ON (
      e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
      OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
      )
  LEFT JOIN user_details ud ON e.invite_people = ? AND ud.created_by = ? AND ud.is_active = true
  left JOIN event_invited_people eip2 ON ((
    ufm.followed_id = eip2.invited_user_id  AND ufm.created_by = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ufm.created_by = eip2.invited_user_id AND ufm.followed_id = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ud.created_by = eip2.invited_user_id AND e.created_by = eip2.created_by AND e.event_id = eip2.event_id AND eip2.is_active = true
    ))
  JOIN user_details ud2 ON e.created_by = ud2.created_by AND ud2.is_active = 1
  join subscription s on s.plan_id = ud2.plan_id
  left join user_follow_mapping ufm2 on ufm2.followed_id = ud2.created_by and ufm2.created_by = ?
  left join saved_event se on se.event_id = e.event_id and se.created_by = ?
  WHERE e.created_by = ? and ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud.created_by IS NOT NULL)) and ${value}
  order by e.created_on desc limit ? offset ?; 
  select count(*) as totalEvents
  FROM event e
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
  LEFT JOIN user_follow_mapping ufm ON (
      e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
      OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
      )
  LEFT JOIN user_details ud ON e.invite_people = ? AND ud.created_by = ? AND ud.is_active = true
  WHERE e.created_by = ? and ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud.created_by IS NOT NULL)) and ${value};`
}

const getLanguage = () => {
  return `
  SELECT l.language_id as languageId, l.language_name as languageName
  FROM language l
  where l.is_active = 1; `
}

const bulkInsert = () => {
  return `insert IGNORE into event_invited_people (event_invited_people_id, event_id, invited_user_id, created_on, created_by, is_active, is_accepted)
  values ?`
}

const singleInsert = () => {
  return `insert IGNORE into event_invited_people (event_invited_people_id, event_id, invited_user_id, created_on, created_by, is_active, is_accepted, updated_on, updated_by)
  values (?,?,?,now(),?,true,?,now(), ?)`
}
const deleteInvitedPeople = () => {
  return `DELETE FROM event_invited_people 
  WHERE event_id = ? and created_by = ? and is_accepted = ?;`
}

const getInviteList = (searchField) => {
  let searchByValue = 'WHERE ud.is_active = true and '
  searchByValue += searchField ? `ud.full_name like ? and ((ud.created_by = ufm.created_by) 
      or (ud.created_by = ufm2.followed_id)) ` : '((ud.created_by = ufm.created_by) or (ud.created_by = ufm2.followed_id))'
  return `SELECT DISTINCT (ud.created_by) AS userId, ud.username AS username, ud.full_name AS fullName, ud.photo_url AS photoUrl, s.plan_name as planName, ud.is_celebrity as isCelebrity
  FROM user_details ud 
  join subscription s on s.plan_id = ud.plan_id
  left JOIN user_follow_mapping ufm  ON ufm.followed_id =? 
  left JOIN user_follow_mapping ufm2 on ufm2.created_by = ?  
  ${searchByValue}
  order by ud.full_name ASC limit ? offset ?;`
}

const checkEventSaved = () => {
  return `
  select saved_event_id 
  from saved_event
  where event_id = ? and created_by = ?`
}

const storeEvent = () => {
  return `
  insert into saved_event (saved_event_id, event_id, created_on, created_by) values
  (?,?,now(),?);
  `
}

const insertSharedEvent = () => {
  return `
  insert IGNORE into shared_event (shared_event_id,shared_user_id, event_id, created_on, created_by) values
  (?,?,?,now(),?);`
}

const sharedEvent = () => {
  return `
  insert IGNORE into shared_event_unique (event_id, created_by) values
  (?,?);`
}
const updateEventBuy = () => {
  return `update event_invited_people 
    set is_accepted =  1, updated_by = ?, updated_on = now ()
    where event_id =? and invited_user_id = ? `
}

const checkEventBuy = () => {
  return ` SELECT e.event_id as eventId, e.event_coin_point as eventCoinPoint, e.created_by as userId, if((eip.is_accepted = true) or (eip2.is_accepted = true), true, false) as isBought, if(eip.event_invited_people_id IS NOT NULL, true, false ) as isExists, 
  if((e.event_start_date >= DATE_FORMAT(NOW(), '%Y-%m-%d')), false, true) as isExpire, if(e.bought < e.event_seat, true, false ) as canBuy, e.event_seat as eventSeat
  FROM event e
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
  LEFT JOIN user_follow_mapping ufm ON (
      e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
      OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
      )
  LEFT JOIN user_details ud ON e.invite_people = ? AND ud.created_by = ? and e.created_by != ? AND ud.is_active = true
  left JOIN event_invited_people eip2 ON ((
    ufm.followed_id = eip2.invited_user_id  AND ufm.created_by = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ufm.created_by = eip2.invited_user_id AND ufm.followed_id = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
    ) OR (
      ud.created_by = eip2.invited_user_id AND e.created_by = eip2.created_by AND e.event_id = eip2.event_id AND eip2.is_active = true
    ))
  WHERE (e.event_id = ?) and ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud.created_by IS NOT NULL)) `
}

const createdEventList = (filterEvent) => {
  const value = filterEvent === __constants.EVENT_LIST_FILTER[0] ? 'e.event_start_date >= (now () -interval 1 day)' : 'e.event_start_date < (now ()-interval 1 day)'
  return `SELECT  e.event_id as eventId, e.event_title as eventTitle, e.event_coin_point as eventCoinPoint,e.event_view as eventView, e.event_thumbnail as eventThumbnail,c.category_name as categoryName, e.created_on as 
    createdOn, e.event_seat as eventSeat, e.bought as bought, e.event_address as eventAddress, e.event_start_date as eventStartDate, e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, e.language_id as languageId,JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'isCelebrity', ud.is_celebrity, 'planName', s.plan_name) as user
    FROM event e
    join category c on c.category_id = e.category_id 
    JOIN user_details ud ON ud.created_by = e.created_by AND ud.is_active = true
    join subscription s on s.plan_id = ud.plan_id
     where e.created_by = ? and ${value} and e.is_active = 1
    order by e.created_on desc limit ? offset ?;
    SELECT count( e.event_id ) as totalCreatedEvent
    FROM event e
    where e.created_by = ? and ${value} and e.is_active = 1`
}

const savedEventList = (filterEvent) => {
  const value = filterEvent === __constants.EVENT_LIST_FILTER[0] ? 'e.event_start_date > now ()' : 'e.event_start_date <= now ()'
  return `SELECT  e.event_id as eventId, e.event_title as eventTitle, e.event_coin_point as eventCoinPoint,e.event_view as eventView, e.event_thumbnail as eventThumbnail,c.category_name as categoryName, e.event_address as eventAddress, e.event_seat as eventSeat, e.bought as bought, e.event_start_date as eventStartDate, e.event_end_date as eventEndDate,se.created_on as savedOn, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, if((eip.is_accepted = true) or (eip2.is_accepted = true), true, false) as isBought,
    JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'isCelebrity', ud.is_celebrity, 'planName', s.plan_name) as user
    FROM saved_event se
    join event e on e.event_id = se.event_id and e.is_active = 1
    join category c on c.category_id = e.category_id 
    JOIN user_details ud ON ud.created_by = e.created_by AND ud.is_active = true
    join subscription s on s.plan_id = ud.plan_id
    LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
    LEFT JOIN user_follow_mapping ufm ON (
        e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
        OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
        )
    LEFT JOIN user_details ud2 ON e.invite_people = ? AND ud2.created_by = ? AND ud2.is_active = true
    left JOIN event_invited_people eip2 ON ((
      ufm.followed_id = eip2.invited_user_id  AND ufm.created_by = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
      ) OR (
        ufm.created_by = eip2.invited_user_id AND ufm.followed_id = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
      ) OR (
        ud2.created_by = eip2.invited_user_id AND e.created_by = eip2.created_by AND e.event_id = eip2.event_id AND eip2.is_active = true
      ))
     where se.created_by = ? and ${value} and ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud2.created_by IS NOT NULL))
    order by e.created_on desc limit ? offset ?;
    SELECT count( se.event_id ) as totalSavedEvent
    FROM saved_event se
    join event e on e.event_id = se.event_id and e.is_active = 1
    where se.created_by = ? and ${value}`
}

const receivedEventList = (filterEvent) => {
  const value = filterEvent === __constants.EVENT_LIST_FILTER[0] ? 'e.event_start_date >= (now () -interval 1 day)' : 'e.event_start_date < (now ()-interval 1 day)'
  return `SELECT  e.event_id as eventId, e.event_title as eventTitle, e.event_coin_point as eventCoinPoint,e.event_view as eventView, e.event_thumbnail as eventThumbnail,c.category_name as categoryName, e.event_address as eventAddress, e.event_seat as eventSeat, e.bought as bought,se.created_on as sharedOn, e.event_start_date as eventStartDate, e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, if((eip.is_accepted = true) or (eip2.is_accepted = true), true, false) as isBought,
    JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'isCelebrity', ud.is_celebrity, 'planName', s.plan_name) as user
    FROM shared_event se
    join event e on e.event_id = se.event_id and e.is_active = 1
    join category c on c.category_id = e.category_id 
    JOIN user_details ud ON ud.created_by = e.created_by AND ud.is_active = true
    join subscription s on s.plan_id = ud.plan_id
    LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id AND e.invite_people = ? AND eip.invited_user_id = ?
    LEFT JOIN user_follow_mapping ufm ON (
        e.created_by = ufm.created_by AND e.invite_people = ?  AND ufm.followed_id = ?
        OR e.created_by = ufm.followed_id AND e.invite_people = ? AND ufm.created_by = ?
        )
    LEFT JOIN user_details ud2 ON e.invite_people = ? AND ud2.created_by = ? AND ud2.is_active = true
    left JOIN event_invited_people eip2 ON ((
      ufm.followed_id = eip2.invited_user_id  AND ufm.created_by = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
      ) OR (
        ufm.created_by = eip2.invited_user_id AND ufm.followed_id = eip2.created_by and e.event_id = eip2.event_id AND eip2.is_active = true
      ) OR (
        ud2.created_by = eip2.invited_user_id AND e.created_by = eip2.created_by AND e.event_id = eip2.event_id AND eip2.is_active = true
      ))
     where se.shared_user_id = ? and ${value} and ((e.invite_people = ? AND eip.invited_user_id IS NOT NULL) OR (e.invite_people IN (?,?) AND ufm.created_by IS NOT NULL) OR (e.invite_people = ? AND ud2.created_by IS NOT NULL))
    order by e.created_on desc limit ? offset ?;
    SELECT count( se.event_id ) as totalReceivedEvent
    FROM shared_event se
    join event e on e.event_id = se.event_id and e.is_active = 1
    where se.shared_user_id = ? and ${value}`
}

const getEventPointList = (orderFilter) => {
  return `select e.event_title as mediaTitle, e.created_on as createdOn, e.event_view as mediaView, e.event_point as mediaPoint, e.event_id as mediaId
  from event e
  where e.created_by = ? and e.is_active = true
  order by ${orderFilter} limit ? offset ?;`
}

const addEventBuy = () => {
  return `insert IGNORE into event_invited_people (event_invited_people_id, event_id, invited_user_id, created_on, created_by, is_active, is_accepted)
  values (?,?,?,now(),?,1,?)`
}

const getLanguageById = () => {
  return `SELECT JSON_ARRAYAGG(l.language_id) as languageId
  FROM language l
  where l.language_id in (?) and l.is_active = 1;`
}

const boughtEventList = (filterEvent) => {
  const value = filterEvent === __constants.EVENT_LIST_FILTER[0] ? 'e.event_start_date >= (now () -interval 1 day)' : 'e.event_start_date < (now ()-interval 1 day)'
  return `SELECT  e.event_id as eventId, e.event_title as eventTitle, e.event_coin_point as eventCoinPoint, e.event_thumbnail as eventThumbnail,c.category_name as categoryName,e.category_id as categoryId,e.event_view as eventView, eip.updated_on as 
    boughtOn, e.event_seat as eventSeat, e.bought as bought, e.event_address as eventAddress, e.event_start_date as eventStartDate,e.event_end_date as eventEndDate, DATE_FORMAT(e.event_start_time, "%H:%i") as eventStartTime, DATE_FORMAT(e.event_end_time, "%H:%i") as eventEndTime, e.language_id as languageId, 1 as isBought,
    JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'isCelebrity', ud.is_celebrity, 'planName', s.plan_name) as user
    FROM event_invited_people eip
    join event e on e.event_id = eip.event_id
    join category c on c.category_id = e.category_id 
    JOIN user_details ud ON ud.created_by = e.created_by AND ud.is_active = true
    join subscription s on s.plan_id = ud.plan_id
    where eip.invited_user_id = ? and eip.is_accepted = true and ${value}
    order by e.event_start_date desc limit ? offset ?;
    SELECT count( e.event_id ) as totalBoughtEvent
    FROM event_invited_people eip
    join event e on e.event_id = eip.event_id
    where eip.invited_user_id = ? and eip.is_accepted = true and ${value}`
}

const viewList = () => {
  return `insert into event_views_list (event_id, owner_id, category_id, time_in_sec, created_by, watched_count)
  values ?
  ON DUPLICATE KEY 
  UPDATE time_in_sec =VALUES(time_in_sec), watched_count = watched_count+1`
}

const coinRedemmed = () => {
  return `insert into coin_redeemed_history (coin_redeemed_history_id,media_type, media_id, created_on, created_by, coin_spend, sub_type)
  values (?,?,?,now(),?,?,?);
  update event set bought = bought + 1
  where event_id = ? and is_active = 1;
  `
}

const updateRedemmed = () => {
  return ` update coin_redeemed_history 
  set coin_spend = coin_spend + ?
  where media_id = ? and created_by = ? and media_type = ? and sub_type=?;`
}

const coinRedeemList = (filterValue) => {
  return `select crh.media_type as mediaType, crh.media_id as mediaId, crh.created_on as createdOn, crh.created_by as userId, crh.coin_spend as coinSpend, crh.sub_type as subType, e.event_title as mediaTitle
  from coin_redeemed_history crh
  join event e on e.event_id = crh.media_id
  where crh.created_by = ? and crh.sub_type =? and crh.media_type =?
  order by ${filterValue} limit ? offset ?;`
}

const checkEventCanBuy = () => {
  return `
  SELECT ud2.created_by AS userId
  FROM event e
  LEFT JOIN event_invited_people eip ON e.event_id = eip.event_id 
      AND e.invite_people = ?
      AND eip.invited_user_id IN (?)
  LEFT JOIN user_follow_mapping ufm ON e.created_by = ufm.created_by 
      AND e.invite_people = ? 
      AND ufm.followed_id IN (?)
  LEFT JOIN user_follow_mapping ufm2 ON e.created_by = ufm2.followed_id 
      AND e.invite_people = ? 
      AND ufm2.created_by IN (?)
  LEFT JOIN user_details ud ON e.invite_people =?
      AND ud.created_by IN (?) 
      AND e.created_by != ud.created_by 
      AND ud.is_active = true
  JOIN user_details ud2 ON (
      ud2.created_by IN (eip.invited_user_id) 
      OR ud2.created_by IN (ufm.followed_id) 
      OR ud2.created_by IN (ufm2.created_by) 
      OR ud2.created_by IN (ud.created_by)
  ) AND ud2.is_active = 1
  WHERE e.event_id = ?;`
}

const getCategoryWise = () => {
  return `SELECT GROUP_CONCAT(category_id) as categoryId
  FROM event_inserted_category_wise_map
  WHERE created_by = ?
  ORDER BY watch_count DESC`
}

const getUserBuyEvent = () => {
  return `SELECT DISTINCT (ud.created_by) AS userId, ud.username AS username, ud.full_name AS fullName, ud.photo_url AS photoUrl, s.plan_name as planName, ud.is_celebrity as isCelebrity
  FROM event_invited_people eip
  join user_details ud on eip.invited_user_id = ud.created_by
  join subscription s on s.plan_id = ud.plan_id
  WHERE eip.is_active = true and eip.event_id = ? and eip.is_accepted = 1
  order by ud.full_name;`
}

module.exports = {
  checkUserEventById,
  checkEventByAll,
  updateEvent,
  insertEvent,
  checkUsersEventById,
  checkEventById,
  checkSuggestEvent,
  deleteEventByID,
  checkFollowedEvent,
  getLanguage,
  bulkInsert,
  deleteInvitedPeople,
  getInviteList,
  checkEventSaved,
  storeEvent,
  insertSharedEvent,
  createdEventList,
  updateEventBuy,
  checkEventBuy,
  getEventPointList,
  addEventBuy,
  getLanguageById,
  savedEventList,
  singleInsert,
  boughtEventList,
  receivedEventList,
  viewList,
  sharedEvent,
  coinRedemmed,
  updateRedemmed,
  checkEventCanBuy,
  coinRedeemList,
  getCategoryWise,
  checkHalfEventById,
  getUserBuyEvent
}
