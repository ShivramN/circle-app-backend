const checkUserNewsById = () => {
  return `
  SELECT news_id as newsId, news_title as newsTitle, news_description as newsDescription, news_url as newsUrl, category_id as categoryId,news_banner as newsBanner
  FROM news
  where news_id =? and created_by = ? and is_active = 1; `
}

const checkNewsByAll = () => {
  return `SELECT news_id as newsId, news_title as newsTitle, news_description as newsDescription, news_url as newsUrl, category_id as categoryId, news_banner as newsBanner 
  FROM news
  where news_title = ? and news_description = ? and JSON_CONTAINS(news_url, ? ) and created_by = ? and category_id = ? and JSON_CONTAINS(news_banner,?) and created_on > now() - interval 1 hour and is_active = 1; `
}

const updateNews = () => {
  return `update news 
  set news_title =? , news_description=?, news_url = ?, category_id = ?, updated_on = now(), updated_by = ?, news_banner = ?
  where news_id = ? and created_by = ? and is_active = true;`
}

const insertNews = () => {
  return `insert into news (news_id, news_title, news_description,news_url,category_id, created_on, created_by, news_banner, is_active) values
  (?,?,?,?,?,now(),?,?, true);
  update category 
  set post_count = post_count + 1
  where category_id = ? and is_active = true;
  `
}

// const checkUsersNewsById = () => {
//   return `
//   SELECT DISTINCT
//   n.news_id AS newsId,
//   n.news_title AS newsTitle,
//   n.news_description AS newsDescription,
//   n.news_url AS newsUrl,
//   n.news_view as newsView,
//   c.category_name AS categoryName,
//   n.category_id AS categoryId,
//   n.created_on AS createdOn,
//   n.news_banner AS newsBanner,
//   JSON_OBJECT(
//     'userId', ud.created_by,
//     'username', ud.username,
//     'fullName', ud.full_name,
//     'photoUrl', ud.photo_url,
//     'planName', s.plan_name,
//     'isFollow', IF(ufm.user_follow_mapping_id IS NOT NULL, true, false),
//     'isCelebrity', ud.is_celebrity,
//     'followerCount', ud.follower_user_count
//   ) AS user,
//   IF(sn.news_id IS NOT NULL, true, false) AS isSaved,
//   (pn.score / (DATEDIFF(CURDATE(), n.created_on) + 1)) AS pnScore
// FROM
//   news n
//   JOIN category c ON c.category_id = n.category_id
//   JOIN user_details ud ON n.created_by = ud.created_by AND ud.is_active = 1
//   JOIN subscription s ON s.plan_id = ud.plan_id
//   LEFT JOIN user_follow_mapping ufm ON ufm.followed_id = ud.created_by AND ufm.created_by = ?
//   LEFT JOIN saved_news sn ON n.news_id = sn.news_id AND sn.created_by = ?
//   LEFT JOIN popularity_news pn ON pn.news_id = n.news_id
// WHERE
//    n.is_active = 1
// ORDER BY pnScore DESC
// LIMIT ? OFFSET ?;
//   SELECT n.news_id as newsId, n.news_title as newsTitle, n.news_description as newsDescription,
//   n.news_view as newsView, n.news_url as newsUrl, c.category_name as categoryName,n.category_id as categoryId, n.created_on as createdOn,n.news_banner as newsBanner,
//   JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id  IS NOT NULL , true, false), 'isCelebrity', is_celebrity) as user,
//  IF(sn.news_id IS NOT NULL, true, false) AS isSaved
//  FROM news n
//  join category c on c.category_id = n.category_id
//  join user_details ud on n.created_by = ud.created_by and ud.is_active = 1
//  join subscription s on s.plan_id = ud.plan_id
//  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
//  left join saved_news sn on n.news_id = sn.news_id and sn.created_by = ?
//  where  n.is_active = 1
//  order by n.created_on desc limit ? offset ?; `
// }
const checkUsersNewsById = () => {
  return `
  SELECT distinct(n.news_id) as newsId, n.news_title as newsTitle, n.news_description as newsDescription,
  n.news_view as newsView, n.news_url as newsUrl, c.category_name as categoryName,n.category_id as categoryId, n.created_on as createdOn,n.news_banner as newsBanner,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id  IS NOT NULL , true, false), 'isCelebrity', is_celebrity) as user,
 IF(sn.news_id IS NOT NULL, true, false) AS isSaved
 FROM news n
 join category c on c.category_id = n.category_id 
 join user_details ud on n.created_by = ud.created_by and ud.is_active = 1
 join subscription s on s.plan_id = ud.plan_id 
 left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
 left join saved_news sn on n.news_id = sn.news_id and sn.created_by = ?
 where  n.is_active = 1 
 order by n.created_on desc limit ? offset ?; `
}

