
// SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage ,
//        CASE WHEN (SELECT COUNT(*) FROM category WHERE post_count < 100 and is_active = 1) > 0
//             THEN  null
//             ELSE post_count
//        END as postCount,
//        CASE WHEN (SELECT COUNT(*) FROM category WHERE followers_count < 1000 and is_active = 1) > 0
//             THEN  null
//             ELSE followers_count
//        END as followerCount
// FROM category
// where is_active = 1;
const getCategorywithPostAndFollower = () => {
  return `
  SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage, post_count as postCount, followers_count as followersCount, created_on as createdOn
  FROM category
  where is_active = 1 
  order by category_name asc limit ? offset ?;
  SELECT count(category_id) as totalCount
  FROM category
  where is_active = 1 ; `
}

const getPostFollowerCount = () => {
  return `
  SELECT COUNT(post_count) as postCount FROM category WHERE post_count < 100 and is_active = 1;
  SELECT COUNT(followers_count) as followersCount FROM category WHERE followers_count < 1000 and is_active = 1;`
}
const getCategory = () => {
  return `
  SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage 
  FROM category
  where is_active = 1; `
}

const addCategory = () => {
  return `
  insert into category (category_id, category_name, category_description,category_image, created_on, created_by, is_active) values
  (?,?,?,?,now(),?, true) `
}

const checkCategory = () => {
  return `SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage, created_on as createdOn
  FROM category
  where category_id = ? and is_active = 1;`
}

const checkCategoryDetails = () => {
  return `SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage, post_count as postCount, followers_count as followersCount
  FROM category
  where category_name = ? and category_description = ? and category_image = ? and is_active = 1;`
}

const updateCategory = () => {
  return `update category 
  set category_name = ?, category_description =?, category_image=? , updated_on = now(), updated_by = ? 
  where category_id = ? and is_active = true`
}

const updateFollowCount = (oldCategoryId) => {
  let addQuery = ''
  if (oldCategoryId.length > 0) {
    addQuery += `update category 
    set followers_count = followers_count - 1
    where category_id in (?) and is_active = true;`
  }
  return `update category 
  set followers_count = followers_count + 1
  where category_id in (?) and is_active = true;
  ${addQuery}`
}

const getCategoryByCategoryId = () => {
  return `  
  SELECT GROUP_CONCAT(c1.category_id) as categoryId, COUNT(c2.followers_count) as followersCount
  FROM category c1
  left join category c2 on c2.category_id in (c1.category_id) and c2.followers_count < 100
  where c1.category_id in (?)  and c1.is_active = 1; 
  `
}

const deleteCategory = () => {
  return `update category
  set is_active = ?, updated_on = now(), updated_by = ?
  where category_id = ?`
}

const checkPlan = () => {
  return `select plan_id as planId, plan_name as planName, view_voice as viewVoice, add_voice as addVoice, view_news as viewNews, view_event as viewEvent, add_news as addNews,
  add_event as addEvent, view_achievement as viewAchievement, spend_achievement as spendAchievement, apply_celebrity as applyCelebrity, plan_title as planTitle, plan_discount_price as planDiscountPrice, plan_price as planPrice, plan_icon as planIcon, plan_days_details as planDaysDetails, plan_description as planDescription, ROUND(plan_discount_price*100/plan_price) as percentage, plan_total_days as planTotalDays
  from subscription
  where plan_name = ? and view_voice = ? and add_voice =? and  view_news = ? and view_event =? and  add_news = ? and
  add_event =? and view_achievement = ? and spend_achievement =? and apply_celebrity =? and plan_title =? and plan_discount_price =? and plan_price =? and plan_icon =? and plan_days_details =? and plan_description =JSON_ARRAY(?) and plan_total_days = ? and is_active = true`
}

const getAdminDetails = () => {
  return `select email, salt_key as saltKey, hash_password as hashPassword, full_name as fullName, user_id as userId
  from master
  where email = ? and is_active = 1`
}

