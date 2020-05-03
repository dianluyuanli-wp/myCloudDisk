import React from 'react';
import { useEffect } from 'react';
//  import s from './color.css';
import * as s from './color.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Layout, Upload, Card, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { post, apiMap } from '@utils/api';
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
    return (
        <Layout className={s.layout}>
            <Header>
                <div className={s.title}>自己09的网盘</div>
            </Header>
            <Content style={{ padding: '50px 50px' }}>
                <div className={s.siteLayoutContent}>
                    <Upload>
                        <Button>
                            <UploadOutlined /> Click to Upload
                        </Button>
                    </Upload>
                    <Card><a target="_blank" href='https://7465-test-psy-qktuk-1301141699.tcb.qcloud.la/%E7%A9%BA%E7%99%BD%E8%83%8C%E6%99%AF.jpg'>大家好</a></Card>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Produced by 广兰路地铁</Footer>
        </Layout>
    )
}

export default withStyles(s)(ShowComponent);