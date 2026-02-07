const getUserDataByEmailOrUsername = () => {
  return `select u.user_id as userId, email, salt_key as saltKey, hash_password as hashPassword, signup_type as signupType, JSON_OBJECT( 'userId', u.user_id,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'categoryId' , category_id, 'planId', plan_id, 'followingUserCount', following_user_count, 'followerUserCount', follower_user_count, 'description', description, 'isCelebrity', is_celebrity) as user
  from users u
  join user_details ud on ud.created_by = u.user_id and ud.is_active = true
  where (ud.username = ? or lower(u.email) = lower(?)) and u.is_active = true and u.is_verified = true and u.is_profile_completed = true`
}

const getUserDataByEmail = (forgetKey) => {
  let value = ''
  if (forgetKey) value = 'and u.is_verified = true and u.is_profile_completed = true'
  return `select u.user_id as userId, email, salt_key as saltKey, hash_password as hashPassword, signup_type as signupType, u.is_verified as isVerified, u.is_profile_completed as isProfileCompleted, JSON_OBJECT( 'userId', u.user_id,'username', ud.username, 'fullName', ud.full_name, 'photoUrl', ud.photo_url, 'categoryId' , category_id, 'planId', plan_id, 'followingUserCount', following_user_count, 'followerUserCount', follower_user_count, 'description', description, 'isCelebrity', is_celebrity) as user
  from users u
  left join user_details ud on ud.created_by = u.user_id
  where lower(u.email) = lower(?) ${value};`
}

const getUserDetailsByUserId = (changePwd) => {
  let value = ''
  if (changePwd) value = 'and u.is_verified = true and u.is_profile_completed = true'
  return `select u.user_id as userId, email, salt_key as saltKey, hash_password as hashPassword, signup_type as signupType
  from users u
  where u.user_id = ?  ${value} and u.is_active = true`
}
const createUser = () => {
  return `insert into users ( email, user_id,created_by,created_on, signup_type, is_active, social_token, is_verified) values 
  (?,?,?, now(), ?, 1,?,?)`
}

const updateSocialToken = () => {
  return `update users 
  set social_token = ?, updated_on = now(), updated_by = ?, is_active = ? 
  where user_id = ?;
  update user_details 
  set is_active = ?, updated_on = now(), updated_by = ?, following_user_count = 0, follower_user_count = 0
  where created_by = ?;
  update news 
  set is_active = ?, updated_on = now(), updated_by = ?
  where created_by = ?;
  update voices 
  set is_active = ?, updated_on = now(), updated_by = ?
  where created_by = ?;
  update event 
  set is_active = ?, updated_on = now(), updated_by = ?
  where created_by = ?;`
}

const getUserDetailsByUsername = () => {
  return `select username from user_details 
  where username = ? and is_active = true`
}

const setUserdetails = () => {
  return `insert into user_details (user_detail_id, username, full_name, plan_id, gender,dob, created_on, created_by, is_active) values
  (?,?,?,?,?,?,now(),?, true);
  insert into user_setting (setting_id, share_news, share_voice, share_event, event_alert,tag_voice, event_invited,user_follow, created_by, created_on) values
  (?,1,1,1,0,0,0,0,?, now());
  `
}

const setUserPwd = (hashPassword, passwordSalt) => {
  const value = hashPassword ? `hash_password ='${hashPassword}' , salt_key='${passwordSalt}',` : ''
  return `update users 
  set ${value} updated_on = now(), updated_by = ?, is_profile_completed = 1
  where user_id = ? and is_active = true`
}

const updatePhotoUrl = () => {
  return `update user_details 
  set photo_url =? , updated_on = now(), updated_by = ? 
  where created_by = ? and is_active = true`
}

const updateotpVerifed = () => {
  return `update users 
  set is_verified = true, is_profile_completed = ?, updated_on = now(), updated_by = ?
  where user_id = ? and is_active = true;
  DELETE FROM users_otp 
  WHERE created_by = ?;`
}

