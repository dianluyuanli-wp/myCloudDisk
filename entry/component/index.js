import React from 'react';
import s from './color.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Layout, Upload, Card, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

//  react hooks 写法
// const ShowComponent = () => {
//     useStyles(s);
//     return <div className={s.color}>英雄的中国人民万岁万岁！</div>
// }
// export default ShowComponent;


//  传统写法
function ShowComponent(props, context) {
    return (
        <Layout className={s.layout}>
            <Header>
                <div className={s.title}>自己的网盘</div>
            </Header>
            <Content style={{ padding: '50px 50px' }}>
                <div className={s.siteLayoutContent}>
                    <Upload>
                        <Button>
                            <UploadOutlined /> Click to Upload
                        </Button>
                    </Upload>
                    <Card>大家好</Card>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Produced by 广兰路地铁</Footer>
        </Layout>
    )
}

export default withStyles(s)(ShowComponent);