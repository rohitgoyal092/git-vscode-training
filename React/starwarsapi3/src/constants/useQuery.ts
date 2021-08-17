export interface statusType {
  __this_is_status_type: "status_type";
}
function makeStatusType(value: string): statusType {
  return value as unknown as statusType;
}
export const NETWORK_STATUS = {
  IDLE: makeStatusType("idle"),
  FETCHING: makeStatusType("fetching"),
  FETCHED: makeStatusType("fetched"),
  ERROR: makeStatusType("error"),
};

export const ERROR_TYPES = {
  URL_ERROR: "url error",
  DATA_ERROR: "data error",
  NETWORK_ERROR: "network error",
};

export const RETRY_COUNT: number = 10;
export const TIMEOUT_LIMIT: number = 10000;