const updatePwd = () => {
  return `update users
  set hash_password = ?, updated_on = now(), updated_by = ?
  where user_id = ? and is_verified = true and is_profile_completed = true and is_active = true;`
}

const userDetails = () => {
  return `select ud.username, ud.full_name as fullName, ud.photo_url as photoUrl, ud.category_id as categoryId, ud.plan_id as planId, ud.following_user_count as followingUserCount, ud.follower_user_count as followerUserCount, ud.description, ud.user_status as userStatus, ud.free_trial as freeTrial, ud.created_on as createdOn, ud.plan_valid_days as planValidDays, ud.event_count as eventCount, ud.voice_count as voiceCount, ud.news_count as newsCount, CONCAT(ud.phone_code,ud.phone_number) as phoneNumer, ud.coin_rewards as coinRewards, u.email
  from user_details ud
  left join users u on u.user_id = ud.created_by
  where ud.created_by = ? and ud.is_active = true;`
}

const updatePlan = () => {
  return `update user_details 
  set plan_id =? , updated_on = now(), created_on = now(), updated_by = ?, plan_valid_days = ?
  where created_by = ? and is_active = true;`
}

const addOtpCode = () => {
  return `insert into users_otp (user_otp_id, otp_code, otp_expiry, created_on, created_by) values
  (?,?,?,now(),?)`
}

const getOtpCode = () => {
  return `select uo.user_otp_id as userOtpId, uo.created_by as userId, u.is_profile_completed as isProfileCompleted
  from users_otp uo
  left join users u on u.user_id = ? and u.is_active = true
  where uo.created_by = ? and uo.otp_code = ? and otp_expiry > NOW(); `
}

const getUserDetailsByEmail = () => {
  return `select user_id as userId
  from users
  where email = lower(?) and is_active=1`
}

const insertUpdateCategory = () => {
  return `
  update user_details 
  set category_id =JSON_ARRAY(?), updated_on = now(), updated_by = ? 
  where created_by = ? and is_active = true;
  `
}

const getUserdetails = (categoryId) => {
  let value = ''
  const categoryLen = categoryId.length
  let categorySearch = ''
  if (categoryLen > 0) {
    value = 'and ('
    categorySearch = categoryId.map((value, index) => {
      let result = ''
      if (categoryLen > (index + 1)) {
        result = 'or'
      } else {
        result = ')'
      }
      return `JSON_SEARCH(category_id, 'one', '${value}') IS NOT NULL ${result}`
    }).join(' ')
  }
  return `select ud.username, ud.created_by as followUserId, ud.photo_url as photoUrl, ud.full_name as fullName, ud.description as description, ud.user_status as userStatus, if(ufm.user_follow_mapping_id is null, false, true) as isFollow, ud.is_celebrity as isCelebrity,
  s.plan_name as planName from user_details ud 
  left join user_follow_mapping ufm on ud.created_by = ufm.followed_id  and ufm.created_by = ?
  join subscription s on s.plan_id = ud.plan_id 
  where ud.created_by != ? ${value} ${categorySearch} limit 25 offset ?`
}

const getUserVerified = () => {
  return `select u.user_id as userId, ud.user_detail_id as userDetailId, u.signup_type as signupType
  from users u
  left join user_details ud on ud.created_by = u.user_id and ud.is_active = true
  where u.user_id = ? and u.is_active = true and u.is_verified = true`
}
const deleteOtp = () => {
  return `DELETE FROM users_otp 
    WHERE created_by = ?;`
}

const updateCount = (value) => {
  return `UPDATE user_details 
    set ${value}
    WHERE created_by = ?;`
}

const detectCoin = () => {
  return `update user_details
      set coin_rewards = coin_rewards - ?
      where created_by = ?`
}

