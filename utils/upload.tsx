import {UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
//  import { reqPost, purePost } from '@/services/commonUtils';
import { post, apiMap, request, host } from '@utils/api';

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

export async function uploadFile(params: FormData) {
    return request(host + apiMap.UPLOAD_FILE_SLICE, {
        method: 'post',
        data: params,
    });
    //  return post(apiMap.UPLOAD_FILE_SLICE, params);
}

export async function fileMergeReq(name: string) {
    return post(apiMap.MERGE_SLICE, { fileName: name, size: SIZE });
}

export async function upload(info: UploadChangeParam<UploadFile<any>>) {
    const fileList = createFileChunk(info.file.originFileObj);
    if (!info.file.originFileObj) {
        return '';
    }
    const { name: filename } = info.file.originFileObj as FileObj;
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
    }).map(item => uploadFile(item));
    await Promise.all(uploadReqList);
    const ans = await fileMergeReq(filename);
    return ans;
}