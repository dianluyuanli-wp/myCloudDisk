import React from 'react';
import ActionText from '@widgets/actionText';
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

export interface ProgressObj {
    fileName: string,
    fullChunks: number,
    finishedChunks: number,
}

export interface ProgressAction {
    type: 'add' | 'delete' | 'update';
    fileName: string;
    payload?: ProgressObj;
    fullChunks?: number;
    finishedChunks?: number;
    list?: Array<ProgressObj>;
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

function fromatingSize(limit: number): string{
    var size = "";
    if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B"
    }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
        size = (limit/1024).toFixed(2) + "KB"
    }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
        size = (limit/(1024 * 1024)).toFixed(2) + "MB"
    }else{                                            //其他转化成GB
        size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
    }

    var sizeStr = size + "";                        //转成字符串
    var index = sizeStr.indexOf(".");                    //获取小数点处的索引
    var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
    if(dou == "00"){                                //判断后两位是否为00，如果是则删除00                
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
}

export const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => <ActionText text={text} />,
    },
    {
      title: 'downloadUrl',
      dataIndex: 'downloadUrl',
      key: 'downloadUrl',
      render: () => '我是马赛克，嘻嘻'
    },
    {
        title: '文件大小',
        dataIndex: 'size',
        key: 'size',
        render: (size: number) => fromatingSize(size)
    },
    {
        title: '上传时间',
        dataIndex: 'timeStamp',
        key: 'timeStamp',
        render: (stamp: number) => moment(stamp).format('MMMM Do YYYY, h:mm:ss a')
    }
];