const checkNewsById = () => {
  return `
  SELECT n.news_id as newsId, n.news_title as newsTitle, n.news_description as newsDescription,n.category_id as categoryId, n.news_url as newsUrl, c.category_name as categoryName, n.news_banner as newsBanner,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id  IS NOT NULL , true, false), 'isCelebrity', ud.is_celebrity, 'followerCount', ud.follower_user_count) as user,
  n.news_view as newsView,IF(sn.news_id IS NOT NULL, true, false) AS isSaved
  FROM news n
  join category c on c.category_id = n.category_id 
  join user_details ud on n.created_by = ud.created_by and ud.is_active = 1
  join subscription s on s.plan_id = ud.plan_id 
  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
  left join saved_news sn on n.news_id = sn.news_id and sn.created_by = ?
  where n.news_id =? and n.is_active = 1;  `
}

const getCategoryWise = () => {
  return `SELECT GROUP_CONCAT(category_id) as categoryId
  FROM news_inserted_category_wise_map
  WHERE created_by = ?
  ORDER BY watch_count DESC`
}

const checkSuggestNews = () => {
  return `
  SELECT n.news_id as newsId, n.news_title as newsTitle, n.news_description as newsDescription, n.news_url as newsUrl, c.category_name as categoryName,n.category_id as categoryId, n.created_on as createdOn,n.news_banner as newsBanner,
  n.news_view as newsView,
  JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id  IS NOT NULL , true, false), 'isCelebrity', ud.is_celebrity,  'followerCount', ud.follower_user_count) as user,
  IF(sn.news_id IS NOT NULL, true, false) AS isSaved,
  (pn.score / (DATEDIFF(CURDATE(), n.created_on) + 1)) AS pnScore
  FROM news n
  join category c on c.category_id = n.category_id 
  join user_details ud on n.created_by = ud.created_by and ud.is_active = 1
  join subscription s on s.plan_id = ud.plan_id 
  left join user_follow_mapping ufm on ufm.followed_id = ud.created_by and ufm.created_by = ?
  left join saved_news sn on n.news_id = sn.news_id and sn.created_by = ?
  LEFT JOIN popularity_news pn ON pn.news_id = n.news_id
  where n.category_id in (?) and n.is_active = 1
  order by pnScore desc limit ? offset ?; `
}

const deleteNewsByID = () => {
  return `
  update news 
  set is_active = ?
  where news_id = ? and created_by = ? and is_active = true;
  update category 
  set post_count = post_count - 1
  where category_id = ? and is_active = true;`
}

const checkFollowedNews = () => {
  return `
  SELECT n.news_id as newsId, n.news_title as newsTitle, n.news_description as newsDescription, n.news_url as newsUrl,n.category_id as categoryId,c.category_name as categoryName,n.news_banner as newsBanner, n.created_on as createdOn, JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'planName' , s.plan_name, 'isFollow', if(ufm.user_follow_mapping_id  IS NOT NULL , true, false), 'isCelebrity', ud.is_celebrity, 'followerCount', ud.follower_user_count) as user,
  IF(sn.news_id IS NOT NULL, true, false) AS isSaved,
  n.news_view as newsView
  FROM news n
  join category c on c.category_id = n.category_id 
  join user_details ud on n.created_by = ud.created_by and ud.is_active = 1
  join subscription s on s.plan_id = ud.plan_id 
  left join user_follow_mapping ufm on ufm.created_by  = ? and ufm.followed_id = ?
  left join saved_news sn on n.news_id = sn.news_id and sn.created_by = ?
  where n.created_by = ? and n.is_active = 1
  order by n.created_on desc limit ? offset ?;
  select count(*) as totalNews
  from news n
  where n.created_by = ? and n.is_active = 1; `
}

const storeNews = () => {
  return `
  insert into saved_news (saved_news_id, news_id, created_on, created_by) values
  (?,?,now(),?); `
}

const checkNewsSaved = () => {
  return `
  select saved_news_id 
  from saved_news
  where news_id = ? and created_by = ?`
}

const checkNewsShared = () => {
  return `
  select shared_news_id 
  from shared_news
  where news_id = ? and created_by = ? and shared_user_id = ?`
}

