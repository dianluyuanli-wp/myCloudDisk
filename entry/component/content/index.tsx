import React, { useState } from 'react';
import { useEffect, useReducer } from 'react';
import * as s from './color.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Layout, Upload, Card, Button, message, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { reqPost as post, apiMap } from '@utils/api';
import { upload } from '@utils/upload';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { download, downloadUrlFile } from '@utils/down';
import { usePageManager, getQueryString, SINGLE_PAGE_SIZE } from '@utils/commonTools';
import { fileObj, parseList, columns, FileListAction } from './accessory';
const { Header, Content, Footer } = Layout;

function ShowComponent() {
    const [pageObj, setPage] = usePageManager();
    const [chekcList, setCheckList] = useState([]);

    function listReducer(state: Array<fileObj>, action: FileListAction): Array<fileObj> {
        const fileUpdate = () => {
            // eslint-disable-next-line no-underscore-dangle
            const index = state.findIndex(item => item._id === action.payload._id);
            if (index >= 0) {
                const target = state[index];
                target.timeStamp = action.payload.timeStamp;
                return [...state.slice(0, index), target, ...state.slice(index + 1)];
            } else {
                return (action?.payload ? [action.payload] : []).concat([...state])
            }
        }
        const actionMap = {
          init: () => action?.list || [],
          update: fileUpdate,
          delete: () => state.filter(item => action.keys.findIndex(sitem => sitem ===item._id) === -1)
        };
        return actionMap[action.type]();
      }
    const [fileList, setFList] = useReducer(listReducer, []);

    useEffect(() => {
        const initList = async function() {
            const res = await post(apiMap.QUERY_LIST, {
                queryString: getQueryString(1)
            });
            const list = parseList(res);
            setPage({ total: res.pager.Total });
            setFList({ type: 'init', list })
        };
        initList();
    }, []);

    async function handleChange(info: UploadChangeParam<UploadFile<any>>) {
        const { fileList: newFileList, file } = info;
        console.log(info);
        const ans = await upload(info);
        const { fileData = {} } = ans;
        if (fileData.fileName) {
            setFList({ type: 'update', payload: Object.assign(fileData, { key: fileData._id }) });
            message.success(`${info.file.name} 上传成功。`);
        } else {
          message.error(`${info.file.name} 上传失败。`);
          return;
        }
      }

    async function detail(page: number) {
        const res = await post(apiMap.QUERY_LIST, {
            queryString: getQueryString(page)
        });
        const showList = parseList(res);
        setPage({ current: page, total: res.pager.Total });
        setFList({ type: 'init', list: showList });
    }

    async function deleteFile() {
        const deleteList = fileList.filter(item => chekcList.findIndex(sitem => item._id === sitem) >= 0)
            .map(item => item.fileId);
        await post(apiMap.DELETE_FILE, {
            deleteFileList: deleteList
        });
        setFList({ type: 'delete', keys: chekcList });
    }

    async function downloadFile() {
        fileList.filter(item => chekcList.findIndex(sitem => item._id === sitem) >= 0)
        .map(item => item.downloadUrl).map(item => {
            const res = download(item);
            if (res !== true) {
                //  跨域错误无法捕获，如果返回不是true的话就走另外一个方法
                downloadUrlFile(item)
            }
        });
    }

    const paginaConfig = {
        onChange: detail,
        total: pageObj.total,
        current: pageObj.current,
        pageSize: SINGLE_PAGE_SIZE,
    };
    return (
        <Layout className={s.layout}>
            <Header>
                <div className={s.title}>自己的网盘</div>
            </Header>
            <Content style={{ padding: '50px 50px' }}>
                <div className={s.siteLayoutContent}>
                    <Upload
                        customRequest={() => {}}
                        onChange={handleChange}
                        showUploadList={false}
                        multiple={true}
                        //  directory={true}
                    >
                        <Button>
                            <UploadOutlined /> Click to Upload
                        </Button>
                    </Upload>
                    <Button className={s.deleteBtn} onClick={deleteFile} type='dashed'>删除</Button>
                    <Button className={s.downLBtn} onClick={downloadFile} type='primary'>下载</Button>
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                setCheckList(selectedRowKeys);
                            },
                        }}
                        pagination={paginaConfig} columns={columns} dataSource={fileList} />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Produced by 广兰路地铁</Footer>
        </Layout>
    )
}

export default withStyles(s)(ShowComponent);