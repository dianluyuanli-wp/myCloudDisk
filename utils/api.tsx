import { netModel, writeCookie, parseCookie, getYearMonthDate } from 'xiaohuli-package';
import { extend } from 'umi-request';

export const apiMap = {
    TEST: 'test',
    UPLOAD_FILE_SLICE: 'uploadFile',
    MERGE_SLICE: 'fileMergeReq'
}

const localHost = 'http://localhost:4000/api/';
export const host = localHost;

export const post = async function(apiName: string, props: object) {
    return netModel.post(host + apiName, props);
}

const wrapperedReq = extend({
    credentials: 'include', // 默认请求是否带上cookie
});
  
wrapperedReq.use(async (ctx, next) => {
    await next();
});
  
export const request = wrapperedReq;