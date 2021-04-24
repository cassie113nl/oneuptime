// fetch performane tracker metrics - TIME
export const FETCH_TIME_METRICS_REQUEST = 'FETCH_TIME_METRICS_REQUEST';
export const FETCH_TIME_METRICS_SUCCESS = 'FETCH_TIME_METRICS_SUCCESS';
export const FETCH_TIME_METRICS_FAILURE = 'FETCH_TIME_METRICS_FAILURE';

// fetch performance tracker metrics - THROUGHPUT
export const FETCH_THROUGHPUT_METRICS_REQUEST =
    'FETCH_THROUGHPUT_METRICS_REQUEST';
export const FETCH_THROUGHPUT_METRICS_SUCCESS =
    'FETCH_THROUGHPUT_METRICS_SUCCESS';
export const FETCH_THROUGHPUT_METRICS_FAILURE =
    'FETCH_THROUGHPUT_METRICS_FAILURE';

// handle setting startDate/endDate - (TIME || THROUGHPUT)
export const SET_TIME_STARTDATE = 'SET_TIME_STARTDATE';
export const SET_TIME_ENDDATE = 'SET_TIME_ENDDATE';
export const SET_THROUGHPUT_STARTDATE = 'SET_THROUGHPUT_STARTDATE';
export const SET_THROUGHPUT_ENDDATE = 'SET_THROUGHPUT_ENDDATE';

// update metrics from realtime update
export const UPDATE_TIME_METRICS = 'UPDATE_TIME_METRICS';
export const UPDATE_THROUGHPUT_METRICS = 'UPDATE_THROUGHPUT_METRICS';

// fetch all performance tracker according to type (incoming/outgoing)
export const FETCH_INCOMING_METRICS_REQUEST = 'FETCH_INCOMING_METRICS_REQUEST';
export const FETCH_INCOMING_METRICS_SUCCESS = 'FETCH_INCOMING_METRICS_SUCCESS';
export const FETCH_INCOMING_METRICS_FAILURE = 'FETCH_INCOMING_METRICS_FAILURE';

export const FETCH_OUTGOING_METRICS_REQUEST = 'FETCH_OUTGOING_METRICS_REQUEST';
export const FETCH_OUTGOING_METRICS_SUCCESS = 'FETCH_OUTGOING_METRICS_SUCCESS';
export const FETCH_OUTGOING_METRICS_FAILURE = 'FETCH_OUTGOING_METRICS_FAILURE';

export const SET_INCOMING_STARTDATE = 'SET_INCOMING_STARTDATE';
export const SET_INCOMING_ENDDATE = 'SET_INCOMING_ENDDATE';
export const SET_OUTGOING_STARTDATE = 'SET_OUTGOING_STARTDATE';
export const SET_OUTGOING_ENDDATE = 'SET_OUTGOING_ENDDATE';

// delete a particular performance metrics (incoming/outgoing)
export const DELETE_INCOMING_METRICS_REQUEST =
    'DELETE_INCOMING_METRICS_REQUEST';
export const DELETE_INCOMING_METRICS_SUCCESS =
    'DELETE_INCOMING_METRICS_SUCCESS';
export const DELETE_INCOMING_METRICS_FAILURE =
    'DELETE_INCOMING_METRICS_FAILURE';
export const RESET_INCOMING_DELETE = 'RESET_INCOMING_DELETE';

export const DELETE_OUTGOING_METRICS_REQUEST =
    'DELETE_OUTGOING_METRICS_REQUEST';
export const DELETE_OUTGOING_METRICS_SUCCESS =
    'DELETE_OUTGOING_METRICS_SUCCESS';
export const DELETE_OUTGOING_METRICS_FAILURE =
    'DELETE_OUTGOING_METRICS_FAILURE';
export const RESET_OUTGOING_DELETE = 'RESET_OUTGOING_DELETE';
