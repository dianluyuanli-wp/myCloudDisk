import React from 'react';
import ActionText from '../../widgets/actionText';
import moment from 'moment';

export interface fileObj {
    _id: string;
    fileName: string,
    downloadUrl: string,
    fileId: string,
    timeStamp?: number,
    size?: number,
}

export interface FileListAction {
    type: 'add' | 'init' | 'delete' | 'update';
    _id?: string;
    key?: string; 
    payload?: fileObj;
    keys?: Array<string>;
    list?: Array<fileObj>;
}

export function parseList(res: any): Array<fileObj> {
    return res.data
      .map((item: string): fileObj => JSON.parse(item))
      .map(
        ({ _id, ...rest }: fileObj) =>
          ({
            ...rest,
            _id,
            key: _id,
          } as fileObj),
      );
  }

export const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => <ActionText text={text} />,
    },
    {
      title: 'fileId',
      dataIndex: 'fileId',
      key: 'fileId',
    },
    {
        title: '上传时间',
        dataIndex: 'timeStamp',
        key: 'timeStamp',
        render: (stamp: number) => moment(stamp).format('MMMM Do YYYY, h:mm:ss a')
    }
];