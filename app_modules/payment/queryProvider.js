const insertTransaction = () => {
  return `insert IGNORE into transaction_history (transaction_id, plan_id, payment_transaction_id, amount,plan_days,plan_name,payment_status,payment_gateway_type, created_by, created_on, is_active)
   values (?,?,?,?,?,?,?,?,?, now(), true)`
}

const updateSuccessTransaction = () => {
  return `update transaction_history
  set payload_success = ?, payment_status =?, payment_type=?, card_brand=?, card_last4=?, card_exp_month=?,card_exp_year=?,card_funding=?, updated_by = ?, updated_on = now()
  where payment_transaction_id=?
  `
}

const getTransaction = () => {
  return `select th.plan_days as planDays, th.plan_id as planId, th.updated_on as transactionDate, ud.plan_valid_days as planValidDays, ud.created_on as createdOn
  from transaction_history th
  join user_details ud on ud.created_by = th.created_by and ud.is_active = 1
  where th.payment_transaction_id =? and th.created_by = ?`
}

const updateFailedTransaction = () => {
  return `update transaction_history
  set payload_failed = ?, payment_status =?, updated_by = ?, updated_on = now()
  where payment_transaction_id=?
  `
}

const applePayTransaction = () => {
  return `insert IGNORE into transaction_history (transaction_id, plan_id, payment_transaction_id, amount,plan_days,plan_name,payment_status,payment_gateway_type, created_by, created_on, is_active)
   values (?,?,?,?,?,?,?,?,?, now(), true)`
}

module.exports = {
  insertTransaction,
  updateSuccessTransaction,
  getTransaction,
  updateFailedTransaction,
  applePayTransaction
}
