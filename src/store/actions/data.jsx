import { SUBSCRIPTION_COUNT_UPDATE, DOWNLOAD_ARRAY_UPDATE, COUNTRY_LIST, DATA_ACCESS_DATE, DOWNLOAD_COUNT_SUBUSER, UPLINE_ID, USER_LOGOUT, MAX_DOWNLOAD, SET_SEARCH_QUERY } from "./actionTypes";


export const updateSubscriptionCount = (request) => {
    return dispatch => {
        dispatch({
            type: SUBSCRIPTION_COUNT_UPDATE,
            payload: {
                download_count: request.download_count,
                subscriptionId: request.subscriptionId,
                dataAccess_count: request.dataAccess_count,
                totalWorkspace: request.totalWorkspace,
                subUserCount: request.subUserCount,
                queryPerDay: request.queryPerDay,
            }
        });
    }
}

export const updateDownloadArrayCount = (request) => {
    return dispatch => {
        dispatch({
            type: DOWNLOAD_ARRAY_UPDATE,
            payload: {
                downloadArray: request.downloadArray,
            }
        });
    }
}

export const setCountryList = (request) => {
    return dispatch => {
        dispatch({
            type: COUNTRY_LIST,
            payload: {
                countryList: request.countryList,
            }
        });
    }
}

export const setDataAccessDate = (request) => {
    return dispatch => {
        dispatch({
            type: DATA_ACCESS_DATE,
            payload: {
                dataAccessInMonth: request.dataAccessInMonth,
                dataAccessUpto: request.dataAccessUpto,
            }
        });
    }
}

export const setDloadCountSubuser = (request) => {
    return dispatch => {
        dispatch({
            type: DOWNLOAD_COUNT_SUBUSER,
            payload: {
                download_count_subUser: request.download_count_subUser,
            }
        });
    }
}

export const setUplineId = (request) => {
    return dispatch => {
        dispatch({
            type: UPLINE_ID,
            payload: {
                uplineId: request.uplineId,
            }
        });
    }
}

export const logoutUser = (request) => {
    return dispatch => {
        dispatch({
            type: USER_LOGOUT
        });
    }
}

export const setMaxDownload = (request) => {
    return dispatch => {
        dispatch({
            type: MAX_DOWNLOAD,
            payload: {
                maxDownload: request.maxDownload,
            }
        });
    }
}

export const setSearchQuery = (request) => {
    return dispatch => {
        dispatch({
            type: SET_SEARCH_QUERY,
            payload: request
        });
    }
}
