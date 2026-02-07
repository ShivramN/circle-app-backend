const getListOfPlan = () => {
  return `  
  select plan_id as planId, plan_name as planName, view_voice as viewVoice, add_voice as addVoice, view_news as viewNews, view_event as viewEvent, add_news as addNews,
  add_event as addEvent, view_achievement as viewAchievement, spend_achievement as spendAchievement, apply_celebrity as applyCelebrity, plan_title as planTitle, plan_discount_price as planDiscountPrice, plan_price as planPrice, plan_icon as planIcon, plan_days_details as planDaysDetails, plan_description as planDescription, ROUND(plan_discount_price*100/plan_price) as percentage, plan_total_days as planTotalDays
  from subscription
  where plan_id != ? and is_active=1
  order BY plan_price ASC; 
  `
}

const getPlanListById = (isActive) => {
  const value = isActive ? 'and is_active=1;' : ';'
  return `
  select plan_id as planId, plan_name as planName, view_voice as viewVoice, add_voice as addVoice, view_news as viewNews, view_event as viewEvent, add_news as addNews,
  add_event as addEvent, view_achievement as viewAchievement, spend_achievement as spendAchievement, apply_celebrity as applyCelebrity, plan_total_days as planTotalDays, plan_discount_price as planDiscountPrice
  from subscription
  where plan_id = ? ${value}
  `
}

const insertTransaction = () => {
  return `insert into transaction_history (transaction_id, plan_id, created_by, created_on, is_active)
   values (?, ?, ?, now(), true)`
}

module.exports = {
  getListOfPlan,
  getPlanListById,
  insertTransaction
}
