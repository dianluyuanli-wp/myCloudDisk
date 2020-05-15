import React, { useState } from 'react';
import { useEffect, useReducer } from 'react';
import * as s from './index.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Layout, Upload, Card, Button, Form, Input } from 'antd';
import { post, apiMap } from '@utils/api';
import { upload } from '@utils/upload';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { download, downloadUrlFile } from '@utils/down';
import { usePageManager, getQueryString, SINGLE_PAGE_SIZE } from '@utils/commonTools';

const FormItem = Form.Item;

function Login() {
    const [secret, setSecret] = useState('');

    const info = function(event: React.ChangeEvent<HTMLInputElement>) {
        setSecret(event.target.value);
        console.log(event.target.value);
    }

    return (
        <div className={s.bg}>
            <div className={s.title}>欢迎进入DIY云盘</div>
            <div className={s.wrapper}>
                <FormItem className={s.input}>
                    <Input onChange={info}/>
                </FormItem>
                <Button className={s.button} type='primary'>喊出口号</Button>
            </div>

        </div>
    )
}

export default withStyles(s)(Login);