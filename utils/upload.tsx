import {UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
//  import { reqPost, purePost } from '@/services/commonUtils';
import { reqPost, apiMap, request, host } from '@utils/api';
import { ProgressObj, ProgressAction } from '../entry/component/content/accessory';

const SIZE = 1 * 1024 * 1024; // 切片大小

// 生成文件切片
function createFileChunk(file: File | Blob | undefined, size = SIZE) {
    if (!file) {
        return [];
    }
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
    }
    return fileChunkList;
}

export function getBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString());
    reader.onerror = error => reject(error);
  });
}

interface FileObj extends File {
    name: string;
}

export async function uploadFile(params: FormData, fileName: string, cb: React.Dispatch<ProgressAction>) {
    return request(host + apiMap.UPLOAD_FILE_SLICE, {
        method: 'post',
        data: params,
    }).then(res => {
        cb({ type: 'update', fileName, finishedChunks: 1})
        console.log('完成一片')
    });
    //  return post(apiMap.UPLOAD_FILE_SLICE, params);
}

export async function fileMergeReq(name: string, fileSize: number) {
    return reqPost(apiMap.MERGE_SLICE, { fileName: name, size: SIZE, fileSize: fileSize });
}

export async function upload(info: UploadChangeParam<UploadFile<any>>, callBack: React.Dispatch<ProgressAction>) {
    const fileList = createFileChunk(info.file.originFileObj);
    if (!info.file.originFileObj) {
        return '';
    }
    const { name: filename, size: fileSize } = info.file.originFileObj as FileObj;
    const dataPkg = fileList.map(({ file }, index) => ({
        chunk: file,
        hash: `${filename}-${index}` // 文件名 + 数组下标
        }));
    const uploadReqList = dataPkg.map(({ chunk, hash}) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', filename);
        return formData
    });
    const initPro = {     
        fileName: filename,
        fullChunks: uploadReqList.length,
        finishedChunks: 0
    } as ProgressObj;
    callBack({ type: 'update', fileName: filename, payload: initPro });
    const promiseArr = uploadReqList.map(item => uploadFile(item, filename, callBack));
    await Promise.all(promiseArr);
    const ans = await fileMergeReq(filename, fileSize);
    return ans;
}