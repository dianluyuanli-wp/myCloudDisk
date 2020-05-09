import React, { useState } from 'react';
import { useEffect, useReducer } from 'react';
import * as s from './color.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Layout, Upload, Card, Button, message, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { post, apiMap } from '@utils/api';
import { upload } from '@utils/upload';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { download } from '@utils/down';
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
        // if (file.status === 'removed') {
        //   setFileList(newFileList);
        //   return;
        // }
        const ans = await upload(info);
        const { fileData = {}, isNew } = ans;
        if (fileData.fileName) {
            setFList({ type: 'update', payload: Object.assign(fileData, { key: fileData._id }) });
            message.success(`${info.file.name} 上传成功。`);
        } else {
          message.error(`${info.file.name} 上传失败。`);
          return;
        }
      }
    function download11() {
        download('https://7465-test-container-ojiv6-1301135971.tcb.qcloud.la/狗.jpg');
    };
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
        console.log(chekcList, '1111fe');
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
                <div className={s.title}>自己09的网盘</div>
            </Header>
            <Content style={{ padding: '50px 50px' }}>
                <div className={s.siteLayoutContent}>
                    <Upload
                        customRequest={() => {}}
                        onChange={handleChange}
                        showUploadList={false}
                    >
                        <Button>
                            <UploadOutlined /> Click to Upload
                        </Button>
                    </Upload>
                    <Button onClick={deleteFile} type='dashed'>删除</Button>
                    <Card><a target="_blank" download ='11111' href='https://7465-test-container-ojiv6-1301135971.tcb.qcloud.la/特惠倒计时.zip'>大家好</a>
                        <div onClick={download11}>来来阿狸</div>
                    </Card>
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                setCheckList(selectedRowKeys);
                                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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