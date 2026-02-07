const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')
const UserService = require('../../user/services/dbData')

class News {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  checkNewsByAll (newsDetails, userId) {
    __logger.info('dbData: checkNewsByAll(): ')
    const doesCheckNewsByAll = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkNewsByAll(), [newsDetails.newsTitle, newsDetails.newsDescription, JSON.stringify(newsDetails.newsUrl), userId, newsDetails.categoryId, JSON.stringify(newsDetails.newsBanner)])
      .then(result => {
        __logger.info('dbData: checkNewsByAll(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckNewsByAll.reject({ type: __constants.RESPONSE_MESSAGES.NEWS_EXISTS, err: __constants.RESPONSE_MESSAGES.NEWS_EXISTS.message })
        } else {
          doesCheckNewsByAll.resolve(false)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check news by all function: ', err)
        doesCheckNewsByAll.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckNewsByAll.promise
  }

  checkUserNewsById (newsId, userId) {
    __logger.info('dbData: checkUserNewsById(): ')
    const doesCheckUserNewsById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkUserNewsById(), [newsId, userId])
      .then(result => {
        __logger.info('dbData: checkUserNewsById(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckUserNewsById.resolve(result[0])
        } else {
          doesCheckUserNewsById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check user news by id function: ', err)
        doesCheckUserNewsById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUserNewsById.promise
  }

  updateNews (newsDetatils, userId) {
    __logger.info('dbData: updateNews(): ')
    const doesupdateNews = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateNews(), [newsDetatils.newsTitle, newsDetatils.newsDescription, JSON.stringify(newsDetatils.newsUrl), newsDetatils.categoryId, userId, JSON.stringify(newsDetatils.newsBanner), newsDetatils.newsId, userId])
      .then(result => {
        __logger.info('dbData: updateNews(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesupdateNews.resolve(userId)
        } else {
          doesupdateNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in update news by id function: ', err)
        doesupdateNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesupdateNews.promise
  }

  insertNews (newsDetatils, userId) {
    __logger.info('dbData: insertNews(): ')
    const doesInsertNews = q.defer()
    const newsId = this.uniqueId.uuid()
    const userService = new UserService()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertNews(), [newsId, newsDetatils.newsTitle, newsDetatils.newsDescription, JSON.stringify(newsDetatils.newsUrl), newsDetatils.categoryId, userId, JSON.stringify(newsDetatils.newsBanner), newsDetatils.categoryId])
      .then(result => {
        __logger.info('dbData: insertNews(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          userService.updateCount('news_count = news_count + 1', userId)
          doesInsertNews.resolve(newsId)
        } else {
          doesInsertNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert news function: ', err)
        doesInsertNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertNews.promise
  }

  // checkUsersNewsById (userId, limit, page) {
  //   const limitsixty = (60 * limit) / 100
  //   const limitFourty = (40 * limit) / 100
  //   const offset = limitsixty * (page - 1)
  //   const offset1 = limitFourty * (page - 1)
  //   let finalResult = []
  //   __logger.info('dbData: checkUsersNewsById(): ')
  //   const doesCheckUsersNewsById = q.defer()
  //   __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkUsersNewsById(), [userId, userId, limitsixty, offset, userId, userId, limitFourty, offset1])
  //     .then(result => {
  //       __logger.info('dbData: checkUsersNews(): then 1:', result[1].length, result[0].length)
  //       if (result && (result[0].length > 0) && (result[1].length > 0)) {
  //         finalResult = result[1].reduce((acc, cur, ind, arr) => {
  //           if (!result[0].some(itemB => itemB.newsId === cur.newsId)) result[0].push(cur)
  //           if (ind === (arr.length - 1)) acc = result[0]
  //           return acc
  //         }, [])
  //       }
  //       doesCheckUsersNewsById.resolve(finalResult)
  //     })
  //     .catch(err => {
  //       __logger.error('dbData: error in check user news by user id function: ', err)
  //       doesCheckUsersNewsById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
  //     })
  //   return doesCheckUsersNewsById.promise
  // }
  checkUsersNewsById (userId, limit, offset) {
    // let finalResult = []
    __logger.info('dbData: checkUsersNewsById(): ', limit, offset)
    const doesCheckUsersNewsById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkUsersNewsById(), [userId, userId, limit, offset])
      .then(result => {
        __logger.info('dbData: checkUsersNews(): then 1:', result.length)
        // if (result && (result[0].length > 0) && (result[1].length > 0)) {
        //   finalResult = result[1].reduce((acc, cur, ind, arr) => {
        //     if (!result[0].some(itemB => itemB.newsId === cur.newsId)) result[0].push(cur)
        //     if (ind === (arr.length - 1)) acc = result[0]
        //     return acc
        //   }, [])
        // }
        doesCheckUsersNewsById.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in check user news by user id function: ', err)
        doesCheckUsersNewsById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUsersNewsById.promise
  }

  checkFollowedNews (followerId, userId, limit, offset) {
    __logger.info('dbData: checkFollowedNews(): ')
    const doesCheckFollowedNews = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkFollowedNews(), [userId, followerId, userId, followerId, limit, offset, followerId])
      .then(result => {
        __logger.info('dbData: checkFollowedNews(): then 1:', result[1][0].totalNews)
        doesCheckFollowedNews.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in check followed news function: ', err)
        doesCheckFollowedNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckFollowedNews.promise
  }

  checkNewsById (newsId, userId) {
    __logger.info('dbData: checkNewsById(): ')
    const doesCheckNewsById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkNewsById(), [userId, userId, newsId])
      .then(result => {
        __logger.info('dbData: checkNewsById(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckNewsById.resolve(result[0])
        } else {
          doesCheckNewsById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check news by id function: ', err)
        doesCheckNewsById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckNewsById.promise
  }

  checkCategoryWise (categoryIdList, userId) {
    __logger.info('dbData: checkCategoryWise(): ')
    const doesCheckCategoryWise = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getCategoryWise(), [userId])
      .then(result => {
        __logger.info('dbData: checkCategoryWise(): then 1:', result)
        if (result && result[0]?.categoryId !== null) {
          doesCheckCategoryWise.resolve(result[0].categoryId.split(','))
        } else {
          doesCheckCategoryWise.resolve(categoryIdList)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check news by id function: ', err)
        doesCheckCategoryWise.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckCategoryWise.promise
  }

  async checkSuggestNews (categoryIdList, userId, limit, offset, categoryId = null) {
    __logger.info('dbData: checkSuggestNews(): ', categoryIdList, userId)
    const doesCheckSuggestNews = q.defer()
    // const value = categoryId ?? await this.checkCategoryWise(categoryIdList, userId)
    const value = categoryId ?? categoryIdList
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkSuggestNews(), [userId, userId, value, limit, offset])
      .then(result => {
        if (result) {
          __logger.info('dbData: checkSuggestNews(): then 1:', result.length)
          doesCheckSuggestNews.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check news by id function: ', err)
        doesCheckSuggestNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckSuggestNews.promise
  }

  deleteNewsByID (newsId, userId, categoryId) {
    __logger.info('dbData: deleteNewsByID(): ')
    const doesDeleteNewsByID = q.defer()
    const userService = new UserService()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deleteNewsByID(), [false, newsId, userId, categoryId])
      .then(result => {
        __logger.info('dbData: deleteNewsByID(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          userService.updateCount('news_count = news_count - 1', userId)
          doesDeleteNewsByID.resolve(result[0])
        } else {
          doesDeleteNewsByID.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_NEWS.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in delete news by news id function: ', err)
        doesDeleteNewsByID.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDeleteNewsByID.promise
  }

  storeNews (newsId, userId) {
    __logger.info('dbData: storeNews(): ')
    const doesStoreNews = q.defer()

    const saveNewsId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.storeNews(), [saveNewsId, newsId, userId])
      .then(result => {
        __logger.info('dbData: storeNews(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesStoreNews.resolve(result[0])
        } else {
          doesStoreNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error insert news store function: ', err)
        doesStoreNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesStoreNews.promise
  }

  checkNewsSaved (newsId, userId) {
    __logger.info('dbData: checkNewsSaved(): ')
    const doesCheckNewsSaved = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkNewsSaved(), [newsId, userId])
      .then(result => {
        __logger.info('dbData: checkNewsSaved(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckNewsSaved.reject({ type: __constants.RESPONSE_MESSAGES.ALREADY_SAVED_NEWS, err: __constants.RESPONSE_MESSAGES.ALREADY_SAVED_NEWS.message })
        } else {
          doesCheckNewsSaved.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error check news store function: ', err)
        doesCheckNewsSaved.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckNewsSaved.promise
  }

  checkNewsShared (newsId, sharedUserId, userId) {
    __logger.info('dbData: checkNewsShared(): ')
    const doesCheckNewsShared = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkNewsShared(), [newsId, userId, sharedUserId])
      .then(result => {
        __logger.info('dbData: checkNewsShared(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckNewsShared.reject({ type: __constants.RESPONSE_MESSAGES.ALREADY_SHARED_NEWS, err: __constants.RESPONSE_MESSAGES.ALREADY_SHARED_NEWS.message })
        } else {
          doesCheckNewsShared.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error check news ahared function: ', err)
        doesCheckNewsShared.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckNewsShared.promise
  }

  insertSharedNews (newsId, sharedUserId, userId) {
    __logger.info('dbData: insertSharedNews(): ')
    const doesInsertSharedNews = q.defer()
    const insertArr = sharedUserId
      .filter(data => data !== userId)
      .map(data => {
        const sharedNewsId = this.uniqueId.uuid()
        return [sharedNewsId, data, newsId, new Date(), userId]
      })
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertSharedNews(), [insertArr])
      .then(result => {
        __logger.info('dbData: insertSharedNews(): then 1:', result)
        doesInsertSharedNews.resolve(result[0])
      })
      .catch(err => {
        __logger.error('dbData: error insert share news function: ', err)
        doesInsertSharedNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertSharedNews.promise
  }

  createdNewsList (userId, limit, offset) {
    __logger.info('dbData: createdNewsList(): ', userId)
    const doesCreatedNewsList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.createdNewsList(), [userId, limit, offset, userId])
      .then(result => {
        __logger.info('dbData: createdNewsList(): then 1:', result[1])
        doesCreatedNewsList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error created News List function: ', err)
        doesCreatedNewsList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCreatedNewsList.promise
  }

  savedNewsList (userId, limit, offset) {
    __logger.info('dbData: savedNewsList(): ', userId)
    const doesSavedNewsList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.savedNewsList(), [userId, limit, offset, userId])
      .then(result => {
        __logger.info('dbData: savedNewsList(): then 1:', result[1])
        doesSavedNewsList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error shared News List function: ', err)
        doesSavedNewsList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesSavedNewsList.promise
  }

  receivedNewsList (userId, limit, offset) {
    __logger.info('dbData: receivedNewsList(): ', userId)
    const doesReceivedNewsList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.receivedNewsList(), [userId, limit, offset, userId])
      .then(result => {
        __logger.info('dbData: receivedNewsList(): then 1:', result[1])
        doesReceivedNewsList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error received News List function: ', err)
        doesReceivedNewsList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesReceivedNewsList.promise
  }

  sharedNews (newsId, userId) {
    __logger.info('dbData: sharedNews(): ')
    const doesSharedNews = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.sharedNews(), [newsId, userId])
      .then(result => {
        __logger.info('dbData: sharedNews(): then 1:', result)
        doesSharedNews.resolve(result[0])
      })
      .catch(err => {
        __logger.error('dbData: error insert share news function: ', err)
        doesSharedNews.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesSharedNews.promise
  }

  sharedOperation (newsId, sharedUserId, userId) {
    __logger.info('dbData: sharedOperation(): ')
    const doesSharedOperation = q.defer()
    this.insertSharedNews(newsId, sharedUserId, userId)
    this.sharedNews(newsId, userId)
    doesSharedOperation.resolve(true)
    return doesSharedOperation.promise
  }

  getPointList (userId, sortType, limit, offset) {
    __logger.info('dbData: news :: getPointList(): ', userId)
    const filterValue = {
      [__constants.SORT_TYPE[0]]: 'n.created_on desc',
      [__constants.SORT_TYPE[1]]: 'n.news_point ASC',
      [__constants.SORT_TYPE[2]]: 'n.news_point desc'
    }
    const doesGetPointList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getNewsPointList(filterValue[sortType]), [userId, limit, offset])
      .then(result => {
        __logger.info('dbData: get news PointList(): then 1:', result[1])
        doesGetPointList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error get news point list function: ', err)
        doesGetPointList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetPointList.promise
  }

  viewList (newsDetails, userId) {
    __logger.info('dbData: news :: ViewList(): ', userId, newsDetails)
    const filterValue = newsDetails.map(data => {
      return [data.newsId, data.newsOwnerId, data.newsCategoryId, data.timeInSec, userId, 1]
    })
    const doesViewList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.viewList(), [filterValue])
      .then(result => {
        __logger.info('dbData: get news viewList(): then 1:', result)
        doesViewList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error get news View list function: ', err)
        doesViewList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesViewList.promise
  }
}

module.exports = News
