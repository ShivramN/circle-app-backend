const getList = () => {
  return `SELECT n.notification_id as notificationId, n.is_read as isRead, n.media_type as mediaType, n.title, n.notification_type as notificationType, n.media_id as mediaId, n.created_by as userId, n.sent_user_id as sendUserId, ud.full_name as senderName, ud.username as senderUsername,
    CASE
      WHEN n2.news_id IS NOT NULL THEN JSON_UNQUOTE(n2.news_banner -> '$.url')
      WHEN e.event_id IS NOT NULL THEN JSON_UNQUOTE(e.event_thumbnail -> '$[0].url')
      WHEN ((v.voice_id IS NOT NULL) and (v.voice_url is not null)) THEN JSON_UNQUOTE(JSON_EXTRACT(voice_url , '$[0].url'))
      ELSE ud.photo_url
  END AS url_data
  FROM notification n
  LEFT JOIN news n2 ON n2.news_id = n.media_id 
  LEFT JOIN event e ON e.event_id = n.media_id 
  LEFT JOIN voices v ON v.voice_id = n.media_id 
  JOIN user_details ud ON ud.created_by = n.created_by
  Join user_details ud1 on ud1.created_by = n.sent_user_id
  where (n.is_read = 0 or (n.is_read = 1 and (n.updated_on > now() - interval 24 hour))) and n.sent_user_id = ?
  order by n.is_read asc, n.updated_on desc limit ? offset ?;
  select n.notification_id
  from notification n 
  where n.is_read = 0 and n.sent_user_id = ?
  limit 1;
  `
}

const updateStatus = () => {
  return `update notification
  set is_read = ?, updated_on =now(), updated_by=?
  where notification_id=? and sent_user_id =? 
  `
}

module.exports = {
  getList,
  updateStatus
}
