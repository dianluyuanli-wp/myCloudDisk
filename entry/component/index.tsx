import React from 'react';
import { useEffect } from 'react';
import * as s from './color.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Layout, Upload, Card, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { post, apiMap } from '@utils/api';
import { upload } from '@utils/upload';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { download } from '@utils/down';
const { Header, Content, Footer } = Layout;

//  react hooks 写法
// const ShowComponent = () => {
//     useStyles(s);
//     return <div className={s.color}>英雄的中国人民万岁万岁！</div>
// }
// export default ShowComponent;

//大家好
//  传统写法
function ShowComponent() {
    useEffect(() => {
        const test = async function() {
            const res = await post(apiMap.TEST, {});
            console.log(res);
        };
        console.log(12222)
        test();
    }, []);
    console.log('wefwef')

    async function handleChange(info: UploadChangeParam<UploadFile<any>>) {
        const { fileList: newFileList, file } = info;
        console.log(info);
        // if (file.status === 'removed') {
        //   setFileList(newFileList);
        //   return;
        // }
        const ans = await upload(info);
        if (ans.errmsg === 'ok') {
          message.success(`${info.file.name} 上传成功。`);
        } else {
          message.error(`${info.file.name} 上传失败。`);
          return;
        }
        // setFileList(
        //   newFileList.map(item => {
        //     if (item.name === file.name) {
        //       return Object.assign(item, { status: 'done', url: ans.file_list[0].download_url });
        //     }
        //     return item;
        //   }),
        // );
      }
    function downloadFile(fileName, content){
        var aLink = document.createElement('a');
        var blob = new Blob([content]);
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);
    }
    function download11() {
        download('https://7465-test-container-ojiv6-1301135971.tcb.qcloud.la/狗.jpg');
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
                    <Card><a target="_blank" download ='11111' href='https://7465-test-container-ojiv6-1301135971.tcb.qcloud.la/特惠倒计时.zip'>大家好</a>
                        <div onClick={download11}>来来阿狸</div>
                    </Card>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Produced by 广兰路地铁</Footer>
        </Layout>
    )
}

export default withStyles(s)(ShowComponent);