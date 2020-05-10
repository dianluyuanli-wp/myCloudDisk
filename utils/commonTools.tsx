import { useReducer } from 'react';

export interface PageObj {
    total: number;
    current: number;
}
  
export interface PageSet {
    total?: number;
    current?: number;
}

//  控制页码
export function usePageManager(): [PageObj, React.Dispatch<PageSet>] {
  function pageReducer(state: PageObj, action: PageSet) {
    return { ...state, ...action };
  }
  const res = useReducer(pageReducer, {
    current: 1,
    total: 1,
  } as PageObj);
  return [res[0], res[1]];
}

export const SINGLE_PAGE_SIZE = 15;

export function getQueryString(pageNum: number) {
    const queryJsonString = JSON.stringify(
      Object.assign(
        {},
        // queryObj.switchOn
        //   ? {
        //       date: `_.gt('${queryObj.period?.[0]?.format('YYYY-MM-DD')}').and(_.lt('${queryObj.period?.[1]?.format('YYYY-MM-DD')}'))`
        //     } : {},
        // queryObj.counselorId ? { counselorId: `'${queryObj.counselorId}'` } : {},
      ),
    ).replace(/"/g, '');
    //  这里要替换下，否则后台会理解为字符串而不是查询条件
    return `db.collection('fileList').where(${queryJsonString}).skip(${(pageNum - 1) *
      SINGLE_PAGE_SIZE}).limit(${SINGLE_PAGE_SIZE}).orderBy('timeStamp','desc').get()`;
}