const insertSharedNews = () => {
  return `
  insert IGNORE into shared_news (shared_news_id,shared_user_id, news_id, created_on, created_by)
  VALUES ?`
}

const sharedNews = () => {
  return `
  insert IGNORE into shared_news_unique (news_id, created_by)
  VALUES (?,?)`
}
const createdNewsList = () => {
  return `SELECT n.news_id as newsId, n.news_title as newsTitle, n.news_description as newsDescription,
  n.news_view as newsView, n.news_url as newsUrl, c.category_name as categoryName,n.category_id as categoryId, n.created_on as createdOn,n.news_banner as newsBanner, JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url,
  'followerCount', ud.follower_user_count, 'isCelebrity', ud.is_celebrity, 'planName', s.plan_name) as user
  FROM news n
  join category c on c.category_id = n.category_id 
  join user_details ud on n.created_by = ud.created_by and ud.is_active = 1
  join subscription s on s.plan_id = ud.plan_id 
  where n.created_by = ? and n.is_active = 1
  order by n.created_on desc limit ? offset ?;
  SELECT count(n.news_id) as totalCreatedNews
  FROM news n
  where n.created_by = ? and n.is_active = 1;`
}

const savedNewsList = () => {
  return `SELECT  n.news_id as newsId, n.news_title as newsTitle, n.news_description as newsDescription,
  n.news_view as newsView, n.news_url as newsUrl, c.category_name as categoryName,n.category_id as categoryId, n.created_on as createdOn,n.news_banner as newsBanner,sn.created_on as savedOn, JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url,
  'followerCount', ud.follower_user_count, 'isCelebrity', ud.is_celebrity, 'planName', s.plan_name) as user,
  n.news_view as newsView
  FROM saved_news sn
  join news n on sn.news_id = n.news_id and n.is_active = 1
  join category c on c.category_id = n.category_id 
  join user_details ud on n.created_by = ud.created_by and ud.is_active = 1
  join subscription s on s.plan_id = ud.plan_id 
  where sn.created_by = ? and n.is_active = 1
  order by sn.created_on desc limit ? offset ?;
  SELECT count(sn.saved_news_id) as totalSavedNews
  FROM saved_news sn
  where sn.created_by = ?;`
}

const receivedNewsList = () => {
  return `
  SELECT  n.news_id as newsId, n.news_title as newsTitle, n.news_description as newsDescription,
  n.news_view as newsView, n.news_url as newsUrl, c.category_name as categoryName,n.category_id as categoryId, n.created_on as createdOn,n.news_banner as newsBanner, JSON_OBJECT( 'userId', ud.created_by,'username', ud.username, 'fullName', ud.full_name, 'isCelebrity', ud.is_celebrity, 
  'followerCount', ud.follower_user_count, 'planName', s.plan_name) as user,sn.created_on as sharedOn,
  n.news_view as newsView
    FROM shared_news sn
    join news n on sn.news_id = n.news_id and n.is_active = 1
    join category c on c.category_id = n.category_id 
    join user_details ud on sn.created_by = ud.created_by and ud.is_active = 1
    join subscription s on s.plan_id = ud.plan_id 
    where sn.shared_user_id = ? and n.is_active = 1
    order by sn.created_on desc limit ? offset ?;
    SELECT count(sn.shared_news_id) as totalSharedNews
    FROM shared_news sn
    where sn.shared_user_id = ?;`
}

const getNewsPointList = (orderFilter) => {
  return `
  select n.news_title as mediaTitle, n.created_on as createdOn, n.news_view as mediaView, n.news_point as mediaPoint, n.news_id as mediaId
  from news n
  where n.created_by = ? and n.is_active = true
  order by ${orderFilter} limit ? offset ?;
 `
}

const viewList = () => {
  return `insert into news_views_list (news_id, owner_id, category_id, time_in_sec, created_by, watched_count)
  values ?
  ON DUPLICATE KEY 
  UPDATE time_in_sec = VALUES(time_in_sec), watched_count = watched_count+1`
}

module.exports = {
  checkUserNewsById,
  checkNewsByAll,
  updateNews,
  insertNews,
  checkUsersNewsById,
  checkNewsById,
  checkSuggestNews,
  deleteNewsByID,
  checkFollowedNews,
  storeNews,
  checkNewsSaved,
  checkNewsShared,
  insertSharedNews,
  createdNewsList,
  savedNewsList,
  receivedNewsList,
  getNewsPointList,
  viewList,
  sharedNews,
  getCategoryWise
}
