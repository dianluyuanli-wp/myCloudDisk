import { netModel, writeCookie, parseCookie, getYearMonthDate } from 'xiaohuli-package';

export const apiMap = {
    TEST: 'test'
}

const localHost = 'http://localhost:4000/api/';
const host = localHost;

export const post = async function(apiName: string, props: object) {
    return netModel.post(host + apiName, props);
}