/**
 * Integrate a news query when user in large amount
 * SELECT DISTINCT
  n.news_id AS newsId,
  n.news_title AS newsTitle,
  n.news_description AS newsDescription,
  n.news_url AS newsUrl,
  n.news_view as newsView,
  c.category_name AS categoryName,
  n.category_id AS categoryId,
  n.created_on AS createdOn,
  n.news_banner AS newsBanner,
  JSON_OBJECT(
    'userId', ud.created_by,
    'username', ud.username,
    'fullName', ud.full_name,
    'photoUrl', ud.photo_url,
    'planName', s.plan_name,
    'isFollow', IF(ufm.user_follow_mapping_id IS NOT NULL, true, false),
    'isCelebrity', is_celebrity
  ) AS user,
  IF(sn.news_id IS NOT NULL, true, false) AS isSaved,
  (pn.score / (DATEDIFF(CURDATE(), n.created_on) + 1)) AS pnScore
FROM
  news n
  JOIN category c ON c.category_id = n.category_id
  JOIN user_details ud ON n.created_by = ud.created_by AND ud.is_active = 1
  JOIN subscription s ON s.plan_id = ud.plan_id
  LEFT JOIN user_follow_mapping ufm ON ufm.followed_id = ud.created_by AND ufm.created_by = ?
  LEFT JOIN saved_news sn ON n.news_id = sn.news_id AND sn.created_by = ?
  LEFT JOIN (
    SELECT owner_id, watch_count
    FROM news_inserted_user_wise_map
    WHERE created_by = ?
    ORDER BY watch_count DESC
  ) niuwm ON niuwm.owner_id = n.created_by
  LEFT JOIN popularity_news pn ON (pn.owner_id = niuwm.owner_id) OR (pn.news_id = n.news_id)
WHERE
  n.created_by != ? AND n.is_active = 1
ORDER BY niuwm.watch_count DESC, pnScore DESC
LIMIT ? OFFSET ?;
  SELECT n.news_id as newsId, n.news_title as newsTitle, n.news_description as newsDescription, n.news_url as newsUrl, c.category_name as categoryName,n.category_id as categoryId, n.created_on as createdOn,n.news_banner as newsBanner,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id  IS NOT NULL , true, false), 'isCelebrity', is_celebrity) as user,
 IF(sn.news_id IS NOT NULL, true, false) AS isSaved
 FROM news n
 join category c on c.category_id = n.category_id
 join user_details ud on n.created_by = ud.created_by and ud.is_active = 1
 join subscription s on s.plan_id = ud.plan_id
 left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
 left join saved_news sn on n.news_id = sn.news_id and sn.created_by = ?
 where n.created_by != ? and n.is_active = 1
 order by n.created_on desc limit ? offset ?; `
 */
