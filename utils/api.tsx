import { netModel, writeCookie, parseCookie, getYearMonthDate } from 'xiaohuli-package';
import { notification } from 'antd';
import { extend } from 'umi-request';

export const apiMap = {
    TEST: 'test',
    LOGIN: 'login',
    UPLOAD_FILE_SLICE: 'uploadFile',
    MERGE_SLICE: 'fileMergeReq',
    QUERY_LIST: 'queryFileList',
    DELETE_FILE: 'deleteFile'
}

const localHost = 'http://localhost:4000/api/';
export const host = localHost;

export const post = async function(apiName: string, props: object) {
    return netModel.post(host + apiName, props);
}

const wrapperedPureReq = extend({
    credentials: 'include', // 默认请求是否带上cookie
});

wrapperedPureReq.use(async (ctx, next) => {
    await next();
});
const errorHandler = (error: { response: Response }): Response => {
    const { response } = error;
    if (response && response.status) {
      const errorText = response.statusText;
      const { status, url } = response;
  
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    } else if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    return response;
  };
  
/**
 * 配置request请求时的默认参数
 */
const qulifiedRequest = extend({
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
});

qulifiedRequest.use(async (ctx, next) => {
    await next();
    const { res } = ctx;
    if (res?.response?.status === '401') {
        notification.error({
            message: `请求错误 鉴权失败`,
            description: '鉴权失败,请重新登陆',
        });
        setTimeout(() => window.location.href='/home.html', 2000,);
    }
});


//  带鉴权的接口
export const reqPost = (url: string, para: object) =>
    qulifiedRequest(localHost + url, {
        method: 'post',
        data: Object.assign({}, para, {
            token: localStorage.getItem('tk')
        }),
    }
);
//  纯接口
export const request = wrapperedPureReq;