const filterUsername = () => {
  return `select ud.created_by as userId, ud.full_name as fullName,ud.photo_url as photoUrl, ud.username, ud.is_celebrity as isCelebrity,s.plan_name as planName
   from user_details ud
   join subscription s on s.plan_id = ud.plan_id 
   where ud.username like ? and ud.full_name like ? and ud.is_active = 1 and ud.created_by != ?
   limit 25;`
}

const checkUserProfile = () => {
  return `select  ud.created_by as userId, ud.full_name as fullName, ud.username,ud.following_user_count as followingUserCount,ud.follower_user_count as followerUserCount, ud.event_count as eventCount, ud.voice_count as voiceCount, ud.news_count as newsCount, photo_url as photoUrl,
  if(ufm3.user_follow_mapping_id is not null, true, false) as isFollow,
  s.plan_name as planName, ud.address, ud.is_celebrity as isCelebrity, ud.short_bio as shortBio,ud.occupation , (SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
      'username', ud2.username,
      'userId', ud2.created_by,
      'fullName', ud2.full_name,
      'photoUrl', ud2.photo_url,
      'isCelebrity', ud2.is_celebrity
    )
  )
  FROM user_details ud2
  join user_follow_mapping ufm on ufm.created_by = ?
  join user_follow_mapping ufm2 on ufm2.created_by = ?
  where ufm.followed_id = ufm2.followed_id and ufm.followed_id = ud2.created_by 
  LIMIT 5) as followedList
  from user_details ud
  join subscription s on s.plan_id = ud.plan_id 
  left join user_follow_mapping ufm3 on ufm3.created_by = ? and ufm3.followed_id = ud.created_by 
    where ud.created_by = ? `
}

const getFollowerList = (searchUser) => {
  let value = ''
  if (searchUser) {
    value = `and (ud.full_name like '%${searchUser}%' or ud.username like '%${searchUser}%')`
  }
  return `select ud.created_by as userId, ud.full_name as fullName, ud.username, ud.photo_url as photoUrl,
  s.plan_name as planName, ud.is_celebrity as isCelebrity,
  if(ufm2.user_follow_mapping_id is not null, true, false) as isFollow
  from user_details ud
  join subscription s on s.plan_id = ud.plan_id 
  join user_follow_mapping ufm on ufm.followed_id = ?
  left join user_follow_mapping ufm2 on ufm2.created_by = ? and ufm2.followed_id = ufm.created_by 
  where ud.created_by = ufm.created_by ${value}
  group by ud.created_on
  order by full_name Desc limit ? offset ?; `
}

const getFollowingList = (searchUser) => {
  let value = ''
  if (searchUser) {
    value = `and (ud.full_name like '%${searchUser}%' or ud.username like '%${searchUser}%')`
  }
  return `select ud.created_by as userId, ud.full_name as fullName, ud.username, ud.photo_url as photoUrl,
  s.plan_name as planName, ud.is_celebrity as isCelebrity,
  if(ufm2.user_follow_mapping_id is not null, true, false) as isFollow
  from user_details ud
  join subscription s on s.plan_id = ud.plan_id 
  join user_follow_mapping ufm on ufm.created_by = ?
  left join user_follow_mapping ufm2 on ufm2.created_by = ? and ufm2.followed_id = ufm.followed_id 
  where ud.created_by = ufm.followed_id ${value}
  group by ud.created_on
  order by full_name Desc limit ? offset ?; `
}

const userDetailsWithCategory = () => {
  return `select ud.username, ud.full_name as fullName, ud.photo_url as photoUrl, ud.category_id as categoryId, ud.plan_id as planId, ud.following_user_count as followingUserCount,ud.dob, ud.gender, ud.address,ud.occupation, ud.created_by as userId, ud.short_bio as shortBio, ud.phone_code as phoneCode, ud.phone_number as phoneNumber, ud.follower_user_count as followerUserCount, ud.description, ud.user_status as userStatus, ud.free_trial as freeTrial, ud.created_on as createdOn, ud.plan_valid_days as planValidDays, ud.event_count as eventCount, ud.voice_count as voiceCount, ud.news_count as newsCount,ud.coin_rewards as coinRewards, ud.total_coin_rewards as totalCoinRewards, u.email as emailId, ud.is_celebrity as isCelebrity, ase.value as appleIAPStatus
  from user_details ud 
  join users u on ud.created_by = u.user_id and u.is_active = 1
  join admin_setting ase on ase.setting_id="6fe3e522-5ee6-4f06-92d9-5aa79b19f123" 
  where ud.created_by = ? and ud.is_active = true;
  SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage 
  FROM category
  where is_active = 1`
}

