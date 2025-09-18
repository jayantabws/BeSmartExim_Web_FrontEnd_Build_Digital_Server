import { SUBSCRIPTION_COUNT_UPDATE, DOWNLOAD_ARRAY_UPDATE, COUNTRY_LIST, DATA_ACCESS_DATE, DOWNLOAD_COUNT_SUBUSER, UPLINE_ID, USER_LOGOUT, MAX_DOWNLOAD, SET_SEARCH_QUERY } from "../actions/actionTypes";

const initialState = {

    download_count: null,
    dataAccess_count: null,
    subscriptionId: null,
    totalWorkspace: null,
    subUserCount: null,
    queryPerDay: null,
    downloadArray: [],
    countryList: [],
    dataAccessInMonth: null,
    download_count_subUser: null,
    dataAccessUpto: null,
    uplineId: null,
    maxDownload: null,
    searchQuery: null

}

const updateSubscription = (state = initialState, action) => {

    switch (action.type) {
        case SUBSCRIPTION_COUNT_UPDATE: return {
            ...state,
            download_count: action.payload.download_count,
            subscriptionId: action.payload.subscriptionId,
            dataAccess_count: action.payload.dataAccess_count,
            totalWorkspace: action.payload.totalWorkspace,
            subUserCount: action.payload.subUserCount,
            queryPerDay: action.payload.queryPerDay,
        }

        case DOWNLOAD_ARRAY_UPDATE: return {
            ...state,
            downloadArray: action.payload.downloadArray,
        }

        case COUNTRY_LIST: return {
            ...state,
            countryList: action.payload.countryList,
        }

        case DATA_ACCESS_DATE: return {
            ...state,
            dataAccessInMonth: action.payload.dataAccessInMonth,
            dataAccessUpto: action.payload.dataAccessUpto,
        }

        case DOWNLOAD_COUNT_SUBUSER: return {
            ...state,
            download_count_subUser: action.payload.download_count_subUser,
        }

        case UPLINE_ID: return {
            ...state,
            uplineId: action.payload.uplineId,
        }

        case USER_LOGOUT: return {
            ...state,
            download_count: null,
            dataAccess_count: null,
            subscriptionId: null,
            totalWorkspace: null,
            subUserCount: null,
            queryPerDay: null,
            downloadArray: [],
            countryList: [],
            dataAccessInMonth: null,
            download_count_subUser: null,
            dataAccessUpto: null,
            uplineId: null
        }

        case MAX_DOWNLOAD: return {
            ...state,
            maxDownload: action.payload.maxDownload,
        }

        case SET_SEARCH_QUERY: return {
            ...state,
            searchQuery: action.payload,
        }
        default: return state;
    }
}


export default updateSubscription;