const insertPlan = () => {
  return `insert into subscription (plan_id, plan_name, view_voice, add_voice, view_news, view_event, add_news,
  add_event, view_achievement, spend_achievement, apply_celebrity, plan_title, plan_discount_price, plan_price, plan_icon, plan_days_details, plan_description, plan_total_days, is_active, created_on, created_by) values
  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,JSON_ARRAY(?),?,1,now(),?)`
}

const getPlanList = () => {
  return `select plan_id as planId, plan_name as planName, view_voice as viewVoice, add_voice as addVoice, view_news as viewNews, view_event as viewEvent, add_news as addNews,is_active as isActive,
  add_event as addEvent, view_achievement as viewAchievement, spend_achievement as spendAchievement, apply_celebrity as applyCelebrity, plan_title as planTitle, plan_discount_price as planDiscountPrice, plan_price as planPrice, plan_icon as planIcon, plan_days_details as planDaysDetails, plan_description as planDescription, ROUND(plan_discount_price*100/plan_price) as percentage, plan_total_days as planTotalDays, is_active as isActive, created_by as createdBy, created_on as createdOn
  from subscription
  order by is_active desc, created_on asc ;`
}

const checkPlanDetail = (isActive) => {
  let value = ''
  if (isActive) { value = 'and is_active = 1' }
  return `select plan_id as planId, plan_name as planName, view_voice as viewVoice, add_voice as addVoice, view_news as viewNews, view_event as viewEvent, add_news as addNews,
  add_event as addEvent, view_achievement as viewAchievement, spend_achievement as spendAchievement, apply_celebrity as applyCelebrity, plan_title as planTitle, plan_discount_price as planDiscountPrice, plan_price as planPrice, plan_icon as planIcon, plan_days_details as planDaysDetails, plan_description as planDescription, ROUND(plan_discount_price*100/plan_price) as percentage, plan_total_days as planTotalDays, is_active as isActive, created_by as createdBy, created_on as createdOn
  from subscription
  where plan_id = ? ${value}`
}

const updateSubcription = () => {
  return `update subscription
  set plan_name = ?, view_voice = ?, add_voice =?,  view_news = ?, view_event =?,  add_news = ?,
  add_event =?, view_achievement = ?, spend_achievement =?, apply_celebrity =?, plan_title =?, plan_discount_price =?, plan_price =?, plan_icon =?, plan_days_details =?, plan_description =JSON_ARRAY(?), plan_total_days = ?, updated_on = now(), updated_by = ?
  where plan_id = ?
  `
}

const deletePlan = () => {
  return `update subscription
  set is_active = ?, updated_on = now(), updated_by = ?
  where plan_id = ?`
}

const getAdminDetailsById = () => {
  return `select email, salt_key as saltKey, hash_password as hashPassword, full_name as fullName, user_id as userId
  from master
  where user_id = ? and is_active = 1`
}

const updatePassword = () => {
  return `update master
  set hash_password = ?, updated_on = now(), updated_by = ?
  where user_id = ? and is_active = 1 `
}

const getUserList = () => {
  return `SELECT ud.created_by as userId, ud.username, u.email as email, ud.full_name as fullName, ud.photo_url as photoUrl, ud.following_user_count as followingUserCount, ud.follower_user_count as followerUserCount, s.plan_name as planName, ud.is_celebrity as isCelebrity, ud.plan_valid_days as planValidDays, ud.free_trial as freeTrial, ud.total_coin_rewards as totalCoinRewards, ud.coin_rewards as coinRewards, (ud.total_coin_rewards - ud.coin_rewards) as redeemCoin FROM user_details ud
  join users u on u.user_id = ud.created_by
  join subscription s on s.plan_id = ud.plan_id
  where ud.is_active = 1
  order by ud.full_name asc limit ? offset ?;
  SELECT count(created_by) as totalCount  FROM user_details ud
  where ud.is_active = 1;`
}