const updateUserProfile = () => {
  return ` update user_details 
  set full_name =?, dob = ?, gender=?,short_bio=?, occupation=?,  updated_on = now(), updated_by = ? 
  where created_by = ? and is_active = true;
  `
}
const updateUserInfo = () => {
  return ` update user_details 
  set phone_code =?, phone_number = ?, address=?, updated_on = now(), updated_by = ? 
  where created_by = ? and is_active = true;
  `
}

const requestCelebrity = () => {
  return ` update user_details 
  set user_status =?, updated_on = now(), updated_by = ? , status_date = now()
  where created_by = ? and is_active = true;
  `
}
const checkTransaction = () => {
  return `select ud.plan_valid_days as planValidDays, ud.created_on as buyedDate, th.plan_id as planId,th.payment_gateway_type as paymentGatewayType, JSON_OBJECT( 'cardBrand', th.card_brand,'cardLast', th.card_last4, 'cardExpMonth', th.card_exp_month, 'cardExpYear', th.card_exp_year, 'cardFunding' , th.card_funding) as cardDetails, google_upi_id as googleUpiId, apple_id as appleId, amount, s.plan_name as planName, s.plan_days_details as planDaysDetails
  from transaction_history th
  join user_details ud on ud.created_by = th.created_by
  join subscription s on s.plan_id = th.plan_id 
  where th.created_by = ? and th.payment_status = ? and ud.is_active = 1
  order by th.updated_on desc limit 1`
}

const updateToken = () => {
  return `update users 
  set fcm_token = ?, updated_on = now(), updated_by = ? 
  where user_id = ?`
}
const subcriptionEmail = () => {
  return `select ud.full_name as fullName, u.email as emailId, s.plan_name as planName, s.plan_title as planTitle, s.plan_discount_price as planDiscountPrice from user_details ud
  left join users u on u.user_id = ud.created_by and u.is_active = 1
  left join subscription s on s.plan_id = ?
  where ud.created_by = ?`
}

const updateUser = () => {
  return `update users 
  set is_active = ?, updated_on = now(), updated_by = ? 
  where user_id = ?;
  update user_details 
  set is_active = ?, updated_on = now(), updated_by = ?, following_user_count = 0, follower_user_count = 0
  where created_by = ?;
  update news 
  set is_active = ?, updated_on = now(), updated_by = ?
  where created_by = ?;
  update voices 
  set is_active = ?, updated_on = now(), updated_by = ?
  where created_by = ?;
  update event 
  set is_active = ?, updated_on = now(), updated_by = ?
  where created_by = ?;
  `
}
module.exports = {
  getUserDataByEmailOrUsername,
  createUser,
  getUserDetailsByUsername,
  setUserdetails,
  setUserPwd,
  updatePhotoUrl,
  getUserDetailsByUserId,
  getUserDataByEmail,
  updateotpVerifed,
  updatePwd,
  userDetails,
  updatePlan,
  addOtpCode,
  getOtpCode,
  getUserDetailsByEmail,
  insertUpdateCategory,
  getUserdetails,
  getUserVerified,
  deleteOtp,
  updateCount,
  filterUsername,
  checkUserProfile,
  getFollowerList,
  getFollowingList,
  userDetailsWithCategory,
  updateUserProfile,
  updateUserInfo,
  requestCelebrity,
  checkTransaction,
  detectCoin,
  updateToken,
  updateSocialToken,
  subcriptionEmail,
  updateUser
}