const getDetailById = () => {
  return `SELECT ud.created_by as userId, ud.username, ud.full_name as fullName, ud.photo_url as photoUrl, ud.following_user_count as followingUserCount, ud.follower_user_count as followerUserCount, s.plan_name as planName, ud.is_celebrity as isCelebrity, ud.plan_valid_days as planValidDays, ud.free_trial as freeTrial, ud.total_coin_rewards as totalCoinRewards, ud.coin_rewards as coinRewards, (ud.total_coin_rewards - ud.coin_rewards) as redeemCoin FROM user_details ud
  join subscription s on s.plan_id = ud.plan_id
  where ud.is_active = 1 and ud.created_by = ?;`
}

const getCelebrityUserList = () => {
  return `SELECT ud.created_by as userId, ud.username, ud.full_name as fullName, ud.photo_url as photoUrl, s.plan_name as planName, ud.is_celebrity as isCelebrity, ud.status_date as statusDate,
  ud.user_status as userStatus
  FROM user_details ud
  join subscription s on s.plan_id = ud.plan_id
  where ud.user_status is not null and ud.user_status in (?) and ud.is_active = 1
  order by ud.updated_by desc limit ? offset ?;
  SELECT count(created_by) as totalCount
  FROM user_details ud
  where ud.user_status is not null and ud.user_status in (?) and ud.is_active = 1;`
}

const checkUserCelebrity = () => {
  return `SELECT ud.created_by as userId, ud.user_status as userStatus
  FROM user_details ud
  where created_by = ? and is_active = true;`
}

const updateCelebrityStatus = () => {
  return `update user_details
  set user_status =?, updated_on = now(), updated_by = ?, status_date = now(), is_celebrity = ?
  where created_by = ? and is_active = true;`
}

const getLanguageList = () => {
  return `select language_id as languageId, language_name as languageName,language_code as languageCode, created_on as createdOn
  from language
  where is_active = 1`
}

const getLanguageById = () => {
  return `select language_id as languageId, language_name as languageName,language_code as languageCode, created_on as createdOn
  from language
  where is_active = 1 and language_id = ?`
}

const checkLanguage = () => {
  return `select language_id as languageId, language_name as languageName,language_code as languageCode 
  from language
  where is_active = 1 and language_name = ? and language_code=?`
}

const insertLanguage = () => {
  return `
  insert into language (language_id, language_name, language_code , created_on, created_by, is_active) values
  (?,?,?,now(),?, true) `
}

const updateLanguage = () => {
  return `update language
  set language_name = ?, language_code = ?, updated_on = now(), updated_by= ?
  where language_id = ? `
}

const deleteLangauge = () => {
  return `update language
  set is_active = ?,updated_on = now(), updated_by= ?
  where language_id = ? `
}

const updateApplePay = () => {
  return `update admin_setting
  set value = ?,updated_on = now(), updated_by= ?
  where setting_name = ? `
}

const getSetting = () => {
  return `SELECT CONCAT('{', GROUP_CONCAT(CONCAT('"', setting_name, '": "', value, '"') SEPARATOR ', '), '}') AS result
  FROM admin_setting as2 ;`
}

module.exports = {
  getCategorywithPostAndFollower,
  getPostFollowerCount,
  getCategory,
  addCategory,
  checkCategory,
  updateCategory,
  updateFollowCount,
  getCategoryByCategoryId,
  checkCategoryDetails,
  deleteCategory,
  checkPlan,
  getAdminDetails,
  insertPlan,
  getPlanList,
  checkPlanDetail,
  updateSubcription,
  deletePlan,
  getAdminDetailsById,
  updatePassword,
  getUserList,
  getCelebrityUserList,
  updateCelebrityStatus,
  checkUserCelebrity,
  getDetailById,
  getLanguageList,
  getLanguageById,
  checkLanguage,
  insertLanguage,
  updateLanguage,
  deleteLangauge,
  updateApplePay,
  getSetting
}
